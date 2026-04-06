import { Menu, Bell, Search } from 'lucide-react';

export function TopBar({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <header className="bg-surface/80 backdrop-blur-xl sticky top-0 z-40 w-full flex justify-between items-center px-6 py-4 shadow-sm shadow-teal-900/5 md:pl-72">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 text-teal-800 active:scale-90 transition-transform">
          <Menu className="w-6 h-6" />
        </button>
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
        
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-primary/10">
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
