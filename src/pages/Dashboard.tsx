import { Search, Plus, Calendar, UserPlus, DollarSign, Syringe, ChevronRight, FileText, FlaskConical, Pill } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">Buenos días, Julian</h2>
          <p className="text-on-surface-variant font-medium mt-1">Tienes 12 citas programadas para hoy.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-lowest text-primary border border-primary/20 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-primary/5 transition-all active:scale-95">
            <Search className="w-5 h-5" />
            Buscar Paciente
          </button>
          <button className="bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-container transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            Nueva Cita
          </button>
        </div>
      </section>

      {/* Bento Summary Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card: Appointments */}
        <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between h-40 shadow-sm transition-all hover:shadow-md border border-transparent hover:border-outline-variant/20">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">HOY</span>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-on-surface">12</p>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Citas de Hoy</p>
          </div>
        </div>

        {/* Card: New Patients */}
        <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between h-40 shadow-sm transition-all hover:shadow-md border border-transparent hover:border-outline-variant/20">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <UserPlus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-secondary px-2 py-1 bg-secondary/10 rounded-full">+18%</span>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-on-surface">24</p>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Nuevos Pacientes (Semana)</p>
          </div>
        </div>

        {/* Card: Monthly Income */}
        <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between h-40 shadow-sm transition-all hover:shadow-md border border-transparent hover:border-outline-variant/20">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-tertiary px-2 py-1 bg-tertiary/10 rounded-full">ACTIVO</span>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-on-surface">$14,280</p>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Ingresos Mensuales</p>
          </div>
        </div>

        {/* Card: Vaccines */}
        <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between h-40 shadow-sm transition-all hover:shadow-md border border-transparent hover:border-outline-variant/20">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-error-container/40 rounded-lg text-on-error-container">
              <Syringe className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-on-error-container px-2 py-1 bg-error-container/40 rounded-full">URGENTE</span>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-on-surface">08</p>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Próximas Vacunas</p>
          </div>
        </div>
      </section>

      {/* Main Layout: Appointments & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-teal-900 font-headline">Próximas Citas</h3>
            <a href="#" className="text-sm font-bold text-primary hover:underline">Ver Toda la Agenda</a>
          </div>
          
          <div className="space-y-4">
            {/* Appointment Row 1 */}
            <div className="group bg-surface-container-lowest p-5 rounded-2xl flex items-center gap-5 shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/10 cursor-pointer">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1537151608804-ea6d11540eb1?auto=format&fit=crop&q=80&w=150&h=150" alt="Cooper" className="w-16 h-16 rounded-xl object-cover" />
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                  <span className="w-4 h-4 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px]">🐾</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-on-surface truncate">Cooper</h4>
                  <span className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">09:30 AM</span>
                </div>
                <p className="text-sm font-medium text-on-surface-variant">Beagle • Chequeo de Rutina</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Revisión de Signos Vitales y Peso</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>

            {/* Appointment Row 2 */}
            <div className="group bg-surface-container-lowest p-5 rounded-2xl flex items-center gap-5 shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/10 cursor-pointer">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=150&h=150" alt="Misty" className="w-16 h-16 rounded-xl object-cover" />
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                  <span className="w-4 h-4 rounded-full bg-orange-600 flex items-center justify-center text-white text-[10px]">🐱</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-on-surface truncate">Misty</h4>
                  <span className="text-sm font-bold text-on-surface-variant bg-slate-100 px-3 py-1 rounded-full">10:15 AM</span>
                </div>
                <p className="text-sm font-medium text-on-surface-variant">Gato Doméstico • Vacunación</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Refuerzo Anual de Rabia</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>

            {/* Appointment Row 3 */}
            <div className="group bg-surface-container-lowest p-5 rounded-2xl flex items-center gap-5 shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/10 cursor-pointer">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150" alt="Luna" className="w-16 h-16 rounded-xl object-cover" />
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                  <span className="w-4 h-4 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px]">🐾</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-on-surface truncate">Luna</h4>
                  <span className="text-sm font-bold text-on-surface-variant bg-slate-100 px-3 py-1 rounded-full">11:00 AM</span>
                </div>
                <p className="text-sm font-medium text-on-surface-variant">Golden Retriever • Revisión Post-Cirugía</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Retiro de Puntos</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </section>

        {/* Sidebar Actions / Mini Stats */}
        <aside className="space-y-8">
          {/* Quick Actions Section */}
          <section className="bg-primary-container/20 p-6 rounded-2xl border border-primary/10">
            <h3 className="text-lg font-bold text-teal-900 mb-4 font-headline">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full bg-white text-primary px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm hover:shadow-md transition-all">
                <FileText className="w-5 h-5" />
                Nuevo Historial Clínico
              </button>
              <button className="w-full bg-white text-on-surface px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm hover:shadow-md transition-all">
                <FlaskConical className="w-5 h-5 text-secondary" />
                Solicitar Prueba de Laboratorio
              </button>
              <button className="w-full bg-white text-on-surface px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm hover:shadow-md transition-all">
                <Pill className="w-5 h-5 text-tertiary" />
                Emitir Receta
              </button>
            </div>
          </section>

          {/* Care Team Status */}
          <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-on-surface font-headline">Estado del Equipo Médico</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">SV</div>
                  <span className="text-sm font-medium">Sarah Van (Téc)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">EN LÍNEA</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs">ML</div>
                  <span className="text-sm font-medium">Mike Low (Admin)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">EN LÍNEA</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">RR</div>
                  <span className="text-sm font-medium">Dra. Rosa (Cir)</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">DESCONECTADO</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
