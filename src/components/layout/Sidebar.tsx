import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Bell, Package, UserCircle, LogOut, PawPrint } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Panel', path: '/dashboard' },
  { icon: Users, label: 'Pacientes', path: '/patients' },
  { icon: Calendar, label: 'Agenda', path: '/agenda' },
  { icon: Bell, label: 'Alertas', path: '/alerts' },
  { icon: Package, label: 'Inventario', path: '/inventory' },
  { icon: UserCircle, label: 'Portal', path: '/portal' },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const roleLabel: Record<string, string> = {
    veterinarian: 'Veterinario',
    staff: 'Staff',
    owner: 'Propietario',
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full p-4 w-64 bg-surface-container-lowest border-r border-outline-variant/20 z-50 overflow-y-auto no-scrollbar">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 mb-8">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center clay-shadow-coral">
          <PawPrint className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-xl font-extrabold text-on-surface font-headline">DATA ME</span>
      </div>

      {/* User card */}
      <div className="flex items-center gap-3 px-4 py-3 mb-6 bg-primary-container/30 rounded-2xl">
        {user?.photoURL ? (
          <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.displayName?.charAt(0) || '?'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-headline text-sm font-bold text-on-surface truncate">{user?.displayName || 'Usuario'}</p>
          <p className="text-xs text-on-surface-variant font-medium">{roleLabel[user?.role || 'owner']}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                isActive
                  ? "bg-primary text-on-primary font-bold clay-shadow-coral"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-primary-container/20 font-medium"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-all duration-200 mt-4"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Cerrar Sesión</span>
      </button>
    </aside>
  );
}
