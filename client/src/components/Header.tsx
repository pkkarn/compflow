import { useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { navItems } from './Sidebar';

export function Header() {
  const location = useLocation();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 h-20 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-hr-charcoal">
          {navItems.find(i => location.pathname.startsWith(i.path))?.name || 'Dashboard'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage your organization's data</p>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2.5 bg-gray-100 rounded-full text-gray-500 hover:text-hr-sage hover:bg-hr-mist transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-hr-olive flex items-center justify-center text-white font-bold shadow-inner border-2 border-hr-light">
          HR
        </div>
      </div>
    </header>
  );
}
