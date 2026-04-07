import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Bell, UserCircle, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Panel', path: '/' },
  { icon: Users, label: 'Pacientes', path: '/patients' },
  { icon: Calendar, label: 'Agenda', path: '/agenda' },
  { icon: Bell, label: 'Alertas', path: '/alerts' },
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
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full p-4 w-64 bg-slate-50 border-r border-slate-200 z-50 overflow-y-auto no-scrollbar">
      <div className="text-2xl font-black text-teal-800 mb-8 px-4 font-headline">DATA ME</div>

      <div className="flex items-center gap-3 px-4 py-3 mb-8 bg-white rounded-xl shadow-sm">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-10 h-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {user?.displayName?.charAt(0) || '?'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-headline text-sm font-bold text-teal-800 truncate">{user?.displayName || 'Usuario'}</p>
          <p className="font-label text-xs text-slate-500">{roleLabel[user?.role || 'owner']}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-white text-teal-700 shadow-sm font-bold"
                  : "text-slate-600 hover:text-teal-600 hover:bg-teal-50/50 font-medium"
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
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 mt-4"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Cerrar Sesión</span>
      </button>
    </aside>
  );
}
