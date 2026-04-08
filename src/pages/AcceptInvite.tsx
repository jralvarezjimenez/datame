import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PawPrint, Check, X, LogIn } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { getInvitationByCode, acceptInvitation, type Invitation } from '../services/invitations';

export function AcceptInvite() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (code) loadInvitation();
  }, [code]);

  async function loadInvitation() {
    setLoading(true);
    try {
      const inv = await getInvitationByCode(code!);
      if (!inv) setError('Código de invitación inválido o expirado.');
      else setInvitation(inv);
    } catch (err) { setError('Error al buscar la invitación.'); }
    finally { setLoading(false); }
  }

  async function handleLoginAndAccept() {
    setAccepting(true);
    try {
      let uid = user?.uid;

      // If not logged in, sign in with Google
      if (!uid) {
        const result = await signInWithPopup(auth, googleProvider);
        uid = result.user.uid;

        // Create user doc if new
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            role: 'owner',
            accountType: 'owner',
            roleSelected: true,
          });
        }
      }

      // Accept the invitation
      await acceptInvitation(invitation!.id, uid!);
      setDone(true);

      // Redirect to portal after 2 seconds
      setTimeout(() => navigate('/portal'), 2000);
    } catch (err) {
      console.error(err);
      setError('Error al aceptar la invitación.');
      setAccepting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed top-20 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-float-slow" />
      <div className="fixed bottom-20 -right-32 w-80 h-80 bg-primary/15 rounded-full blur-[80px] animate-float" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] clay-shadow text-center">
          {loading ? (
            <div className="py-8">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
              <p className="text-on-surface-variant mt-4">Verificando invitación...</p>
            </div>
          ) : error ? (
            <div className="py-8">
              <div className="w-16 h-16 rounded-3xl bg-error/10 flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-error" />
              </div>
              <h2 className="font-headline text-xl font-bold text-on-surface mb-2">Invitación no válida</h2>
              <p className="text-on-surface-variant text-sm">{error}</p>
              <Link to="/" className="inline-block mt-6 text-primary font-bold text-sm hover:underline">Ir al inicio</Link>
            </div>
          ) : done ? (
            <div className="py-8">
              <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="font-headline text-xl font-bold text-on-surface mb-2">¡Vinculación exitosa!</h2>
              <p className="text-on-surface-variant text-sm">Ahora puedes ver la historia clínica de <strong>{invitation?.patientName}</strong>.</p>
              <p className="text-xs text-on-surface-variant mt-2">Redirigiendo al portal...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center clay-shadow-mint mx-auto mb-6">
                <PawPrint className="w-8 h-8 text-white" />
              </div>

              <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-2">Invitación de DATA ME</h2>
              <p className="text-on-surface-variant mb-6">
                El Dr(a). <strong>{invitation?.invitedByName}</strong> te invita a ver la historia clínica de:
              </p>

              <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-4 mb-6">
                <p className="font-headline text-2xl font-extrabold text-on-surface">{invitation?.patientName}</p>
                <p className="text-sm text-on-surface-variant mt-1">Código: {invitation?.code}</p>
              </div>

              <button
                onClick={handleLoginAndAccept}
                disabled={accepting}
                className="w-full flex items-center justify-center gap-3 bg-secondary text-on-secondary font-bold py-4 rounded-2xl clay-shadow-mint hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {accepting ? (
                  'Vinculando...'
                ) : user ? (
                  <><Check className="w-5 h-5" /> Aceptar Invitación</>
                ) : (
                  <><LogIn className="w-5 h-5" /> Ingresar con Google y Aceptar</>
                )}
              </button>

              <p className="text-xs text-on-surface-variant mt-4">
                Al aceptar, podrás ver las consultas, vacunas y citas de tu mascota.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
