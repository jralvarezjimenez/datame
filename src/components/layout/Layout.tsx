import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

export function Layout() {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === '/dashboard') return { title: 'DATA ME', subtitle: 'Panel del Profesional' };
    if (location.pathname.startsWith('/patients')) return { title: 'Pacientes' };
    if (location.pathname.startsWith('/agenda')) return { title: 'Agenda' };
    if (location.pathname.startsWith('/alerts')) return { title: 'Alertas' };
    if (location.pathname.startsWith('/portal')) return { title: 'Portal' };
    return { title: 'DATA ME' };
  };

  const { title, subtitle } = getTitle();

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <TopBar title={title} subtitle={subtitle} />
      <main className="md:ml-64 min-h-screen pb-24 md:pb-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
