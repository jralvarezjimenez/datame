import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Stethoscope, Building2, Heart, PawPrint, Check } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const roles = [
  {
    id: 'veterinarian',
    icon: Stethoscope,
    title: 'Veterinario',
    subtitle: 'Freelance o empleado',
    description: 'Registra pacientes, crea historias clínicas SOAP, gestiona citas y recetas.',
    color: 'bg-primary clay-shadow-coral',
    border: 'border-primary',
  },
  {
    id: 'clinic',
    icon: Building2,
    title: 'Clínica Veterinaria',
    subtitle: 'Una o más sedes',
    description: 'Todo lo del veterinario + inventario, múltiples sedes, equipo de staff.',
    color: 'bg-tertiary clay-shadow-lavender',
    border: 'border-tertiary',
  },
  {
    id: 'owner',
    icon: Heart,
    title: 'Dueño de Mascota',
    subtitle: 'Portal del propietario',
    description: 'Ve la historia clínica de tu mascota, próximas citas y vacunas.',
    color: 'bg-secondary clay-shadow-mint',
    border: 'border-secondary',
  },
];

export function RoleSelect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    if (!selected || !user) return;
    setSaving(true);
    try {
      const role = selected === 'clinic' ? 'veterinarian' : selected;
      await updateDoc(doc(db, 'users', user.uid), {
        role,
        accountType: selected,  // 'veterinarian', 'clinic', or 'owner'
        onboardingComplete: false,
        roleSelected: true,
      });
      // Force reload to pick up new role
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Error saving role:', err);
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed top-20 -left-40 w-96 h-96 bg-primary/15 rounded-full blur-[100px] animate-float-slow" />
      <div className="fixed bottom-20 -right-32 w-80 h-80 bg-secondary/15 rounded-full blur-[80px] animate-float" />
      <div className="fixed top-1/2 left-1/3 w-72 h-72 bg-tertiary/10 rounded-full blur-[90px] animate-float-fast" />

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center clay-shadow-coral mx-auto mb-4">
            <PawPrint className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-2">¿Cómo usarás DATA ME?</h1>
          <p className="text-on-surface-variant">Selecciona tu perfil para personalizar tu experiencia</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4 mb-8">
          {roles.map((role, i) => (
            <motion.button
              key={role.id}
              onClick={() => setSelected(role.id)}
              className={`w-full text-left p-6 rounded-3xl border-2 transition-all ${
                selected === role.id
                  ? `${role.border} bg-surface-container-lowest clay-shadow scale-[1.02]`
                  : 'border-outline-variant/20 bg-surface-container-lowest hover:border-outline-variant/40'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl ${role.color} flex items-center justify-center shrink-0`}>
                  <role.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-lg text-on-surface">{role.title}</h3>
                    <span className="text-xs text-on-surface-variant font-medium">— {role.subtitle}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant mt-1">{role.description}</p>
                </div>
                {selected === role.id && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Continue Button */}
        <motion.button
          onClick={handleContinue}
          disabled={!selected || saving}
          className="w-full bg-primary text-on-primary font-bold py-4 rounded-3xl clay-shadow-coral active:scale-[0.98] transition-transform disabled:opacity-40 text-lg font-headline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {saving ? 'Guardando...' : 'Continuar'}
        </motion.button>

        <p className="text-center text-xs text-on-surface-variant mt-4">
          Puedes cambiar esto después en Ajustes
        </p>
      </motion.div>
    </div>
  );
}
