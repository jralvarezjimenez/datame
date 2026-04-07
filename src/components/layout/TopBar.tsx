import { Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-surface/70 backdrop-blur-xl sticky top-0 z-40 w-full flex justify-between items-center px-6 py-4 border-b border-outline-variant/15 md:pl-72">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <h1 className="font-headline font-extrabold text-xl md:text-2xl text-on-surface tracking-tight">{title}</h1>
          {subtitle && <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{subtitle}</span>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center bg-surface-container-lowest rounded-2xl px-4 py-2 clay-shadow">
          <Search className="w-4 h-4 text-on-surface-variant mr-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="border-none focus:ring-0 text-sm w-40 font-medium text-on-surface bg-transparent outline-none"
          />
        </div>

        <button className="p-2.5 rounded-2xl bg-surface-container-lowest clay-shadow hover:scale-105 transition-transform text-on-surface-variant relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface-container-lowest" />
        </button>

        <button
          onClick={logout}
          className="md:hidden p-2.5 rounded-2xl bg-surface-container-lowest clay-shadow hover:scale-105 transition-transform text-on-surface-variant"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-2xl overflow-hidden clay-shadow">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold">
              {user?.displayName?.charAt(0) || '?'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
