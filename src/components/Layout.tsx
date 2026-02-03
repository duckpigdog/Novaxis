import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Flag, Shield, Wrench, Settings, LayoutDashboard, Monitor, Swords, ShieldAlert } from 'lucide-react';
import { ctfCategories } from '@/lib/categories';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAWD = location.pathname.startsWith('/awd');

  // Define Navigation Items based on Mode
  const ctfNavItems = ctfCategories.map(cat => ({
    name: cat.name,
    path: `/ctf/${cat.id}`,
    icon: cat.icon
  }));

  const awdNavItems = [
    { name: 'Dashboard', path: '/awd', icon: LayoutDashboard },
    { name: 'Monitor', path: '/awd/monitor', icon: Monitor },
    { name: 'Attack', path: '/awd/attack', icon: Swords },
    { name: 'Defense', path: '/awd/defense', icon: ShieldAlert },
  ];

  const currentNavItems = isAWD ? awdNavItems : ctfNavItems;

  const commonItems = [
    { name: 'Tools', path: '/tools', icon: Wrench },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white transition-transform flex flex-col">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <span className="text-xl font-bold text-slate-800">Novaxis</span>
          <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {isAWD ? 'AWD' : 'CTF'}
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-2">
            <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-slate-400">
              {isAWD ? 'AWD Modules' : 'CTF Categories'}
            </h3>
            <ul className="space-y-1">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
                        isActive && "bg-slate-100 font-medium text-blue-600"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-6 px-3">
            <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-slate-400">
              General
            </h3>
            <ul className="space-y-1">
              {commonItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
                        isActive && "bg-slate-100 font-medium text-blue-600"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex min-h-screen w-full flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium text-slate-800">
              {isAWD ? 'Attack With Defense' : 'Capture The Flag'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Mode Switcher */}
            <button
              onClick={() => navigate(isAWD ? '/ctf/misc' : '/awd')}
              className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              {isAWD ? <Flag className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
              Switch to {isAWD ? 'CTF' : 'AWD'}
            </button>

            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
