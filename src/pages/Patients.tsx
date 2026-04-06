import { Search, Plus, Calendar, FileText, Table, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const patients = [
  {
    id: '#VC-2931',
    name: 'Cooper',
    species: 'PERRO',
    breed: 'Golden Retriever',
    age: '4 Años',
    owner: 'Sarah Jenkins',
    lastVisit: '12 Oct, 2023',
    lastVisitReason: 'Chequeo de Vacunación',
    status: 'ACTIVO',
    image: 'https://images.unsplash.com/photo-1537151608804-ea6d11540eb1?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: '#VC-2932',
    name: 'Luna',
    species: 'GATO',
    breed: 'Siamés',
    age: '2 Años',
    owner: 'David Chen',
    lastVisit: '05 Nov, 2023',
    lastVisitReason: 'Limpieza Dental',
    status: 'ACTIVO',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: '#VC-2935',
    name: 'Spike',
    species: 'EXÓTICO',
    breed: 'Iguana Verde',
    age: '5 Años',
    owner: 'Mark Thompson',
    lastVisit: '20 Sep, 2023',
    lastVisitReason: 'Consulta Nutricional',
    status: 'INACTIVO',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: '#VC-3011',
    name: 'Majesty',
    species: 'EQUINO',
    breed: 'Caballo Cuarto de Milla',
    age: '8 Años',
    owner: 'Oakwood Stables',
    lastVisit: '01 Dic, 2023',
    lastVisitReason: 'Examen de Cojera',
    status: 'ACTIVO',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=150&h=150'
  }
];

export function Patients() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Action Header: Bento Style Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search & Filters Container */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-sm shadow-teal-900/5 border border-outline-variant/15">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar por nombre de mascota o propietario..." 
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary text-sm font-body outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-headline font-semibold text-sm transition-transform active:scale-95">
                <Plus className="w-5 h-5" />
                <span>Nuevo Paciente</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider">Filtros</span>
            <div className="flex flex-wrap gap-2">
              <select className="bg-surface-container-high border-none rounded-full px-4 py-1.5 text-xs font-medium focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                <option>Especie: Todas</option>
                <option>Perro</option>
                <option>Gato</option>
                <option>Exótico</option>
                <option>Equino</option>
              </select>
              <select className="bg-surface-container-high border-none rounded-full px-4 py-1.5 text-xs font-medium focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                <option>Estado: Activo</option>
                <option>Inactivo</option>
              </select>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Rango de Última Visita" 
                  className="bg-surface-container-high border-none rounded-full px-4 py-1.5 text-xs font-medium focus:ring-1 focus:ring-primary outline-none w-40"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
              <button className="text-primary text-xs font-bold hover:underline px-2">Limpiar Todo</button>
            </div>
          </div>
        </div>

        {/* Export & Quick Stats */}
        <div className="bg-primary-container text-on-primary-container rounded-xl p-6 shadow-sm shadow-teal-900/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary opacity-20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="font-headline text-lg font-bold mb-1">Registros Clínicos</h3>
            <p className="text-xs opacity-80 mb-6">Gestiona y exporta tu base de datos clínica de pacientes</p>
          </div>
          <div className="flex gap-3 relative z-10">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <FileText className="w-4 h-4" />
              PDF
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <Table className="w-4 h-4" />
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* Patient List Table Area */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline">Detalle de Mascota</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline">Especie/Raza</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline">Edad</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline">Propietario</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline">Última Visita</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-headline text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {patients.map((patient, idx) => (
                <tr key={idx} className="hover:bg-surface-container transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                        <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-headline font-bold text-teal-900">{patient.name}</p>
                        <p className="text-[11px] font-medium text-slate-500">ID: {patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="px-2 py-0.5 bg-secondary-container/20 text-on-secondary-container rounded text-[10px] font-bold w-fit mb-1">{patient.species}</span>
                      <span className="text-sm font-medium text-slate-700">{patient.breed}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600 font-medium">{patient.age}</td>
                  <td className="px-6 py-5 text-sm text-slate-700 font-semibold">{patient.owner}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-700 font-medium">{patient.lastVisit}</span>
                      <span className="text-[10px] text-slate-400">{patient.lastVisitReason}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {patient.status === 'ACTIVO' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-black rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                        ACTIVO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-slate-500 text-[10px] font-black rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        INACTIVO
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link to={`/patients/${patient.id.replace('#', '')}`} className="bg-primary-container/10 hover:bg-primary-container text-primary hover:text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold transition-all inline-block">
                      Ver Historial
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Mostrando <span className="text-slate-900">1-4</span> de <span className="text-slate-900">248</span> pacientes</p>
          <div className="flex gap-1">
            <button className="p-2 rounded-md hover:bg-slate-200 transition-colors text-slate-400 disabled:opacity-30" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-md bg-primary text-on-primary text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-md hover:bg-slate-200 text-xs font-bold text-slate-600 transition-colors">2</button>
            <button className="w-8 h-8 rounded-md hover:bg-slate-200 text-xs font-bold text-slate-600 transition-colors">3</button>
            <button className="p-2 rounded-md hover:bg-slate-200 transition-colors text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
