import { useState, useEffect } from 'react';
import { Plus, Calendar, UserPlus, Syringe, Users, ChevronRight, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllPatients, getPatientsByOwner, type Patient } from '../services/patients';

export function Dashboard() {
  const { user, isVetOrStaff } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = isVetOrStaff ? await getAllPatients() : await getPatientsByOwner(user.uid);
        setPatients(data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, isVetOrStaff]);

  const activeCount = patients.filter((p) => p.status === 'active').length;
  const speciesCount = new Set(patients.map((p) => p.species)).size;
  const recentPatients = patients.slice(0, 5);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">
            Hola, {user?.displayName?.split(' ')[0] || 'Doctor'}
          </h2>
          <p className="text-on-surface-variant font-medium mt-1">
            {loading ? 'Cargando datos...' : `Tienes ${patients.length} pacientes registrados.`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/patients"
            className="bg-surface-container-lowest text-primary border border-primary/20 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-primary/5 transition-all active:scale-95"
          >
            <Users className="w-5 h-5" />
            Ver Pacientes
          </Link>
          <Link
            to="/patients"
            className="bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Nuevo Paciente
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={PawPrint} label="Total Pacientes" value={loading ? '...' : String(patients.length)} badge="TOTAL" color="primary" />
        <StatCard icon={UserPlus} label="Pacientes Activos" value={loading ? '...' : String(activeCount)} badge="ACTIVOS" color="secondary" />
        <StatCard icon={Calendar} label="Especies" value={loading ? '...' : String(speciesCount)} badge="TIPOS" color="tertiary" />
        <StatCard icon={Syringe} label="Registros Clínicos" value="--" badge="PRÓXIMO" color="error" />
      </section>

      {/* Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-teal-900 font-headline">Pacientes Recientes</h3>
            <Link to="/patients" className="text-sm font-bold text-primary hover:underline">Ver Todos</Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : recentPatients.length === 0 ? (
            <div className="bg-surface-container-lowest p-12 rounded-2xl text-center">
              <PawPrint className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No hay pacientes aún</p>
              <Link to="/patients" className="text-primary font-bold text-sm hover:underline mt-2 inline-block">Registrar el primero</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <Link
                  key={patient.id}
                  to={`/patients/${patient.id}`}
                  className="group bg-surface-container-lowest p-5 rounded-2xl flex items-center gap-5 shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/10"
                >
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
                    {patient.imageUrl ? (
                      <img src={patient.imageUrl} alt={patient.name} className="w-full h-full object-cover" />
                    ) : (
                      patient.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-on-surface truncate">{patient.name}</h4>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                        patient.status === 'active'
                          ? 'text-teal-800 bg-teal-50'
                          : 'text-slate-500 bg-slate-50'
                      }`}>
                        {patient.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-on-surface-variant">{patient.species} • {patient.breed}</p>
                    <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">
                      Propietario: {patient.ownerName}
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Quick Info */}
        <aside className="space-y-8">
          <section className="bg-primary-container/20 p-6 rounded-2xl border border-primary/10">
            <h3 className="text-lg font-bold text-teal-900 mb-4 font-headline">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link to="/patients" className="w-full bg-white text-primary px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm hover:shadow-md transition-all">
                <PawPrint className="w-5 h-5" />
                Gestionar Pacientes
              </Link>
              <Link to="/agenda" className="w-full bg-white text-on-surface px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm hover:shadow-md transition-all">
                <Calendar className="w-5 h-5 text-secondary" />
                Ver Agenda
              </Link>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-on-surface font-headline mb-3">Tu Rol</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.displayName?.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-800">{user?.displayName}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role === 'veterinarian' ? 'Veterinario' : user?.role === 'staff' ? 'Staff' : 'Propietario'}</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, badge, color }: {
  icon: typeof PawPrint; label: string; value: string; badge: string; color: string;
}) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between h-40 shadow-sm transition-all hover:shadow-md border border-transparent hover:border-outline-variant/20">
      <div className="flex justify-between items-start">
        <div className={`p-2 bg-${color}/10 rounded-lg text-${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-[10px] font-bold text-${color} px-2 py-1 bg-${color}/10 rounded-full`}>{badge}</span>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-on-surface">{value}</p>
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}
