import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PawPrint, Heart, Shield, Calendar, Syringe, Stethoscope, ArrowRight, Sparkles } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

const features = [
  { icon: Stethoscope, title: 'Consultas', desc: 'Historial clínico completo de cada paciente con diagnósticos y tratamientos.', color: 'coral' },
  { icon: Syringe, title: 'Vacunaciones', desc: 'Control de inmunizaciones con alertas automáticas de vencimiento.', color: 'mint' },
  { icon: Calendar, title: 'Agenda', desc: 'Programa y gestiona citas con navegación por día y estado.', color: 'lavender' },
  { icon: Shield, title: 'Seguridad', desc: 'Roles y permisos: veterinario, staff y propietario con acceso controlado.', color: 'coral' },
  { icon: Heart, title: 'Portal', desc: 'Los dueños ven la info de sus mascotas desde cualquier dispositivo.', color: 'mint' },
  { icon: Sparkles, title: 'Inteligente', desc: 'Alertas automáticas basadas en datos reales de tus pacientes.', color: 'lavender' },
];

const stats = [
  { value: '100%', label: 'Gratis', sub: 'Firebase Spark' },
  { value: '6', label: 'Módulos', sub: 'Funcionales' },
  { value: '∞', label: 'Pacientes', sub: 'Sin límite' },
  { value: '24/7', label: 'Acceso', sub: 'En la nube' },
];

const colorMap: Record<string, { bg: string; shadow: string; iconBg: string }> = {
  coral: { bg: 'bg-[#FFE0E0]', shadow: 'clay-shadow-coral', iconBg: 'bg-[#FF6B6B]' },
  mint: { bg: 'bg-[#D4F5DA]', shadow: 'clay-shadow-mint', iconBg: 'bg-[#51CF66]' },
  lavender: { bg: 'bg-[#E5DEFF]', shadow: 'clay-shadow-lavender', iconBg: 'bg-[#845EF7]' },
};

export function Landing() {
  return (
    <div className="min-h-screen bg-surface overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center clay-shadow-coral">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="font-headline text-xl font-extrabold text-on-surface">DATA ME</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors px-4 py-2">
              Iniciar Sesión
            </Link>
            <Link to="/login" className="bg-primary text-on-primary px-5 py-2.5 rounded-2xl font-bold text-sm clay-shadow-coral hover:scale-105 active:scale-95 transition-transform">
              Empezar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background blobs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute top-40 -right-32 w-80 h-80 bg-secondary/20 rounded-full blur-[80px] animate-float" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-tertiary/15 rounded-full blur-[90px] animate-float-fast" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Plataforma Veterinaria
              </span>
            </motion.div>

            <motion.h1
              className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.05] mb-6"
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
            >
              Datiame de la{' '}
              <span className="text-primary relative">
                salud
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C50 2 150 2 198 8" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>{' '}
              de tu mascota
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-10"
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
            >
              Gestiona pacientes, consultas, vacunas y citas en una sola plataforma.
              Diseñada para clínicas veterinarias que quieren crecer sin complicarse.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
            >
              <Link to="/login" className="bg-primary text-on-primary px-8 py-4 rounded-3xl font-headline font-bold text-lg clay-shadow-coral hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2">
                Comenzar Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#features" className="bg-surface-container-lowest text-on-surface px-8 py-4 rounded-3xl font-headline font-bold text-lg clay-shadow hover:scale-105 active:scale-95 transition-transform text-center">
                Ver Funciones
              </a>
            </motion.div>
          </div>

          {/* Floating Clay Cards */}
          <motion.div
            className="mt-16 flex justify-center gap-6 flex-wrap"
            initial="hidden" animate="visible"
          >
            {[
              { icon: '🐕', label: 'Cooper', sub: 'Golden Retriever', delay: 4 },
              { icon: '🐈', label: 'Luna', sub: 'Siamés', delay: 5 },
              { icon: '🐾', label: '+248', sub: 'Pacientes', delay: 6 },
            ].map((card) => (
              <motion.div
                key={card.label}
                className="bg-surface-container-lowest px-6 py-4 rounded-3xl clay-shadow flex items-center gap-4 animate-float-slow"
                variants={fadeUp}
                custom={card.delay}
              >
                <span className="text-3xl">{card.icon}</span>
                <div>
                  <p className="font-headline font-bold text-on-surface">{card.label}</p>
                  <p className="text-xs text-on-surface-variant font-medium">{card.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center bg-surface-container-lowest p-6 rounded-3xl clay-shadow"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-4xl font-extrabold font-headline text-primary">{stat.value}</p>
              <p className="font-bold text-on-surface mt-1">{stat.label}</p>
              <p className="text-xs text-on-surface-variant">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 relative">
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-[80px]" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-tertiary/10 rounded-full blur-[80px]" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Funcionalidades
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface">
              Todo lo que tu clínica necesita
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const c = colorMap[feat.color];
              return (
                <motion.div
                  key={feat.title}
                  className={`${c.bg} p-8 rounded-3xl ${c.shadow} hover:scale-[1.03] transition-transform cursor-default`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className={`${c.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                    <feat.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{feat.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-br from-primary via-[#FF8E8E] to-tertiary p-12 md:p-16 rounded-[2.5rem] text-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-[40px] -ml-16 -mb-16" />

          <div className="relative z-10">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white mb-4">
              Empieza hoy, es gratis
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
              Registra tu clínica en segundos con tu cuenta de Google. Sin tarjeta, sin compromisos.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-3xl font-headline font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-transform"
            >
              Crear Cuenta Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-outline-variant/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="font-headline font-extrabold text-on-surface">DATA ME</span>
          </div>
          <p className="text-sm text-on-surface-variant">
            Hecho con ❤️ para clínicas veterinarias
          </p>
        </div>
      </footer>
    </div>
  );
}
