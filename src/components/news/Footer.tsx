import { Link } from 'react-router-dom';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const categories = Object.entries(NEWS_CATEGORIES);

  return (
    <footer className="bg-accent text-accent-foreground mt-12">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold font-display text-primary mb-4">{t('site.name')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('site.name')} - {t('site.tagline')}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold mb-4">{t('admin.categories')}</h3>
            <ul className="space-y-2">
              {categories.slice(0, 4).map(([key]) => (
                <li key={key}>
                  <Link 
                    to={`/category/${key}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(`category.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h3 className="font-bold mb-4">{t('common.all')}</h3>
            <ul className="space-y-2">
              {categories.slice(4).map(([key]) => (
                <li key={key}>
                  <Link 
                    to={`/category/${key}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(`category.${key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/auth"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('nav.login')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t('site.name')}. {t('footer.rights')}.
        </div>
      </div>
    </footer>
  );
}
