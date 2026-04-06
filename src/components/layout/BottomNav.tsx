import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Bell, UserCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: Home, label: 'Inicio', path: '/' },
  { icon: Users, label: 'Pacientes', path: '/patients' },
  { icon: Calendar, label: 'Agenda', path: '/agenda' },
  { icon: Bell, label: 'Alertas', path: '/alerts' },
  { icon: UserCircle, label: 'Portal', path: '/portal' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 md:hidden bg-white/80 backdrop-blur-xl rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1 transition-transform duration-150 tap-highlight-none",
              isActive 
                ? "bg-teal-100 text-teal-900 rounded-xl" 
                : "text-slate-500 hover:bg-teal-50 rounded-xl"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
            <span className="font-body text-[10px] font-medium mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
