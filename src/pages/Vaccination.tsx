import { useState, useEffect, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Syringe, X, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getVaccinations, addVaccination, type Vaccination as VaccinationType } from '../services/clinical';

export function Vaccination() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [records, setRecords] = useState<VaccinationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { if (id) loadData(); }, [id]);

  async function loadData() {
    setLoading(true);
    try { setRecords(await getVaccinations(id!)); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const statusIcon = { valid: CheckCircle2, due_soon: Clock, overdue: AlertCircle };
  const statusColor = { valid: 'text-emerald-600 bg-emerald-50', due_soon: 'text-amber-600 bg-amber-50', overdue: 'text-red-600 bg-red-50' };
  const statusLabel = { valid: 'Vigente', due_soon: 'Próxima', overdue: 'Vencida' };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link to={`/patients/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al Perfil
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold font-headline text-teal-900">Vacunaciones</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-semibold text-sm active:scale-95 transition-transform">
          <Plus className="w-5 h-5" /> Nueva Vacuna
        </button>
      </div>

      {/* Summary */}
      {!loading && records.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {(['valid', 'due_soon', 'overdue'] as const).map((s) => {
            const count = records.filter((r) => r.status === s).length;
            const Icon = statusIcon[s];
            return (
              <div key={s} className={`p-4 rounded-xl flex items-center gap-3 ${statusColor[s]}`}>
                <Icon className="w-6 h-6" />
                <div><p className="text-2xl font-extrabold">{count}</p><p className="text-xs font-bold uppercase">{statusLabel[s]}</p></div>
              </div>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : records.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center">
          <Syringe className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-slate-600 mb-1">Sin vacunas registradas</h3>
          <button onClick={() => setShowForm(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-semibold text-sm mt-4">Registrar Vacuna</button>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
          <table className="w-full text-left">
            <thead><tr className="bg-surface-container-low text-on-surface-variant">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Vacuna</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Aplicación</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Próxima</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Veterinario</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Estado</th>
            </tr></thead>
            <tbody className="divide-y divide-outline-variant/10">
              {records.map((r) => {
                const Icon = statusIcon[r.status];
                return (
                  <tr key={r.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4 font-bold text-sm text-slate-800">{r.vaccine}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{r.dateAdministered}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{r.nextDueDate}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{r.vetName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${statusColor[r.status]}`}>
                        <Icon className="w-3.5 h-3.5" /> {statusLabel[r.status].toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <VaccineForm patientId={id!} user={user!} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); loadData(); }} />}
    </div>
  );
}

function VaccineForm({ patientId, user, onClose, onSaved }: {
  patientId: string; user: { uid: string; displayName: string }; onClose: () => void; onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ vaccine: '', dateAdministered: today, nextDueDate: '', batch: '', status: 'valid' as const });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.vaccine) return;
    setSaving(true);
    try {
      await addVaccination({ patientId, vetName: user.displayName, ...form, status: form.status as 'valid' | 'due_soon' | 'overdue' });
      onSaved();
    } catch (err) { console.error(err); setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-headline font-bold text-xl text-teal-900">Nueva Vacuna</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Vacuna *</label>
            <input type="text" required value={form.vaccine} onChange={(e) => set('vaccine', e.target.value)} placeholder="Ej: Rabia, DHPP, Triple Felina"
              className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fecha aplicación</label>
              <input type="date" value={form.dateAdministered} onChange={(e) => set('dateAdministered', e.target.value)}
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Próxima dosis</label>
              <input type="date" value={form.nextDueDate} onChange={(e) => set('nextDueDate', e.target.value)}
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
          </div>
          <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lote (opcional)</label>
            <input type="text" value={form.batch} onChange={(e) => set('batch', e.target.value)} placeholder="Ej: RAB-9921-A"
              className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" /></div>
          <button type="submit" disabled={saving} className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl active:scale-[0.98] disabled:opacity-50">{saving ? 'Guardando...' : 'Registrar Vacuna'}</button>
        </form>
      </div>
    </div>
  );
}
