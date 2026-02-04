import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Users, 
  Settings,
  Home,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Search
} from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Navigation items - some are admin-only
const getNavItems = (isAdmin: boolean) => {
  const items = [
    { icon: LayoutDashboard, label: 'डैशबोर्ड', href: '/admin', adminOnly: false },
    { icon: FileText, label: 'सभी खबरें', href: '/admin/articles', adminOnly: false },
    { icon: PlusCircle, label: 'नई खबर', href: '/admin/articles/new', adminOnly: false },
    { icon: FolderOpen, label: 'श्रेणियां', href: '/admin/categories', adminOnly: true },
    { icon: Users, label: 'यूजर प्रबंधन', href: '/admin/users', adminOnly: true },
    { icon: Search, label: 'SEO सेटिंग्स', href: '/admin/seo', adminOnly: true },
  ];
  
  return isAdmin ? items : items.filter(item => !item.adminOnly);
};

interface AdminSidebarProps {
  isMobileOpen: boolean;
  isCollapsed: boolean;
  onMobileClose: () => void;
  onToggleCollapse: () => void;
}

export function AdminSidebar({ isMobileOpen, isCollapsed, onMobileClose, onToggleCollapse }: AdminSidebarProps) {
  const location = useLocation();
  const { signOut, user, isAdmin } = useAuth();
  
  const navItems = getNavItems(isAdmin);

  return (
    <>
      {/* Mobile Overlay - closes sidebar when tapped */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out",
          // Mobile: slide in/out
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
          // Desktop: collapsed or expanded
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        {/* Logo & Toggle Buttons */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {/* Full logo - shown when expanded */}
          <Link 
            to="/admin" 
            className={cn(
              "block transition-opacity",
              isCollapsed ? "lg:hidden" : ""
            )}
          >
            <h1 className="text-xl font-bold text-sidebar-primary font-display">{SITE_NAME}</h1>
            <span className="text-xs text-sidebar-foreground/70">एडमिन पैनल</span>
          </Link>
          
          {/* Collapsed Logo - shown when sidebar is collapsed on desktop */}
          {isCollapsed && (
            <Link to="/admin" className="hidden lg:block mx-auto">
              <h1 className="text-xl font-bold text-sidebar-primary font-display">स</h1>
            </Link>
          )}

          {/* Close button for mobile */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMobileClose}
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Collapse/Expand button for desktop */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleCollapse}
            className={cn(
              "hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed && "mx-auto"
            )}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-primary font-medium" 
                        : "hover:bg-sidebar-accent/50",
                      isCollapsed && "lg:justify-center lg:px-2"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className={cn(isCollapsed && "lg:hidden")}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Link
            to="/profile"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors",
              isCollapsed && "lg:justify-center lg:px-2"
            )}
            title={isCollapsed ? "प्रोफ़ाइल" : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className={cn(isCollapsed && "lg:hidden")}>प्रोफ़ाइल</span>
          </Link>
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors",
              isCollapsed && "lg:justify-center lg:px-2"
            )}
            title={isCollapsed ? "वेबसाइट देखें" : undefined}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className={cn(isCollapsed && "lg:hidden")}>वेबसाइट देखें</span>
          </Link>
          <button
            onClick={signOut}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors w-full text-left",
              isCollapsed && "lg:justify-center lg:px-2"
            )}
            title={isCollapsed ? "लॉग आउट" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={cn(isCollapsed && "lg:hidden")}>लॉग आउट</span>
          </button>
          {user && !isCollapsed && (
            <div className="px-3 py-2 text-xs text-sidebar-foreground/60 truncate">
              {user.email}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
