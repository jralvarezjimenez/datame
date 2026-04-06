import { Users, Link as LinkIcon, Share2, ShieldCheck } from 'lucide-react';

export function Portal() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center max-w-2xl mx-auto mt-12">
        <div className="w-24 h-24 mx-auto bg-primary-container rounded-3xl flex items-center justify-center text-on-primary-container mb-6 shadow-lg shadow-primary/20 rotate-3">
          <Users className="w-12 h-12 -rotate-3" />
        </div>
        <h1 className="text-4xl font-extrabold font-headline text-teal-900 mb-4">Acceso al Portal del Propietario</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          Capacite a los dueños de mascotas con acceso seguro las 24 horas del día, los 7 días de la semana a los registros médicos de sus mascotas, próximas citas y comunicación directa con su clínica.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 hover:border-primary/30 transition-colors">
            <Share2 className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-slate-800 mb-2">Compartir Fácilmente</h3>
            <p className="text-sm text-slate-500">Genere enlaces seguros para compartir registros específicos o el historial completo con propietarios o especialistas.</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 hover:border-secondary/30 transition-colors">
            <ShieldCheck className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-bold text-slate-800 mb-2">Acceso Seguro</h3>
            <p className="text-sm text-slate-500">El cifrado de extremo a extremo garantiza que los datos del paciente permanezcan privados y cumplan con las normativas.</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 hover:border-tertiary/30 transition-colors">
            <LinkIcon className="w-8 h-8 text-tertiary mb-4" />
            <h3 className="font-bold text-slate-800 mb-2">Integración</h3>
            <p className="text-sm text-slate-500">Conéctese sin problemas con su sitio web existente y sistemas de reservas.</p>
          </div>
        </div>

        <div className="mt-12">
          <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-container hover:scale-105 transition-all active:scale-95">
            Configurar Ajustes del Portal
          </button>
        </div>
      </div>
    </div>
  );
}
