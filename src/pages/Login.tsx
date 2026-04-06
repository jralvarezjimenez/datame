import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Mail, Lock } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

export function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user document with default role 'owner'
        await setDoc(userRef, {
          email: user.email,
          role: 'owner',
        });
      }

      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google', error);
      // Here you would typically show an error message in the UI
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 md:p-12 overflow-hidden bg-surface">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=2000" 
          alt="Clinic interior" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/30"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[2rem] shadow-2xl shadow-on-surface/10">
        {/* Branding Section */}
        <div className="hidden lg:flex lg:col-span-7 bg-primary-container p-16 flex-col justify-between text-on-primary-container relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <PawPrint className="w-10 h-10" />
              <h1 className="font-headline text-3xl font-extrabold tracking-tighter">DATA ME</h1>
            </div>
            <h2 className="font-headline text-6xl font-bold leading-tight mb-6">
              datiame de la salud<br/>de tu mascota
            </h2>
            <p className="font-body text-xl opacity-90 max-w-md leading-relaxed">
              Transformamos la gestión clínica en un refugio de eficiencia y calidez para ti y tus pacientes.
            </p>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full border-2 border-primary-container object-cover" alt="Vet" referrerPolicy="no-referrer" />
                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full border-2 border-primary-container object-cover" alt="Vet" referrerPolicy="no-referrer" />
                <img src="https://images.unsplash.com/photo-1594824436998-058a231161a9?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full border-2 border-primary-container object-cover" alt="Vet" referrerPolicy="no-referrer" />
              </div>
              <p className="text-sm font-medium">Únete a más de 500 clínicas de vanguardia</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px] opacity-30 -mr-32 -mb-32"></div>
        </div>

        {/* Login Form */}
        <div className="lg:col-span-5 bg-white/85 backdrop-blur-2xl p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <PawPrint className="w-8 h-8" />
              <h1 className="font-headline text-2xl font-extrabold tracking-tighter">DATA ME</h1>
            </div>
            <p className="text-on-surface-variant font-medium">datiame de la salud de tu mascota</p>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Bienvenido de nuevo</h3>
            <p className="text-on-surface-variant font-body">Ingresa tus credenciales para acceder al portal.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-on-surface-variant px-1">CORREO ELECTRÓNICO</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="nombre@clinica.com" 
                  className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all duration-200 outline-none text-on-surface font-body"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-on-surface-variant">CONTRASEÑA</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all duration-200 outline-none text-on-surface font-body"
                />
              </div>
            </div>

            <Link to="/" className="w-full block text-center bg-primary text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all duration-200">
              Iniciar Sesión
            </Link>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white/85 px-4 text-on-surface-variant font-medium">O CONTINÚA CON</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-outline-variant/50 text-on-surface-variant font-medium py-3.5 rounded-xl hover:bg-surface-container-low transition-colors duration-200"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
            <span>Iniciar sesión con Google</span>
          </button>

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            ¿No tienes una cuenta? <a href="#" className="text-primary font-bold hover:underline">Contactar a soporte</a>
          </p>

          <div className="mt-12 flex items-center justify-center lg:justify-start">
            <div className="flex items-center gap-2 bg-secondary-container/20 text-secondary px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Estado del Sistema: Operativo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
