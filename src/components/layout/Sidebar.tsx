import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, History, Package, Receipt, BarChart3, Settings, Bell, UserCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Panel', path: '/' },
  { icon: Users, label: 'Pacientes', path: '/patients' },
  { icon: Calendar, label: 'Agenda', path: '/agenda' },
  { icon: Bell, label: 'Alertas', path: '/alerts' },
  { icon: History, label: 'Historial', path: '/history' },
  { icon: Package, label: 'Inventario', path: '/inventory' },
  { icon: Receipt, label: 'Facturación', path: '/billing' },
  { icon: BarChart3, label: 'Reportes', path: '/reports' },
  { icon: Settings, label: 'Ajustes', path: '/settings' },
  { icon: UserCircle, label: 'Portal', path: '/portal' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full p-4 w-64 bg-slate-50 border-r border-slate-200 z-50 overflow-y-auto no-scrollbar">
      <div className="text-2xl font-black text-teal-800 mb-8 px-4 font-headline">DATA ME</div>
      
      <div className="flex items-center gap-3 px-4 py-3 mb-8 bg-white rounded-xl shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100" 
          alt="Admin" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-headline text-sm font-bold text-teal-800">Admin DATA ME</p>
          <p className="font-label text-xs text-slate-500">Clínica Central</p>
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
    </aside>
  );
}
