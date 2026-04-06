import { Bell, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export function Alerts() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-headline text-teal-900">Alertas y Recordatorios</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Notificaciones del sistema y recordatorios de pacientes.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-error-container/20 border border-error-container/50 p-4 rounded-xl flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-error-container-on">Inventario Bajo: Vacuna contra la Rabia</h3>
            <p className="text-sm text-slate-600 mt-1">Solo quedan 5 dosis en stock. Por favor, vuelva a pedir pronto.</p>
            <span className="text-[10px] font-bold text-slate-400 mt-2 block">hace 2 horas</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-xl flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900">Próxima Cirugía: Luna</h3>
            <p className="text-sm text-slate-600 mt-1">Esterilización programada para mañana a las 08:00 AM. Instrucciones preoperatorias enviadas al propietario.</p>
            <span className="text-[10px] font-bold text-slate-400 mt-2 block">hace 5 horas</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/15 p-4 rounded-xl flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Actualización del Sistema</h3>
            <p className="text-sm text-slate-600 mt-1">DATA ME se someterá a mantenimiento programado el domingo a las 2:00 AM EST.</p>
            <span className="text-[10px] font-bold text-slate-400 mt-2 block">hace 1 día</span>
          </div>
        </div>
      </div>
    </div>
  );
}
