import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isEditor } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCloseSidebar = () => setSidebarOpen(false);
  const handleToggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar 
        isMobileOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onMobileClose={handleCloseSidebar}
        onToggleCollapse={handleToggleSidebar}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-background border-b lg:hidden">
          <div className="flex items-center gap-4 px-4 h-14">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">एडमिन पैनल</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
