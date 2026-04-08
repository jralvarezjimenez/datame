import { useState, useEffect } from 'react';
import { Plus, Calendar, Users, ChevronRight, PawPrint, Stethoscope, Syringe, Package, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { getAllPatients, getPatientsByOwner, type Patient } from '../services/patients';
import { getAllAppointments, getAppointmentsByOwner, type Appointment } from '../services/appointments';
import { getConsultations, getVaccinations, type Vaccination } from '../services/clinical';
import { getAllItems, getLowStockItems } from '../services/inventory';
import { generateNudges, type Nudge } from '../services/nudges';
import { Onboarding } from '../components/Onboarding';

export function Dashboard() {
  const { user, isVetOrStaff } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [consultationCount, setConsultationCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadAll();
  }, [user, isVetOrStaff]);

  async function loadAll() {
    try {
      const userDoc = await getDoc(doc(db, 'users', user!.uid));
      if (!userDoc.data()?.onboardingComplete) setShowOnboarding(true);

      const pts = await getPatientsByOwner(user!.uid);
      const appts = await getAppointmentsByOwner(user!.uid);
      setPatients(pts);
      setAppointments(appts);

      // Load vaccinations for all patients (for nudges)
      let allVax: Vaccination[] = [];
      let totalConsultations = 0;
      for (const p of pts.slice(0, 20)) { // limit to avoid too many reads
        const vax = await getVaccinations(p.id);
        allVax = allVax.concat(vax);
        const consults = await getConsultations(p.id);
        totalConsultations += consults.length;
      }
      setVaccinations(allVax);
      setConsultationCount(totalConsultations);

      if (isVetOrStaff) {
        const items = await getAllItems();
        setLowStockCount(getLowStockItems(items).length);
      }

      setNudges(generateNudges(pts, appts, allVax));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const today = new Date().toISOString().split('T')[0];
  const activeCount = patients.filter((p) => p.status === 'active').length;
  const todayAppts = appointments.filter((a) => a.date === today && a.status === 'scheduled').length;
  const upcomingAppts = appointments.filter((a) => a.date >= today && a.status === 'scheduled').length;
  const overdueVax = vaccinations.filter((v) => v.status === 'overdue').length;
  const recentPatients = patients.slice(0, 4);

  // Species distribution for chart
  const speciesMap: Record<string, number> = {};
  patients.forEach((p) => { speciesMap[p.species] = (speciesMap[p.species] || 0) + 1; });
  const speciesEntries = Object.entries(speciesMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSpecies = Math.max(...speciesEntries.map(([, v]) => v), 1);

  const nudgeIcon: Record<string, string> = { social_proof: '👥', framing: '💡', urgency: '⚡', reward: '🏆', default: '📋' };
  const nudgeBg: Record<string, string> = {
    social_proof: 'bg-secondary/5 border-secondary/15',
    framing: 'bg-tertiary/5 border-tertiary/15',
    urgency: 'bg-primary/5 border-primary/15',
    reward: 'bg-[#FFD700]/5 border-[#FFD700]/15',
    default: 'bg-surface-container-low border-outline-variant/15',
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">
            Hola, {user?.displayName?.split(' ')[0] || 'Doctor'}
          </h2>
          <p className="text-on-surface-variant font-medium mt-1">
            {loading ? 'Cargando...' : `${patients.length} pacientes • ${todayAppts} citas hoy`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/patients" className="bg-surface-container-lowest text-primary border border-primary/20 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold clay-shadow hover:scale-105 active:scale-95 transition-transform">
            <Users className="w-5 h-5" /> Pacientes
          </Link>
          <Link to="/patients" className="bg-primary text-on-primary px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold clay-shadow-coral hover:scale-105 active:scale-95 transition-transform">
            <Plus className="w-5 h-5" /> Nuevo
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard label="Pacientes" value={loading ? '...' : String(patients.length)} icon={PawPrint} color="primary" />
        <StatCard label="Activos" value={loading ? '...' : String(activeCount)} icon={TrendingUp} color="secondary" />
        <StatCard label="Citas Hoy" value={loading ? '...' : String(todayAppts)} icon={Calendar} color="tertiary" />
        <StatCard label="Consultas" value={loading ? '...' : String(consultationCount)} icon={Stethoscope} color="primary" />
        <StatCard label="Vax Vencidas" value={loading ? '...' : String(overdueVax)} icon={Syringe} color="error" alert={overdueVax > 0} />
        <StatCard label="Stock Bajo" value={loading ? '...' : String(lowStockCount)} icon={Package} color="error" alert={lowStockCount > 0} />
      </section>

      {/* Nudges */}
      {!loading && nudges.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-tertiary" />
            <h3 className="font-headline font-bold text-on-surface">Insights Inteligentes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nudges.slice(0, 6).map((nudge) => (
              <div key={nudge.id} className={`p-4 rounded-2xl border ${nudgeBg[nudge.type]} transition-all hover:scale-[1.01]`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{nudgeIcon[nudge.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-on-surface">{nudge.title}</p>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{nudge.message}</p>
                    {nudge.action && nudge.actionLink && (
                      <Link to={nudge.actionLink} className="inline-flex items-center gap-1 text-xs font-bold text-primary mt-2 hover:underline">
                        {nudge.action} <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <section className="lg:col-span-2 space-y-8">
          {/* Analytics: Species Distribution */}
          {!loading && speciesEntries.length > 0 && (
            <div className="bg-surface-container-lowest rounded-3xl clay-shadow p-6">
              <h3 className="font-headline font-bold text-on-surface mb-4">Distribución por Especie</h3>
              <div className="space-y-3">
                {speciesEntries.map(([species, count]) => {
                  const pct = Math.round((count / maxSpecies) * 100);
                  const colors = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-primary/60', 'bg-secondary/60'];
                  const idx = speciesEntries.findIndex(([s]) => s === species);
                  return (
                    <div key={species} className="flex items-center gap-4">
                      <span className="text-sm font-bold text-on-surface w-20 truncate">{species}</span>
                      <div className="flex-1 bg-surface-container-high rounded-full h-6 overflow-hidden">
                        <div className={`h-full ${colors[idx] || 'bg-outline'} rounded-full transition-all duration-700 flex items-center justify-end pr-2`} style={{ width: `${Math.max(pct, 8)}%` }}>
                          <span className="text-[10px] font-black text-white">{count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Appointments Overview */}
          {!loading && (
            <div className="bg-surface-container-lowest rounded-3xl clay-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-bold text-on-surface">Citas</h3>
                <Link to="/agenda" className="text-sm font-bold text-primary hover:underline">Ver Agenda</Link>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-2xl">
                  <p className="text-2xl font-extrabold text-primary">{todayAppts}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Hoy</p>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-2xl">
                  <p className="text-2xl font-extrabold text-secondary">{upcomingAppts}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Próximas</p>
                </div>
                <div className="text-center p-4 bg-tertiary/5 rounded-2xl">
                  <p className="text-2xl font-extrabold text-tertiary">{appointments.filter((a) => a.status === 'completed').length}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Completadas</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Patients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold text-on-surface">Pacientes Recientes</h3>
              <Link to="/patients" className="text-sm font-bold text-primary hover:underline">Ver Todos</Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
            ) : recentPatients.length === 0 ? (
              <div className="bg-surface-container-lowest p-12 rounded-3xl clay-shadow text-center">
                <PawPrint className="w-12 h-12 text-outline-variant mx-auto mb-3" />
                <p className="text-on-surface-variant font-medium">No hay pacientes aún</p>
                <Link to="/patients" className="text-primary font-bold text-sm hover:underline mt-2 inline-block">Registrar el primero</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <Link key={patient.id} to={`/patients/${patient.id}`}
                    className="group bg-surface-container-lowest p-4 rounded-2xl clay-shadow flex items-center gap-4 hover:scale-[1.01] transition-transform">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg overflow-hidden shrink-0">
                      {patient.imageUrl ? <img src={patient.imageUrl} alt={patient.name} className="w-full h-full object-cover" /> : patient.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-on-surface truncate">{patient.name}</h4>
                      <p className="text-xs text-on-surface-variant">{patient.species} • {patient.breed} • {patient.ownerName}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="bg-primary-container/20 p-6 rounded-3xl border border-primary/10">
            <h3 className="font-headline font-bold text-on-surface mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <QuickLink to="/patients" icon={PawPrint} label="Pacientes" color="text-primary" />
              <QuickLink to="/agenda" icon={Calendar} label="Agenda" color="text-secondary" />
              <QuickLink to="/inventory" icon={Package} label="Inventario" color="text-tertiary" />
              <QuickLink to="/alerts" icon={Sparkles} label="Alertas" color="text-error" />
            </div>
          </section>

          <section className="bg-surface-container-lowest p-6 rounded-3xl clay-shadow">
            <h3 className="font-headline font-bold text-on-surface mb-3">Tu Perfil</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : user?.displayName?.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-bold text-sm text-on-surface">{user?.displayName}</p>
                <p className="text-xs text-on-surface-variant capitalize">{user?.role === 'veterinarian' ? 'Veterinario' : user?.role === 'staff' ? 'Staff' : 'Propietario'}</p>
              </div>
            </div>
          </section>

          {/* Vaccination Summary */}
          {!loading && vaccinations.length > 0 && (
            <section className="bg-surface-container-lowest p-6 rounded-3xl clay-shadow">
              <h3 className="font-headline font-bold text-on-surface mb-3">Vacunaciones</h3>
              <div className="space-y-2">
                <VaxBar label="Vigentes" count={vaccinations.filter((v) => v.status === 'valid').length} total={vaccinations.length} color="bg-secondary" />
                <VaxBar label="Próximas" count={vaccinations.filter((v) => v.status === 'due_soon').length} total={vaccinations.length} color="bg-[#F59E0B]" />
                <VaxBar label="Vencidas" count={overdueVax} total={vaccinations.length} color="bg-error" />
              </div>
            </section>
          )}
        </aside>
      </div>

      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, alert }: {
  label: string; value: string; icon: typeof PawPrint; color: string; alert?: boolean;
}) {
  return (
    <div className={`bg-surface-container-lowest p-4 rounded-2xl clay-shadow flex flex-col justify-between h-28 transition-all hover:scale-[1.02] ${alert ? 'ring-2 ring-error/30' : ''}`}>
      <div className={`p-1.5 bg-${color}/10 rounded-lg text-${color} w-fit`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-on-surface">{value}</p>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label, color }: { to: string; icon: typeof PawPrint; label: string; color: string }) {
  return (
    <Link to={to} className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl clay-shadow flex items-center gap-3 text-sm font-bold text-on-surface hover:scale-[1.02] transition-transform">
      <Icon className={`w-5 h-5 ${color}`} /> {label}
    </Link>
  );
}

function VaxBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-bold text-on-surface-variant">{label}</span>
        <span className="font-bold text-on-surface">{count}</span>
      </div>
      <div className="w-full bg-surface-container-high rounded-full h-2">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
    </div>
  );
}
