import { ReactNode } from 'react';
import { Header } from '@/components/news/Header';
import { Footer } from '@/components/news/Footer';
import { BreakingTicker } from '@/components/news/BreakingTicker';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { useApplySEO } from '@/hooks/useSEOSettings';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // Track visitor on every page load
  useVisitorTracking();
  
  // Apply SEO settings (Google verification, Analytics)
  useApplySEO();

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
