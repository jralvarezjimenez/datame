import { useState, useEffect } from 'react';
import { PawPrint, Calendar, Syringe, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPatientsByOwner, type Patient } from '../services/patients';
import { getAppointmentsByOwner, type Appointment } from '../services/appointments';

export function Portal() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadData(); }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const [pts, appts] = await Promise.all([
        getPatientsByOwner(user!.uid),
        getAppointmentsByOwner(user!.uid),
      ]);
      setPatients(pts);
      setAppointments(appts);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const today = new Date().toISOString().split('T')[0];
  const upcomingAppts = appointments.filter((a) => a.date >= today && a.status === 'scheduled');

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold font-headline text-teal-900 mb-2">Portal del Propietario</h1>
        <p className="text-slate-500">
          Bienvenido, {user?.displayName}. Aquí puedes ver la información de tus mascotas.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* My Pets */}
          <section>
            <h2 className="text-xl font-bold font-headline text-teal-900 mb-4">Mis Mascotas</h2>
            {patients.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-12 text-center">
                <PawPrint className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No tienes mascotas registradas</p>
                <p className="text-sm text-slate-400 mt-1">Contacta a tu clínica para registrar a tu mascota</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patients.map((pet) => (
                  <Link key={pet.id} to={`/patients/${pet.id}`}
                    className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:border-primary/20 hover:shadow-md transition-all flex items-center gap-5">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0 overflow-hidden">
                      {pet.imageUrl ? <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" /> : pet.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-teal-900">{pet.name}</h3>
                      <p className="text-sm text-slate-500">{pet.species} • {pet.breed}</p>
                      <p className="text-xs text-slate-400 mt-1">{pet.age} {pet.age === 1 ? 'año' : 'años'}{pet.weight ? ` • ${pet.weight} kg` : ''}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Upcoming Appointments */}
          <section>
            <h2 className="text-xl font-bold font-headline text-teal-900 mb-4">Próximas Citas</h2>
            {upcomingAppts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-8 text-center">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Sin citas programadas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppts.map((appt) => (
                  <div key={appt.id} className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800">{appt.patientName} — {appt.reason}</h3>
                      <p className="text-sm text-slate-500">{appt.date} a las {appt.time}</p>
                    </div>
                    <span className="text-[10px] font-black px-3 py-1 rounded-full bg-primary/10 text-primary">PROGRAMADA</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions for Owners */}
          <section>
            <h2 className="text-xl font-bold font-headline text-teal-900 mb-4">Accesos Rápidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/patients" className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 hover:border-primary/30 transition-all text-center group">
                <PawPrint className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-slate-800 mb-1">Mis Mascotas</h3>
                <p className="text-xs text-slate-500">Ver perfiles y registros</p>
              </Link>
              <Link to="/agenda" className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 hover:border-secondary/30 transition-all text-center group">
                <Calendar className="w-8 h-8 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-slate-800 mb-1">Agenda</h3>
                <p className="text-xs text-slate-500">Ver próximas citas</p>
              </Link>
              <Link to="/alerts" className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 hover:border-tertiary/30 transition-all text-center group">
                <Syringe className="w-8 h-8 text-tertiary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-slate-800 mb-1">Alertas</h3>
                <p className="text-xs text-slate-500">Recordatorios y avisos</p>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
