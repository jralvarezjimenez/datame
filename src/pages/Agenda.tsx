import { Calendar as CalendarIcon, Clock, Plus, Search, Filter } from 'lucide-react';

export function Agenda() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-headline text-teal-900">Agenda</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Gestionar citas y horario de la clínica.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-lowest text-primary border border-primary/20 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-primary/5 transition-all active:scale-95">
            <Filter className="w-5 h-5" />
            Filtrar
          </button>
          <button className="bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-container transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            Nueva Cita
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 p-8 text-center">
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
          <CalendarIcon className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Vista de Calendario Próximamente</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          La vista de calendario interactiva completa está actualmente en desarrollo. Aún puede gestionar las citas de hoy desde el Panel de Control.
        </p>
      </div>
    </div>
  );
}
