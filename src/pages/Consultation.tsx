import { useState, useEffect, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Stethoscope, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getConsultations, addConsultation, type Consultation as ConsultationType } from '../services/clinical';

export function Consultation() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [records, setRecords] = useState<ConsultationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { if (id) loadData(); }, [id]);

  async function loadData() {
    setLoading(true);
    try { setRecords(await getConsultations(id!)); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link to={`/patients/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al Perfil
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold font-headline text-teal-900">Consultas</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-semibold text-sm active:scale-95 transition-transform">
          <Plus className="w-5 h-5" /> Nueva Consulta
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : records.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center">
          <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-slate-600 mb-1">Sin consultas registradas</h3>
          <button onClick={() => setShowForm(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-semibold text-sm mt-4">Registrar Consulta</button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((r) => (
            <div key={r.id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Stethoscope className="w-5 h-5" /></div>
                <div><h3 className="font-bold text-slate-800">{r.reason}</h3><p className="text-xs text-slate-400">{r.date} • {r.vetName}</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">Diagnóstico</p><p className="text-sm text-slate-700">{r.diagnosis}</p></div>
                <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">Tratamiento</p><p className="text-sm text-slate-700">{r.treatment}</p></div>
              </div>
              {r.notes && <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-slate-100">{r.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {showForm && <ConsultationForm patientId={id!} user={user!} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); loadData(); }} />}
    </div>
  );
}

function ConsultationForm({ patientId, user, onClose, onSaved }: {
  patientId: string; user: { uid: string; displayName: string }; onClose: () => void; onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], reason: '', diagnosis: '', treatment: '', notes: '' });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.reason || !form.diagnosis) return;
    setSaving(true);
    try { await addConsultation({ patientId, vetId: user.uid, vetName: user.displayName, ...form }); onSaved(); }
    catch (err) { console.error(err); setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-headline font-bold text-xl text-teal-900">Nueva Consulta</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <InputField label="Fecha" type="date" value={form.date} onChange={(v) => set('date', v)} />
          <InputField label="Motivo *" value={form.reason} onChange={(v) => set('reason', v)} placeholder="Ej: Chequeo anual" required />
          <InputField label="Diagnóstico *" value={form.diagnosis} onChange={(v) => set('diagnosis', v)} placeholder="Ej: Paciente saludable" required />
          <InputField label="Tratamiento" value={form.treatment} onChange={(v) => set('treatment', v)} placeholder="Ej: Desparasitación" />
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notas</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} placeholder="Observaciones" className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none resize-none" />
          </div>
          <button type="submit" disabled={saving} className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl active:scale-[0.98] disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar Consulta'}</button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, required, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
    </div>
  );
}
