import { Link } from 'react-router-dom';
import { usePopularArticles } from '@/hooks/useViewTracking';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { Eye, TrendingUp, Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function PopularArticles() {
  const { data: articles, isLoading } = usePopularArticles(5);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-primary pb-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">सबसे लोकप्रिय</h3>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b-2 border-primary pb-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">सबसे लोकप्रिय</h3>
        <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          लाइव
        </span>
      </div>
      
      <div className="space-y-3">
        {articles.map((article, index) => {
          const categoryInfo = NEWS_CATEGORIES[article.category];
          
          return (
            <Link
              key={article.id}
              to={`/news/${article.slug}`}
              className="flex items-start gap-3 group hover:bg-muted/50 p-2 rounded-lg transition-colors"
            >
              {/* Rank Badge */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0
                ${index === 0 ? 'bg-yellow-500 text-white' : 
                  index === 1 ? 'bg-gray-400 text-white' : 
                  index === 2 ? 'bg-amber-600 text-white' : 
                  'bg-muted text-muted-foreground'}
              `}>
                {index < 3 && <Flame className="w-4 h-4" />}
                {index >= 3 && (index + 1)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className={`px-1.5 py-0.5 rounded ${categoryInfo?.color || 'bg-gray-500'} text-white text-[10px]`}>
                    {categoryInfo?.label || article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {(article.view_count || 0).toLocaleString('hi-IN')}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
