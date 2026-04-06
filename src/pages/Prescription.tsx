import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Plus, Pill, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

const prescriptions = [
  { 
    id: 'RX-8842', 
    medication: 'NexGard Spectra (Perro Grande 30-60kg)', 
    dosage: '1 tableta masticable', 
    frequency: 'Una vez al mes', 
    duration: '6 meses',
    prescribedDate: '05 Ago, 2023',
    refillsRemaining: 1,
    status: 'active',
    vet: 'Dra. Sarah Van',
    instructions: 'Dar con o sin comida. Asegúrese de que el perro consuma todo el masticable.'
  },
  { 
    id: 'RX-7120', 
    medication: 'Apoquel 16mg', 
    dosage: '1/2 tableta (8mg)', 
    frequency: 'Dos veces al día por 14 días, luego una vez al día', 
    duration: '30 días',
    prescribedDate: '15 Jun, 2023',
    refillsRemaining: 0,
    status: 'completed',
    vet: 'Dr. Mike Low',
    instructions: 'Para el control del prurito asociado con la dermatitis alérgica.'
  }
];

export function Prescription() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <Link to={`/patients/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al Perfil
          </Link>
          <h1 className="text-2xl font-extrabold font-headline text-teal-900 flex items-center gap-3">
            <FileText className="w-6 h-6 text-tertiary" />
            Recetas
          </h1>
          <p className="text-sm font-medium text-slate-500">Cooper • Golden Retriever</p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-container transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Nueva Receta
        </button>
      </div>

      <div className="space-y-4">
        {prescriptions.map((rx) => (
          <div key={rx.id} className={`bg-surface-container-lowest rounded-2xl shadow-sm border ${rx.status === 'active' ? 'border-tertiary/30' : 'border-outline-variant/15 opacity-75'} overflow-hidden`}>
            <div className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${rx.status === 'active' ? 'bg-tertiary/5 border-tertiary/10' : 'bg-surface-container-low border-outline-variant/10'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rx.status === 'active' ? 'bg-tertiary/20 text-tertiary' : 'bg-slate-200 text-slate-500'}`}>
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{rx.medication}</h3>
                  <p className="text-xs font-medium text-slate-500">ID RX: {rx.id} • Recetado: {rx.prescribedDate}</p>
                </div>
              </div>
              {rx.status === 'active' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full self-start sm:self-auto">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVA
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-black rounded-full self-start sm:self-auto">
                  COMPLETADA
                </span>
              )}
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dosis</h4>
                    <p className="text-sm font-semibold text-slate-800">{rx.dosage}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Frecuencia</h4>
                    <p className="text-sm font-semibold text-slate-800">{rx.frequency}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duración</h4>
                    <p className="text-sm font-semibold text-slate-800">{rx.duration}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Veterinario</h4>
                    <p className="text-sm font-semibold text-slate-800">{rx.vet}</p>
                  </div>
                </div>
                
                <div className="bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/10">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Instrucciones</h4>
                  <p className="text-sm text-slate-700">{rx.instructions}</p>
                </div>
              </div>
              
              <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-outline-variant/10 pt-4 md:pt-0 md:pl-6">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Estado de Resurtido</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-extrabold text-slate-800">{rx.refillsRemaining}</span>
                    <span className="text-xs font-medium text-slate-500">resurtidos restantes</span>
                  </div>
                  {rx.refillsRemaining === 0 && rx.status === 'active' && (
                    <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-2 rounded text-xs font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      El paciente necesita una nueva consulta para más resurtidos.
                    </div>
                  )}
                </div>
                
                {rx.status === 'active' && (
                  <button className="w-full mt-4 bg-surface-container-low hover:bg-surface-container-high text-primary border border-primary/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                    Autorizar Resurtido
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
