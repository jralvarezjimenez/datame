import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Syringe, Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const vaccines = [
  { name: 'Rabia (3 años)', dateGiven: '12 Oct, 2023', nextDue: '12 Oct, 2026', status: 'valid', lot: 'RAB-9921-A', vet: 'Dra. Sarah Van' },
  { name: 'DHPP (Moquillo, Hepatitis, Parainfluenza, Parvovirus)', dateGiven: '12 Oct, 2023', nextDue: '12 Oct, 2024', status: 'due_soon', lot: 'DHP-4412-B', vet: 'Dra. Sarah Van' },
  { name: 'Bordetella (Tos de las perreras)', dateGiven: '15 Mar, 2023', nextDue: '15 Mar, 2024', status: 'overdue', lot: 'BOR-1109-C', vet: 'Dr. Mike Low' },
  { name: 'Leptospirosis', dateGiven: '12 Oct, 2022', nextDue: '12 Oct, 2023', status: 'overdue', lot: 'LEP-8823-D', vet: 'Dra. Rosa' },
];

export function Vaccination() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <Link to={`/patients/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al Perfil
          </Link>
          <h1 className="text-2xl font-extrabold font-headline text-teal-900 flex items-center gap-3">
            <Syringe className="w-6 h-6 text-secondary" />
            Registro de Vacunación
          </h1>
          <p className="text-sm font-medium text-slate-500">Cooper • Golden Retriever</p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-container transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Registrar Nueva Vacuna
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-emerald-900">1</p>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Al Día</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-amber-900">1</p>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Próxima (&lt; 30d)</p>
          </div>
        </div>
        <div className="bg-error-container/30 border border-error-container p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-error">2</p>
            <p className="text-xs font-bold text-error uppercase tracking-wider">Vencida</p>
          </div>
        </div>
      </div>

      {/* Vaccine List */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/10">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline">Vacuna / Antígeno</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline">Fecha de Administración</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline">Próxima Dosis</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {vaccines.map((vax, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-800">{vax.name}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {vax.dateGiven}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {vax.nextDue}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {vax.status === 'valid' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> VÁLIDA
                      </span>
                    )}
                    {vax.status === 'due_soon' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black rounded-full">
                        <Clock className="w-3 h-3" /> PRÓXIMA
                      </span>
                    )}
                    {vax.status === 'overdue' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-error-container/50 text-error text-[10px] font-black rounded-full">
                        <AlertCircle className="w-3 h-3" /> VENCIDA
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs text-slate-500">
                      <p><span className="font-semibold">Lote:</span> {vax.lot}</p>
                      <p><span className="font-semibold">Por:</span> {vax.vet}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
