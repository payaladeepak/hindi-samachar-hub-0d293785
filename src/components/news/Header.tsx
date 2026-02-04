import { Link } from 'react-router-dom';
import { Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SITE_NAME, SITE_TAGLINE, NEWS_CATEGORIES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, isEditor, signOut } = useAuth();
  
  const categories = Object.entries(NEWS_CATEGORIES);

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      {/* Top Bar */}
      <div className="bg-accent text-accent-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <span>{new Date().toLocaleDateString('hi-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="hover:text-primary transition-colors">
                  प्रोफ़ाइल
                </Link>
                {isEditor && (
                  <Link to="/admin" className="hover:text-primary transition-colors font-medium">
                    एडमिन पैनल
                  </Link>
                )}
                <button onClick={signOut} className="hover:text-primary transition-colors">
                  लॉग आउट
                </button>
              </>
            ) : (
              <Link to="/auth" className="hover:text-primary transition-colors font-medium">
                लॉग इन
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-semibold hover:text-primary">
                  होम
                </Link>
                {categories.map(([key, { label }]) => (
                  <Link 
                    key={key} 
                    to={`/category/${key}`}
                    className="text-lg hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary font-display">
              {SITE_NAME}
            </h1>
            <span className="text-xs text-muted-foreground">{SITE_TAGLINE}</span>
          </Link>

          {/* Search & User */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link to={user ? '/profile' : '/auth'}>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:block bg-primary text-primary-foreground">
        <div className="container">
          <ul className="flex items-center justify-center gap-1">
            <li>
              <Link 
                to="/" 
                className="inline-block px-4 py-3 font-medium hover:bg-primary-foreground/10 transition-colors"
              >
                होम
              </Link>
            </li>
            {categories.map(([key, { label }]) => (
              <li key={key}>
                <Link 
                  to={`/category/${key}`}
                  className="inline-block px-4 py-3 font-medium hover:bg-primary-foreground/10 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
