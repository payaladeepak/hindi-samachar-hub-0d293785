import { NewsCard } from './NewsCard';
import type { NewsArticle } from '@/hooks/useNews';

interface NewsGridProps {
  articles: NewsArticle[];
  showFeatured?: boolean;
}

export function NewsGrid({ articles, showFeatured = false }: NewsGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">कोई खबर उपलब्ध नहीं है।</p>
      </div>
    );
  }

  const featuredArticle = showFeatured ? articles[0] : null;
  const remainingArticles = showFeatured ? articles.slice(1) : articles;

  return (
    <div className="space-y-8">
      {/* Featured Article */}
      {featuredArticle && (
        <NewsCard
          {...featuredArticle}
          variant="featured"
        />
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {remainingArticles.map((article, index) => (
          <div 
            key={article.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <NewsCard {...article} />
          </div>
        ))}
      </div>
    </div>
  );
}
