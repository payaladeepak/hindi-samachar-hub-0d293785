import { Link } from 'react-router-dom';
import { SITE_NAME, NEWS_CATEGORIES } from '@/lib/constants';

export function Footer() {
  const categories = Object.entries(NEWS_CATEGORIES);

  return (
    <footer className="bg-accent text-accent-foreground mt-12">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold font-display text-primary mb-4">{SITE_NAME}</h2>
            <p className="text-muted-foreground mb-4">
              भारत का सबसे विश्वसनीय हिंदी समाचार पोर्टल। हम आपको देश-विदेश की ताज़ा खबरें, 
              राजनीति, खेल, मनोरंजन और व्यापार की खबरें प्रदान करते हैं।
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold mb-4">श्रेणियाँ</h3>
            <ul className="space-y-2">
              {categories.slice(0, 4).map(([key, { label }]) => (
                <li key={key}>
                  <Link 
                    to={`/category/${key}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h3 className="font-bold mb-4">और देखें</h3>
            <ul className="space-y-2">
              {categories.slice(4).map(([key, { label }]) => (
                <li key={key}>
                  <Link 
                    to={`/category/${key}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/auth"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  लॉग इन
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}। सर्वाधिकार सुरक्षित।
        </div>
      </div>
    </footer>
  );
}
