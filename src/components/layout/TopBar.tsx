import { Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-surface/80 backdrop-blur-xl sticky top-0 z-40 w-full flex justify-between items-center px-6 py-4 shadow-sm shadow-teal-900/5 md:pl-72">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <h1 className="font-headline font-bold text-xl md:text-2xl text-teal-900 tracking-tight">{title}</h1>
          {subtitle && <span className="text-[10px] uppercase tracking-widest text-teal-600 font-bold">{subtitle}</span>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-white rounded-full px-4 py-1.5 shadow-sm border border-slate-100">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="border-none focus:ring-0 text-sm w-48 font-medium text-slate-600 bg-transparent outline-none"
          />
        </div>

        <button className="p-2 rounded-full hover:bg-slate-100 transition-colors text-teal-800 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full border-2 border-white"></span>
        </button>

        <button
          onClick={logout}
          className="md:hidden p-2 rounded-full hover:bg-red-50 transition-colors text-slate-500 hover:text-red-600"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-primary/10">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
              {user?.displayName?.charAt(0) || '?'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
