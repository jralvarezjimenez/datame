import { useState, useEffect, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Stethoscope, X, Heart, Thermometer, Activity, Weight, Eye, Droplets, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getConsultations, addConsultation, type Consultation as ConsultationType, type VitalSigns } from '../services/clinical';
import { generateSOAP, isAIAvailable } from '../services/aiAssistant';
import { getPatient } from '../services/patients';

export function Consultation() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [records, setRecords] = useState<ConsultationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [patientInfo, setPatientInfo] = useState<{ species: string; breed: string; age: number; weight?: number } | null>(null);

  useEffect(() => {
    if (id) {
      loadData();
      getPatient(id).then((p) => { if (p) setPatientInfo({ species: p.species, breed: p.breed, age: p.age, weight: p.weight }); });
    }
  }, [id]);

  async function loadData() {
    setLoading(true);
    try { setRecords(await getConsultations(id!)); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Link to={`/patients/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al Perfil
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold font-headline text-on-surface">Historia Clínica</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">Formato SOAP — Ley 576/2000</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-2xl font-semibold text-sm clay-shadow-coral active:scale-95 transition-transform">
          <Plus className="w-5 h-5" /> Nueva Consulta
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : records.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-16 text-center clay-shadow">
          <Stethoscope className="w-16 h-16 text-outline-variant mx-auto mb-4" />
          <h3 className="font-bold text-lg text-on-surface mb-1">Sin consultas registradas</h3>
          <p className="text-sm text-on-surface-variant mb-6">Registra la primera consulta con formato SOAP</p>
          <button onClick={() => setShowForm(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-2xl font-semibold text-sm clay-shadow-coral">Registrar Consulta</button>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map((r) => <SOAPCard key={r.id} record={r} />)}
        </div>
      )}

      {showForm && (
        <SOAPForm
          patientId={id!}
          user={user!}
          patientInfo={patientInfo}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); loadData(); }}
        />
      )}
    </div>
  );
}

/* ─── SOAP Record Card ─── */
function SOAPCard({ record: r }: { record: ConsultationType; key?: string }) {
  const [expanded, setExpanded] = useState(false);
  const hasSOAP = r.subjective || r.objective || r.assessment || r.plan;

  return (
    <div className="bg-surface-container-lowest rounded-3xl clay-shadow overflow-hidden">
      {/* Header */}
      <div
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-surface-container-low/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-on-surface text-lg">{r.reason}</h3>
            <p className="text-sm text-on-surface-variant">{r.date} — Dr(a). {r.vetName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasSOAP && (
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-secondary/10 text-secondary">SOAP</span>
          )}
          {expanded ? <ChevronUp className="w-5 h-5 text-on-surface-variant" /> : <ChevronDown className="w-5 h-5 text-on-surface-variant" />}
        </div>
      </div>

      {/* Expanded SOAP Content */}
      {expanded && (
        <div className="px-6 pb-6 space-y-4">
          {/* Vital Signs */}
          {r.vitals && <VitalsDisplay vitals={r.vitals} />}

          {/* SOAP Sections */}
          {hasSOAP ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SOAPSection letter="S" title="Subjetivo" content={r.subjective} color="coral" description="Anamnesis del propietario" />
              <SOAPSection letter="O" title="Objetivo" content={r.objective} color="mint" description="Examen físico y hallazgos" />
              <SOAPSection letter="A" title="Análisis" content={r.assessment || r.diagnosis} color="lavender" description="Diagnóstico / diferenciales" />
              <SOAPSection letter="P" title="Plan" content={r.plan || r.treatment} color="coral" description="Tratamiento y seguimiento" />
            </div>
          ) : (
            /* Legacy format fallback */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-4 rounded-2xl">
                <p className="text-xs font-bold text-on-surface-variant uppercase mb-1.5">Diagnóstico</p>
                <p className="text-sm text-on-surface">{r.diagnosis}</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl">
                <p className="text-xs font-bold text-on-surface-variant uppercase mb-1.5">Tratamiento</p>
                <p className="text-sm text-on-surface">{r.treatment}</p>
              </div>
            </div>
          )}

          {r.notes && (
            <div className="bg-surface-container-low p-4 rounded-2xl">
              <p className="text-xs font-bold text-on-surface-variant uppercase mb-1.5">Notas Adicionales</p>
              <p className="text-sm text-on-surface">{r.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SOAPSection({ letter, title, content, color, description }: {
  letter: string; title: string; content?: string; color: string; description: string;
}) {
  if (!content) return null;
  const colors: Record<string, string> = {
    coral: 'bg-primary/10 text-primary',
    mint: 'bg-secondary/10 text-secondary',
    lavender: 'bg-tertiary/10 text-tertiary',
  };
  return (
    <div className="bg-surface-container-low p-4 rounded-2xl">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-8 h-8 rounded-xl ${colors[color]} flex items-center justify-center font-extrabold text-sm`}>{letter}</span>
        <div>
          <p className="text-xs font-bold text-on-surface uppercase">{title}</p>
          <p className="text-[10px] text-on-surface-variant">{description}</p>
        </div>
      </div>
      <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function VitalsDisplay({ vitals }: { vitals: VitalSigns }) {
  const items = [
    { icon: Weight, label: 'Peso', value: vitals.weight, unit: 'kg', color: 'text-primary' },
    { icon: Thermometer, label: 'Temp', value: vitals.temperature, unit: '°C', color: 'text-error' },
    { icon: Heart, label: 'FC', value: vitals.heartRate, unit: 'lpm', color: 'text-primary' },
    { icon: Activity, label: 'FR', value: vitals.respiratoryRate, unit: 'rpm', color: 'text-tertiary' },
    { icon: Eye, label: 'Mucosas', value: vitals.mucousMembranes, unit: '', color: 'text-secondary' },
    { icon: Droplets, label: 'TRC', value: vitals.capillaryRefillTime, unit: 's', color: 'text-secondary' },
  ].filter((i) => i.value !== undefined && i.value !== '');

  if (items.length === 0) return null;

  return (
    <div className="bg-primary-container/20 rounded-2xl p-4">
      <p className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">Signos Vitales</p>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <item.icon className={`w-4 h-4 ${item.color} mx-auto mb-1`} />
            <p className="text-lg font-extrabold text-on-surface">{item.value}<span className="text-xs font-medium text-on-surface-variant ml-0.5">{item.unit}</span></p>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SOAP Form ─── */
function SOAPForm({ patientId, user, patientInfo, onClose, onSaved }: {
  patientId: string;
  user: { uid: string; displayName: string };
  patientInfo: { species: string; breed: string; age: number; weight?: number } | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [quickNotes, setQuickNotes] = useState('');
  const [step, setStep] = useState(0); // 0=info, 1=vitals, 2=SOAP
  const steps = ['Información', 'Signos Vitales', 'SOAP'];
  const aiReady = isAIAvailable() && patientInfo !== null;

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    reason: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    notes: '',
  });

  async function handleAIGenerate() {
    if (!patientInfo || !quickNotes.trim()) return;
    setGenerating(true);
    try {
      const result = await generateSOAP({ ...patientInfo, quickNotes: quickNotes.trim() });
      if (result) {
        setForm((p) => ({
          ...p,
          subjective: result.subjective,
          objective: result.objective,
          assessment: result.assessment,
          plan: result.plan,
        }));
        if (!form.reason) {
          setForm((p) => ({ ...p, reason: quickNotes.trim().split('.')[0].slice(0, 80) }));
        }
      }
    } catch (err) { console.error('AI error:', err); }
    finally { setGenerating(false); }
  }

  const [vitals, setVitals] = useState<VitalSigns>({
    weight: undefined, temperature: undefined, heartRate: undefined,
    respiratoryRate: undefined, mucousMembranes: '', capillaryRefillTime: undefined,
    bodyCondition: undefined, hydration: '',
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const setV = (k: keyof VitalSigns, v: string | number) => setVitals((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.reason || !form.subjective) return;
    setSaving(true);
    try {
      await addConsultation({
        patientId,
        vetId: user.uid,
        vetName: user.displayName,
        date: form.date,
        reason: form.reason,
        subjective: form.subjective,
        objective: form.objective,
        assessment: form.assessment,
        plan: form.plan,
        diagnosis: form.assessment,  // legacy compat
        treatment: form.plan,        // legacy compat
        notes: form.notes,
        vitals: Object.values(vitals).some((v) => v !== undefined && v !== '') ? vitals : undefined,
      });
      onSaved();
    } catch (err) { console.error(err); setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto clay-shadow" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/15">
          <div>
            <h2 className="font-headline font-bold text-xl text-on-surface">Nueva Consulta SOAP</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Historia clínica — Ley 576/2000</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-xl transition-colors"><X className="w-5 h-5 text-on-surface-variant" /></button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4 flex gap-2">
          {steps.map((s, i) => (
            <button key={s} onClick={() => setStep(i)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${step === i ? 'bg-primary text-on-primary clay-shadow-coral' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}>
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Fecha" type="date" value={form.date} onChange={(v) => set('date', v)} />
                <FormField label="Motivo de consulta *" value={form.reason} onChange={(v) => set('reason', v)} placeholder="Ej: Chequeo anual, vómitos" required />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setStep(1)} className="bg-primary text-on-primary px-6 py-2.5 rounded-2xl font-bold text-sm clay-shadow-coral active:scale-95 transition-transform">
                  Siguiente →
                </button>
              </div>
            </>
          )}

          {/* Step 1: Vital Signs */}
          {step === 1 && (
            <>
              <p className="text-sm text-on-surface-variant">Registra los signos vitales del examen físico. Todos los campos son opcionales.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField label="Peso (kg)" type="number" value={vitals.weight?.toString() || ''} onChange={(v) => setV('weight', Number(v))} placeholder="32.5" />
                <FormField label="Temperatura (°C)" type="number" value={vitals.temperature?.toString() || ''} onChange={(v) => setV('temperature', Number(v))} placeholder="38.5" />
                <FormField label="Frec. Cardíaca (lpm)" type="number" value={vitals.heartRate?.toString() || ''} onChange={(v) => setV('heartRate', Number(v))} placeholder="80" />
                <FormField label="Frec. Respiratoria (rpm)" type="number" value={vitals.respiratoryRate?.toString() || ''} onChange={(v) => setV('respiratoryRate', Number(v))} placeholder="20" />
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Mucosas</label>
                  <select value={vitals.mucousMembranes} onChange={(e) => setV('mucousMembranes', e.target.value)}
                    className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none cursor-pointer">
                    <option value="">Seleccionar...</option>
                    <option>Rosadas</option>
                    <option>Pálidas</option>
                    <option>Cianóticas</option>
                    <option>Ictéricas</option>
                    <option>Congestivas</option>
                  </select>
                </div>
                <FormField label="TRC (seg)" type="number" value={vitals.capillaryRefillTime?.toString() || ''} onChange={(v) => setV('capillaryRefillTime', Number(v))} placeholder="2" />
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Condición corporal (1-9)</label>
                  <select value={vitals.bodyCondition || ''} onChange={(e) => setV('bodyCondition', Number(e.target.value))}
                    className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none cursor-pointer">
                    <option value="">Seleccionar...</option>
                    {[1,2,3,4,5,6,7,8,9].map((n) => (
                      <option key={n} value={n}>{n} — {n <= 3 ? 'Bajo peso' : n <= 5 ? 'Ideal' : n <= 7 ? 'Sobrepeso' : 'Obeso'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Hidratación</label>
                  <select value={vitals.hydration} onChange={(e) => setV('hydration', e.target.value)}
                    className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none cursor-pointer">
                    <option value="">Seleccionar...</option>
                    <option>Normal</option>
                    <option>Deshidratación leve</option>
                    <option>Deshidratación moderada</option>
                    <option>Deshidratación severa</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(0)} className="text-on-surface-variant font-bold text-sm hover:text-on-surface transition-colors">← Anterior</button>
                <button type="button" onClick={() => setStep(2)} className="bg-primary text-on-primary px-6 py-2.5 rounded-2xl font-bold text-sm clay-shadow-coral active:scale-95 transition-transform">Siguiente →</button>
              </div>
            </>
          )}

          {/* Step 2: SOAP */}
          {step === 2 && (
            <>
              {/* AI Assistant */}
              {aiReady && (
                <div className="bg-tertiary-container/20 rounded-2xl p-4 border border-tertiary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-tertiary" />
                    <span className="font-bold text-sm text-on-surface">Asistente IA</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary">GEMINI</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-3">Escribe notas rápidas y la IA generará el SOAP completo. Puedes editar después.</p>
                  <textarea
                    value={quickNotes}
                    onChange={(e) => setQuickNotes(e.target.value)}
                    rows={2}
                    placeholder="Ej: Perro llega con vómitos desde hace 2 días, no come, decaído. A la palpación abdomen tenso..."
                    className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-tertiary border-none resize-none mb-3"
                  />
                  <button
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={generating || !quickNotes.trim()}
                    className="flex items-center gap-2 bg-tertiary text-on-tertiary px-5 py-2 rounded-xl font-bold text-sm clay-shadow-lavender active:scale-95 transition-transform disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    {generating ? 'Generando SOAP...' : 'Generar con IA'}
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <SOAPField letter="S" title="Subjetivo" subtitle="¿Qué reporta el propietario?" color="bg-primary/10 text-primary"
                  value={form.subjective} onChange={(v) => set('subjective', v)}
                  placeholder="Síntomas observados, duración, cambios de comportamiento, alimentación, actividad..." required />

                <SOAPField letter="O" title="Objetivo" subtitle="Hallazgos del examen físico" color="bg-secondary/10 text-secondary"
                  value={form.objective} onChange={(v) => set('objective', v)}
                  placeholder="Hallazgos a la palpación, auscultación, inspección visual, resultados de laboratorio..." />

                <SOAPField letter="A" title="Análisis" subtitle="Diagnóstico / Diagnósticos diferenciales" color="bg-tertiary/10 text-tertiary"
                  value={form.assessment} onChange={(v) => set('assessment', v)}
                  placeholder="Diagnóstico presuntivo, diagnósticos diferenciales a considerar..." />

                <SOAPField letter="P" title="Plan" subtitle="Tratamiento, medicación, seguimiento" color="bg-primary/10 text-primary"
                  value={form.plan} onChange={(v) => set('plan', v)}
                  placeholder="Medicamentos prescritos, dosis, frecuencia, duración, recomendaciones, fecha de control..." />

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Notas adicionales</label>
                  <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} placeholder="Observaciones internas, alertas, pendientes..."
                    className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none resize-none" />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="text-on-surface-variant font-bold text-sm hover:text-on-surface transition-colors">← Anterior</button>
                <button type="submit" disabled={saving || !form.reason || !form.subjective}
                  className="bg-primary text-on-primary px-8 py-3 rounded-2xl font-bold text-sm clay-shadow-coral active:scale-95 transition-transform disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Guardar Historia Clínica'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function SOAPField({ letter, title, subtitle, color, value, onChange, placeholder, required }: {
  letter: string; title: string; subtitle: string; color: string;
  value: string; onChange: (v: string) => void; placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center font-extrabold text-sm`}>{letter}</span>
        <div>
          <span className="text-sm font-bold text-on-surface">{title}</span>
          <span className="text-xs text-on-surface-variant ml-2">{subtitle}</span>
        </div>
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} required={required}
        className="w-full bg-surface-container-high rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary border-none resize-none leading-relaxed" />
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, required, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} step={type === 'number' ? '0.1' : undefined}
        className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
    </div>
  );
}
