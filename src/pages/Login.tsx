import { Link, useNavigate, Navigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { motion } from 'motion/react';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      const userRef = doc(db, 'users', u.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, { email: u.email, role: 'owner' });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-surface">
      {/* Background blobs */}
      <div className="fixed top-20 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-float-slow" />
      <div className="fixed top-60 -right-32 w-80 h-80 bg-secondary/20 rounded-full blur-[80px] animate-float" />
      <div className="fixed bottom-20 left-1/4 w-72 h-72 bg-tertiary/15 rounded-full blur-[90px] animate-float-fast" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Login Card */}
        <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] clay-shadow">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center clay-shadow-coral mb-4">
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-headline text-3xl font-extrabold text-on-surface">DATA ME</h1>
            <p className="text-on-surface-variant font-medium mt-1">datiame de la salud de tu mascota</p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-surface-container-low text-on-surface font-bold py-4 rounded-2xl clay-shadow hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
            <span>Continuar con Google</span>
          </button>

          <p className="text-center text-xs text-on-surface-variant mt-6">
            Al continuar, aceptas nuestros términos de servicio.
          </p>
        </div>

        {/* Back to landing */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
