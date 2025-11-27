'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Key, 
  Users, 
  Bitcoin, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronRight,
  Mail
} from 'lucide-react';
import { removeToken, getToken } from '@/lib/api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
    }
    
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsSidebarOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Digital Assets', href: '/dashboard/assets', icon: Key },
    { name: 'Beneficiaries', href: '/dashboard/beneficiaries', icon: Users },
    { name: 'Crypto Vault', href: '/dashboard/crypto', icon: Bitcoin },
    { name: 'Time Capsule', href: '/dashboard/messages', icon: Mail },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F7FF]">
      {/* Mobile Menu Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 bg-white border-r border-blue-100 shadow-lg md:shadow-none
          transition-transform duration-300 ease-in-out
          flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isMobile ? 'block' : 'block'}
        `}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-blue-50/50">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">EverAccess</span>
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <div className="px-4 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            // Fix: Check for exact match for dashboard root, prefix for others
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
            
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setIsSidebarOpen(false)}
                className={`
                  group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} className="opacity-80" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-blue-50">
          <div className="bg-blue-50/50 p-4 rounded-2xl mb-2">
            <p className="text-xs text-blue-600 font-medium mb-1">Secure Session</p>
            <p className="text-[10px] text-slate-500">Encrypted & Verified</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-blue-100 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded text-white">
               <ShieldCheck size={18} />
            </div>
            <span className="font-bold text-slate-900">EverAccess</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}