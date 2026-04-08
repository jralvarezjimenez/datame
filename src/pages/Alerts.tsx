import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Calendar, Syringe, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllPatients, getPatientsByOwner, type Patient } from '../services/patients';
import { getAllAppointments, getAppointmentsByOwner, type Appointment } from '../services/appointments';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'upcoming';
  title: string;
  message: string;
  link?: string;
}

export function Alerts() {
  const { user, isVetOrStaff } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) generateAlerts(); }, [user]);

  async function generateAlerts() {
    setLoading(true);
    try {
      const [patients, appointments] = await Promise.all([
        getPatientsByOwner(user!.uid),
        getAppointmentsByOwner(user!.uid),
      ]);

      const generated: Alert[] = [];
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];

      // Upcoming appointments (next 7 days)
      const upcoming = appointments.filter((a) => a.status === 'scheduled' && a.date >= today && a.date <= nextWeekStr);
      upcoming.forEach((appt) => {
        const isToday = appt.date === today;
        generated.push({
          id: `appt-${appt.id}`,
          type: isToday ? 'warning' : 'upcoming',
          title: `${isToday ? 'HOY' : 'Próxima cita'}: ${appt.patientName}`,
          message: `${appt.reason} — ${appt.date} a las ${appt.time} (${appt.ownerName})`,
          link: `/patients/${appt.patientId}`,
        });
      });

      // Patients without recent activity (inactive check)
      const inactive = patients.filter((p) => p.status === 'inactive');
      if (inactive.length > 0) {
        generated.push({
          id: 'inactive-patients',
          type: 'info',
          title: `${inactive.length} paciente${inactive.length > 1 ? 's' : ''} inactivo${inactive.length > 1 ? 's' : ''}`,
          message: `${inactive.map((p) => p.name).join(', ')} — considera revisar su estado`,
          link: '/patients',
        });
      }

      // Welcome alert if no data yet
      if (patients.length === 0) {
        generated.push({
          id: 'welcome',
          type: 'info',
          title: 'Bienvenido a DATA ME',
          message: 'Comienza registrando tu primer paciente para activar el sistema.',
          link: '/patients',
        });
      }

      // No upcoming appointments alert
      if (appointments.filter((a) => a.status === 'scheduled' && a.date >= today).length === 0 && patients.length > 0) {
        generated.push({
          id: 'no-appointments',
          type: 'info',
          title: 'Sin citas programadas',
          message: 'No tienes citas próximas. Programa una nueva desde la Agenda.',
          link: '/agenda',
        });
      }

      setAlerts(generated);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const iconMap = { warning: AlertTriangle, info: Bell, upcoming: Calendar };
  const colorMap = {
    warning: { bg: 'bg-error-container/20 border-error-container/50', icon: 'bg-error-container text-error' },
    info: { bg: 'bg-surface-container-lowest border-outline-variant/15', icon: 'bg-primary/10 text-primary' },
    upcoming: { bg: 'bg-amber-50 border-amber-200/50', icon: 'bg-amber-100 text-amber-600' },
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-headline text-teal-900">Alertas y Recordatorios</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          {loading ? 'Cargando...' : `${alerts.length} alerta${alerts.length !== 1 ? 's' : ''} activa${alerts.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : alerts.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center">
          <PawPrint className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-slate-600 mb-1">Todo en orden</h3>
          <p className="text-sm text-slate-400">No hay alertas pendientes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = iconMap[alert.type];
            const colors = colorMap[alert.type];
            const content = (
              <div className={`${colors.bg} border p-4 rounded-xl flex gap-4 items-start transition-all hover:shadow-sm`}>
                <div className={`w-10 h-10 rounded-full ${colors.icon} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{alert.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                </div>
              </div>
            );
            return alert.link ? (
              <Link key={alert.id} to={alert.link} className="block">{content}</Link>
            ) : (
              <div key={alert.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
