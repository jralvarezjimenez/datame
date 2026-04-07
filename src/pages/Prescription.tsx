import { useState, useEffect, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pill, X, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getPrescriptions, addPrescription, type Prescription as PrescriptionType } from '../services/clinical';

export function Prescription() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [records, setRecords] = useState<PrescriptionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { if (id) loadData(); }, [id]);

  async function loadData() {
    setLoading(true);
    try { setRecords(await getPrescriptions(id!)); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const active = records.filter((r) => r.status === 'active');
  const completed = records.filter((r) => r.status === 'completed');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link to={`/patients/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al Perfil
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold font-headline text-teal-900">Recetas</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-semibold text-sm active:scale-95 transition-transform">
          <Plus className="w-5 h-5" /> Nueva Receta
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : records.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center">
          <Pill className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-slate-600 mb-1">Sin recetas registradas</h3>
          <button onClick={() => setShowForm(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-semibold text-sm mt-4">Nueva Receta</button>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Activas ({active.length})</h2>
              <div className="space-y-3">
                {active.map((r) => <PrescriptionCard rx={r} key={r.id} />)}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Completadas ({completed.length})</h2>
              <div className="space-y-3 opacity-60">
                {completed.map((r) => <PrescriptionCard rx={r} key={r.id} />)}
              </div>
            </div>
          )}
        </>
      )}

      {showForm && <PrescriptionForm patientId={id!} user={user!} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); loadData(); }} />}
    </div>
  );
}

function PrescriptionCard({ rx }: { rx: PrescriptionType; key?: string }) {
  const isActive = rx.status === 'active';
  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
        {isActive ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800">{rx.medication}</h3>
          <span className={`text-[10px] font-black px-3 py-1 rounded-full ${isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
            {isActive ? 'ACTIVA' : 'COMPLETADA'}
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{rx.dosage} — {rx.frequency}</p>
        <p className="text-xs text-slate-400 mt-2">{rx.startDate} → {rx.endDate} • {rx.vetName}</p>
        {rx.notes && <p className="text-xs text-slate-500 mt-2">{rx.notes}</p>}
      </div>
    </div>
  );
}

function PrescriptionForm({ patientId, user, onClose, onSaved }: {
  patientId: string; user: { uid: string; displayName: string }; onClose: () => void; onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ medication: '', dosage: '', frequency: '', startDate: today, endDate: '', notes: '' });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.medication || !form.dosage) return;
    setSaving(true);
    try {
      await addPrescription({ patientId, vetName: user.displayName, status: 'active', ...form });
      onSaved();
    } catch (err) { console.error(err); setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-headline font-bold text-xl text-teal-900">Nueva Receta</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Medicamento *</label>
            <input type="text" required value={form.medication} onChange={(e) => set('medication', e.target.value)} placeholder="Ej: NexGard Spectra"
              className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dosis *</label>
              <input type="text" required value={form.dosage} onChange={(e) => set('dosage', e.target.value)} placeholder="Ej: 1 tableta 68mg"
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Frecuencia</label>
              <input type="text" value={form.frequency} onChange={(e) => set('frequency', e.target.value)} placeholder="Ej: Cada 30 días"
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Inicio</label>
              <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)}
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fin</label>
              <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)}
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
          </div>
          <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notas</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} placeholder="Indicaciones especiales"
              className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none resize-none" /></div>
          <button type="submit" disabled={saving} className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl active:scale-[0.98] disabled:opacity-50">{saving ? 'Guardando...' : 'Crear Receta'}</button>
        </form>
      </div>
    </div>
  );
}
