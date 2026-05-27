import { Link, useLocation } from 'react-router-dom';
import { Users, BarChart3 } from 'lucide-react';

export const navItems = [
  { name: 'Directory', path: '/employees', icon: Users },
  { name: 'Insights', path: '/insights', icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-hr-charcoal text-hr-mist flex flex-col shadow-xl z-20">
      <div className="p-6 mb-4">
        <h1 className="text-2xl font-bold tracking-wide text-hr-light flex items-center space-x-2">
          <div className="w-8 h-8 bg-hr-sage rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-hr-charcoal" />
          </div>
          <span>CompFlow HR</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-hr-olive text-hr-light shadow-md transform scale-[1.02]' 
                  : 'hover:bg-hr-olive/60 text-hr-mist hover:translate-x-1'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-hr-light' : 'text-hr-sage'}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
