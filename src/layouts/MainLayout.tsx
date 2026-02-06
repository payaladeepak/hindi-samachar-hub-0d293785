import { ReactNode } from 'react';
import { Header } from '@/components/news/Header';
import { Footer } from '@/components/news/Footer';
import { BreakingTicker } from '@/components/news/BreakingTicker';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // Track visitor on every page load
  useVisitorTracking();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreakingTicker />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
