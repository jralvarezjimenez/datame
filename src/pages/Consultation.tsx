import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Stethoscope, Plus, FileText, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';

export function Consultation() {
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
            <Stethoscope className="w-6 h-6 text-primary" />
            Historial de Consultas
          </h1>
          <p className="text-sm font-medium text-slate-500">Cooper • Golden Retriever</p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-container transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Nueva Consulta
        </button>
      </div>

      <div className="space-y-6">
        {/* Consultation Record 1 */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden">
          <div className="bg-surface-container-low px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">Chequeo de Rutina</h3>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 12 Oct, 2023 - 09:30 AM</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> Dra. Sarah Van</span>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full self-start sm:self-auto">
              <CheckCircle2 className="w-3 h-3" /> COMPLETADA
            </span>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Motivo de la Visita</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/10">
                  Examen físico anual y refuerzos de vacunación. El propietario no reporta problemas, come y bebe normalmente.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hallazgos Objetivos (Signos Vitales)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-surface-container-low/50 p-2 rounded-lg border border-outline-variant/10 flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500">Peso</span>
                    <span className="text-sm font-bold text-slate-800">32.5 kg</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-2 rounded-lg border border-outline-variant/10 flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500">Temp</span>
                    <span className="text-sm font-bold text-slate-800">38.5 °C</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-2 rounded-lg border border-outline-variant/10 flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500">FC</span>
                    <span className="text-sm font-bold text-slate-800">85 lpm</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-2 rounded-lg border border-outline-variant/10 flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500">FR</span>
                    <span className="text-sm font-bold text-slate-800">24 rpm</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Evaluación y Plan</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/10">
                  Perro adulto sano. CC 5/9. Leve acumulación de sarro en las muelas carniceras superiores (grado 1/4).
                  <br/><br/>
                  Plan: Se administraron refuerzos de DHPP y Rabia. Se habló sobre higiene dental con el propietario. Se recomienda limpieza dental en 6-12 meses si el sarro empeora.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-surface-container-low hover:bg-surface-container-high text-primary border border-primary/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                  <FileText className="w-4 h-4" />
                  Ver PDF Completo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Record 2 */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
          <div className="bg-surface-container-low px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">Consulta de Dermatología</h3>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 15 Jun, 2023 - 14:00 PM</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> Dr. Mike Low</span>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-black rounded-full self-start sm:self-auto">
              <CheckCircle2 className="w-3 h-3" /> COMPLETADA
            </span>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-600 italic">El propietario reportó rascado excesivo y enrojecimiento en el vientre. Diagnosticado con dermatitis de contacto leve. Se recetó spray calmante tópico y se recomendó cambiar el detergente para la ropa de cama de la mascota.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
