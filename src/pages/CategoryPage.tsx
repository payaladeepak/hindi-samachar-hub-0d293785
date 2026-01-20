import { useParams } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { NewsGrid } from '@/components/news/NewsGrid';
import { useNewsArticles } from '@/hooks/useNews';
import { NEWS_CATEGORIES, type NewsCategory } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { data: articles, isLoading } = useNewsArticles(category as NewsCategory);

  const categoryInfo = category ? NEWS_CATEGORIES[category as NewsCategory] : null;

  if (!categoryInfo) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">श्रेणी नहीं मिली</h1>
          <p className="text-muted-foreground">यह श्रेणी मौजूद नहीं है।</p>
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

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold border-l-4 border-primary pl-4">
          {categoryInfo.label}
        </h1>
        <p className="text-muted-foreground mt-2">
          {categoryInfo.label} से जुड़ी सभी ताज़ा खबरें
        </p>
      </div>

      {articles && articles.length > 0 ? (
        <NewsGrid articles={articles} showFeatured />
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            इस श्रेणी में अभी कोई खबर नहीं है
          </p>
        </div>
      )}
    </MainLayout>
  );
}
