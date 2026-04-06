import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, HeartPulse, Syringe, Stethoscope, FileText, Calendar, Activity, Weight, Droplets, Bone } from 'lucide-react';

export function PatientProfile() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-2">
        <Link to="/patients" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a Pacientes
        </Link>
        <button className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors">
          <Edit3 className="w-4 h-4" />
          Editar Perfil
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-container to-secondary-container relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl border-4 border-surface-container-lowest bg-white overflow-hidden shadow-md">
            <img src="https://images.unsplash.com/photo-1537151608804-ea6d11540eb1?auto=format&fit=crop&q=80&w=200&h=200" alt="Cooper" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-4 right-6 flex gap-3">
            <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-black px-3 py-1 rounded-full shadow-sm">ID: #{id || 'VC-2931'}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              ACTIVO
            </span>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Info */}
          <div className="col-span-1 space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold font-headline text-teal-900 mb-1">Cooper</h1>
              <p className="text-sm font-medium text-slate-500">Golden Retriever • Macho (Castrado)</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Edad</span>
                <span className="text-sm font-semibold text-slate-800">4 años 2 meses</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peso</span>
                <span className="text-sm font-semibold text-slate-800">32.5 kg</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Microchip</span>
                <span className="text-sm font-mono text-slate-800">981020000123456</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Propietario</span>
                <span className="text-sm font-semibold text-primary hover:underline cursor-pointer">Sarah Jenkins</span>
              </div>
            </div>
          </div>

          {/* Vitals & Quick Stats */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between border border-transparent hover:border-outline-variant/20 transition-colors">
              <div className="flex items-center gap-2 text-error mb-2">
                <HeartPulse className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Frec. Cardíaca</span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">85 <span className="text-sm font-medium text-slate-500">lpm</span></p>
                <p className="text-[10px] text-slate-400 mt-1">Última revisión: 12 Oct</p>
              </div>
            </div>
            
            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between border border-transparent hover:border-outline-variant/20 transition-colors">
              <div className="flex items-center gap-2 text-tertiary mb-2">
                <Activity className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Frec. Resp.</span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">24 <span className="text-sm font-medium text-slate-500">rpm</span></p>
                <p className="text-[10px] text-slate-400 mt-1">Última revisión: 12 Oct</p>
              </div>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between border border-transparent hover:border-outline-variant/20 transition-colors">
              <div className="flex items-center gap-2 text-secondary mb-2">
                <Weight className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">CC</span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">5<span className="text-sm font-medium text-slate-500">/9</span></p>
                <p className="text-[10px] text-slate-400 mt-1">Peso ideal</p>
              </div>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between border border-transparent hover:border-outline-variant/20 transition-colors">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Droplets className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Tipo de Sangre</span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">DEA 1.1<span className="text-sm font-medium text-slate-500">+</span></p>
                <p className="text-[10px] text-slate-400 mt-1">Elegible como donante</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Actions Grid */}
      <h2 className="text-xl font-bold font-headline text-teal-900 pt-4">Registros Clínicos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Link to={`/patients/${id}/consultation`} className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/15 hover:border-primary/30 transition-all flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-1">Consultas</h3>
            <p className="text-xs text-slate-500 font-medium">Ver historial y añadir notas</p>
          </div>
        </Link>

        <Link to={`/patients/${id}/vaccinations`} className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/15 hover:border-secondary/30 transition-all flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Syringe className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-1">Vacunaciones</h3>
            <p className="text-xs text-slate-500 font-medium">Registrar y rastrear inmunizaciones</p>
          </div>
        </Link>

        <Link to={`/patients/${id}/prescription`} className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/15 hover:border-tertiary/30 transition-all flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-1">Recetas</h3>
            <p className="text-xs text-slate-500 font-medium">Gestionar medicamentos activos</p>
          </div>
        </Link>

        <div className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/15 hover:border-error/30 transition-all flex flex-col items-center text-center gap-4 cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-error-container/30 text-error flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bone className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-1">Resultados de Lab</h3>
            <p className="text-xs text-slate-500 font-medium">Análisis de sangre y diagnósticos</p>
          </div>
        </div>

      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 p-6 md:p-8">
        <h3 className="text-lg font-bold font-headline text-slate-800 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-400" />
          Actividad Reciente
        </h3>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/30 before:to-transparent">
          
          {/* Timeline Item 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-sm text-slate-800">Chequeo de Rutina</h4>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full">12 Oct, 2023</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Examen físico anual. El paciente goza de buena salud. Peso estable. Se recomienda limpieza dental en 6 meses.</p>
              <div className="mt-3 flex gap-2">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">Dra. Sarah Van</span>
              </div>
            </div>
          </div>

          {/* Timeline Item 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-secondary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Syringe className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-sm text-slate-800">Refuerzo de Vacunación</h4>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full">12 Oct, 2023</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Se administraron refuerzos de Rabia (3 años) y DHPP. No se observaron reacciones adversas durante la espera de 15 minutos.</p>
            </div>
          </div>

          {/* Timeline Item 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-tertiary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <FileText className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-sm text-slate-800">Resurtido de Receta</h4>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full">05 Ago, 2023</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Resurtido de NexGard Spectra (Perro Grande 30-60kg) - suministro para 6 meses.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
