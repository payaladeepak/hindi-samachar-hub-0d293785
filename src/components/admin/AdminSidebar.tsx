import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Users, 
  Settings,
  Home,
  LogOut
} from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'डैशबोर्ड', href: '/admin' },
  { icon: FileText, label: 'सभी खबरें', href: '/admin/articles' },
  { icon: PlusCircle, label: 'नई खबर', href: '/admin/articles/new' },
  { icon: Users, label: 'उपयोगकर्ता', href: '/admin/users' },
  { icon: Settings, label: 'सेटिंग्स', href: '/admin/settings' },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/admin" className="block">
          <h1 className="text-xl font-bold text-sidebar-primary font-display">{SITE_NAME}</h1>
          <span className="text-xs text-sidebar-foreground/70">एडमिन पैनल</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
                      : "hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>वेबसाइट देखें</span>
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>लॉग आउट</span>
        </button>
        {user && (
          <div className="px-4 py-2 text-xs text-sidebar-foreground/60 truncate">
            {user.email}
          </div>
        )}
      </div>
    </aside>
  );
}
