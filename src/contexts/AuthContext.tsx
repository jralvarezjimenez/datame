import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export type UserRole = 'veterinarian' | 'staff' | 'owner' | 'pending';
export type AccountType = 'veterinarian' | 'clinic' | 'owner';

interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  accountType?: AccountType;
  clinicId?: string;
  displayName: string;
  photoURL: string | null;
  roleSelected: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  isVetOrStaff: boolean;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: (userData?.role as UserRole) || 'pending',
            accountType: userData?.accountType as AccountType | undefined,
            clinicId: userData?.clinicId,
            displayName: firebaseUser.displayName || firebaseUser.email || 'Usuario',
            photoURL: firebaseUser.photoURL,
            roleSelected: userData?.roleSelected ?? false,
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Still set basic user even if Firestore fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: 'pending',
            displayName: firebaseUser.displayName || firebaseUser.email || 'Usuario',
            photoURL: firebaseUser.photoURL,
            roleSelected: false,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const isVetOrStaff = user?.role === 'veterinarian' || user?.role === 'staff';
  const isOwner = user?.role === 'owner';

  return (
    <AuthContext.Provider value={{ user, loading, logout, isVetOrStaff, isOwner }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
