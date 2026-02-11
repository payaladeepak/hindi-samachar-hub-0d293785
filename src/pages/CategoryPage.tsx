import { useParams } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { NewsGrid } from '@/components/news/NewsGrid';
import { useNewsArticles } from '@/hooks/useNews';
import { useCategoryMap } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { data: articles, isLoading } = useNewsArticles(category);
  const { t, language } = useLanguage();
  const categoryMap = useCategoryMap();

  const categoryInfo = category ? categoryMap[category] : null;

  if (!categoryInfo) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">{t('category.notFound')}</h1>
          <p className="text-muted-foreground">{t('category.notExists')}</p>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const categoryLabel = categoryInfo.label;

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold border-l-4 border-primary pl-4">
          {categoryLabel}
        </h1>
        <p className="text-muted-foreground mt-2">
          {language === 'hi' 
            ? `${categoryLabel} ${t('category.allNews')}`
            : `${t('category.allNews')} ${categoryLabel}`
          }
        </p>
      </div>

      {articles && articles.length > 0 ? (
        <NewsGrid articles={articles} showFeatured />
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            {t('category.noNews')}
          </p>
        </div>
      )}
    </MainLayout>
  );
}
