import { useState } from 'react';
import { PawPrint, Users, Calendar, Stethoscope, Package, Sparkles, ArrowRight, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const steps = [
  {
    icon: PawPrint,
    color: 'bg-primary clay-shadow-coral',
    title: '¡Bienvenido a DATA ME!',
    description: 'Tu plataforma de gestión clínica veterinaria. Te guiamos en 1 minuto para que aproveches todo.',
    tip: null,
  },
  {
    icon: Users,
    color: 'bg-secondary clay-shadow-mint',
    title: 'Registra Pacientes',
    description: 'Ve a Pacientes y crea tu primer registro. Solo necesitas nombre, especie y raza.',
    tip: 'Tip: El propietario se asocia automáticamente con tu cuenta.',
  },
  {
    icon: Stethoscope,
    color: 'bg-primary clay-shadow-coral',
    title: 'Consultas con Formato SOAP',
    description: 'Desde el perfil del paciente, registra consultas con el estándar SOAP: Subjetivo, Objetivo, Análisis y Plan.',
    tip: 'Tip: Usa el Asistente IA para generar el SOAP automáticamente desde notas rápidas.',
  },
  {
    icon: Calendar,
    color: 'bg-tertiary clay-shadow-lavender',
    title: 'Agenda de Citas',
    description: 'Programa citas seleccionando paciente, fecha y hora. Envía recordatorios por WhatsApp con un click.',
    tip: 'Tip: Navega entre días con las flechas o los botones rápidos.',
  },
  {
    icon: Package,
    color: 'bg-secondary clay-shadow-mint',
    title: 'Control de Inventario',
    description: 'Registra medicamentos, vacunas e insumos. El sistema te alerta cuando el stock baja del mínimo.',
    tip: null,
  },
  {
    icon: Sparkles,
    color: 'bg-tertiary clay-shadow-lavender',
    title: '¡Listo para empezar!',
    description: 'Exporta historias clínicas en PDF, recibe alertas inteligentes, y deja que la IA te ayude. Todo gratis.',
    tip: null,
  },
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);
  const isLast = current === steps.length - 1;
  const step = steps[current];

  async function finish() {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { onboardingComplete: true });
      } catch (err) { console.error(err); }
    }
    onComplete();
  }

  function handleNext() {
    if (isLast) finish();
    else setCurrent((p) => p + 1);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <motion.div
        className="bg-surface-container-lowest rounded-[2rem] clay-shadow w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Skip button */}
        <div className="flex justify-end p-4 pb-0">
          <button onClick={finish} className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> Omitir
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-6`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>

              {/* Text */}
              <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-3">{step.title}</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">{step.description}</p>

              {step.tip && (
                <div className="bg-tertiary-container/20 rounded-xl px-4 py-3 text-left mb-4">
                  <p className="text-xs font-bold text-tertiary">{step.tip}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-primary' : i < current ? 'w-2 bg-primary/40' : 'w-2 bg-outline-variant/30'
                }`}
              />
            ))}
          </div>

          {/* Action button */}
          <button
            onClick={handleNext}
            className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-2xl clay-shadow-coral active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            {isLast ? (
              <><Check className="w-5 h-5" /> Comenzar</>
            ) : (
              <><span>Siguiente</span> <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
