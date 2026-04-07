import { useState, useEffect, type FormEvent } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, X, ChevronLeft, ChevronRight, CheckCircle2, XCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllAppointments, getAppointmentsByOwner, createAppointment, updateAppointment, type Appointment, type AppointmentInput } from '../services/appointments';
import { generateAppointmentReminder } from '../services/whatsapp';
import { getAllPatients, getPatientsByOwner, type Patient } from '../services/patients';

export function Agenda() {
  const { user, isVetOrStaff } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => { if (user) loadAll(); }, [user]);

  async function loadAll() {
    setLoading(true);
    try {
      const [appts, pts] = await Promise.all([
        isVetOrStaff ? getAllAppointments() : getAppointmentsByOwner(user!.uid),
        isVetOrStaff ? getAllPatients() : getPatientsByOwner(user!.uid),
      ]);
      setAppointments(appts);
      setPatients(pts);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const dayAppointments = appointments
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const todayStr = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter((a) => a.date >= todayStr && a.status === 'scheduled').length;

  function shiftDate(days: number) {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  async function markStatus(id: string, status: 'completed' | 'cancelled') {
    await updateAppointment(id, { status });
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }

  const statusColor = {
    scheduled: 'bg-primary/10 text-primary',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-600',
  };
  const statusLabel = { scheduled: 'Programada', completed: 'Completada', cancelled: 'Cancelada' };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-headline text-teal-900">Agenda</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {loading ? 'Cargando...' : `${upcoming} citas próximas`}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md shadow-primary/20 active:scale-95 transition-all">
          <Plus className="w-5 h-5" /> Nueva Cita
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/10">
        <button onClick={() => shiftDate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
        <div className="text-center">
          <p className="font-headline font-bold text-lg text-teal-900 capitalize">{formatDate(selectedDate)}</p>
          {selectedDate === todayStr && <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">HOY</span>}
        </div>
        <button onClick={() => shiftDate(1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
      </div>

      {/* Quick date buttons */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedDate(todayStr)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedDate === todayStr ? 'bg-primary text-on-primary' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Hoy</button>
        {[1, 2, 3, 7].map((d) => {
          const target = new Date(); target.setDate(target.getDate() + d);
          const targetStr = target.toISOString().split('T')[0];
          const label = d === 7 ? '+7 días' : d === 1 ? 'Mañana' : `+${d} días`;
          return (
            <button key={d} onClick={() => setSelectedDate(targetStr)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedDate === targetStr ? 'bg-primary text-on-primary' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{label}</button>
          );
        })}
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : dayAppointments.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center">
          <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-slate-600 mb-1">Sin citas para este día</h3>
          <p className="text-sm text-slate-400 mb-4">Programa una nueva cita</p>
          <button onClick={() => setShowForm(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-semibold text-sm">Nueva Cita</button>
        </div>
      ) : (
        <div className="space-y-3">
          {dayAppointments.map((appt) => (
            <div key={appt.id} className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-slate-800">{appt.time}</h3>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${statusColor[appt.status]}`}>{statusLabel[appt.status].toUpperCase()}</span>
                </div>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  <Link to={`/patients/${appt.patientId}`} className="text-primary hover:underline">{appt.patientName}</Link>
                  {' '}({appt.species}) — {appt.reason}
                </p>
                <p className="text-xs text-slate-400 mt-1">Propietario: {appt.ownerName} • {appt.vetName}</p>
              </div>
              {appt.status === 'scheduled' && (
                <div className="flex gap-2 shrink-0">
                  <a href={generateAppointmentReminder(appt)} target="_blank" rel="noopener noreferrer" title="Recordatorio WhatsApp" className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <button onClick={() => markStatus(appt.id, 'completed')} title="Completar" className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => markStatus(appt.id, 'cancelled')} title="Cancelar" className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && <AppointmentForm patients={patients} user={user!} defaultDate={selectedDate} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); loadAll(); }} />}
    </div>
  );
}

function AppointmentForm({ patients, user, defaultDate, onClose, onSaved }: {
  patients: Patient[]; user: { uid: string; displayName: string }; defaultDate: string; onClose: () => void; onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<AppointmentInput>>({
    patientId: '', patientName: '', species: '', ownerId: '', ownerName: '',
    date: defaultDate, time: '09:00', reason: '', vetName: user.displayName, status: 'scheduled', notes: '',
  });

  function selectPatient(patientId: string) {
    const p = patients.find((pt) => pt.id === patientId);
    if (p) {
      setForm((prev) => ({ ...prev, patientId: p.id, patientName: p.name, species: p.species, ownerId: p.ownerId, ownerName: p.ownerName }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.patientId || !form.reason || !form.date || !form.time) return;
    setSaving(true);
    try { await createAppointment(form as AppointmentInput); onSaved(); }
    catch (err) { console.error(err); setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-headline font-bold text-xl text-teal-900">Nueva Cita</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Paciente *</label>
            <select required value={form.patientId} onChange={(e) => selectPatient(e.target.value)}
              className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none cursor-pointer">
              <option value="">Seleccionar paciente...</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.species} - {p.ownerName})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fecha *</label>
              <input type="date" required value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hora *</label>
              <input type="time" required value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
          </div>
          <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Motivo *</label>
            <input type="text" required value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} placeholder="Ej: Chequeo anual, Vacunación"
              className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
          <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notas</label>
            <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Observaciones"
              className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none resize-none" /></div>
          <button type="submit" disabled={saving} className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl active:scale-[0.98] disabled:opacity-50">{saving ? 'Guardando...' : 'Programar Cita'}</button>
        </form>
      </div>
    </div>
  );
}
