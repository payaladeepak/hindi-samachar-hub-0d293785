import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { NEWS_CATEGORIES, type NewsCategory } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { hi } from 'date-fns/locale';

interface NewsCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: NewsCategory;
  image_url: string | null;
  published_at: string;
  is_breaking?: boolean;
  variant?: 'default' | 'featured' | 'compact';
}

export function NewsCard({
  title,
  slug,
  excerpt,
  category,
  image_url,
  published_at,
  is_breaking,
  variant = 'default',
}: NewsCardProps) {
  const categoryInfo = NEWS_CATEGORIES[category];
  const timeAgo = formatDistanceToNow(new Date(published_at), { 
    addSuffix: true, 
    locale: hi 
  });

  if (variant === 'featured') {
    return (
      <Link to={`/news/${slug}`} className="block group">
        <article className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden news-card">
          <img
            src={image_url || '/placeholder.svg'}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 gradient-overlay" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              {is_breaking && (
                <span className="category-badge bg-breaking text-breaking-foreground breaking-pulse">
                  ब्रेकिंग
                </span>
              )}
              <span className={`category-badge ${categoryInfo.color} text-white`}>
                {categoryInfo.label}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-3">
              {title}
            </h2>
            {excerpt && (
              <p className="text-white/80 line-clamp-2 mb-3">{excerpt}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Clock className="w-4 h-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/news/${slug}`} className="block group">
        <article className="flex gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
          <img
            src={image_url || '/placeholder.svg'}
            alt={title}
            className="w-24 h-20 object-cover rounded flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className={`category-badge ${categoryInfo.color} text-white text-xs mb-1 inline-block`}>
              {categoryInfo.label}
            </span>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/news/${slug}`} className="block group">
      <article className="bg-card rounded-lg overflow-hidden shadow-md news-card h-full">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image_url || '/placeholder.svg'}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {is_breaking && (
            <span className="absolute top-3 left-3 category-badge bg-breaking text-breaking-foreground breaking-pulse">
              ब्रेकिंग
            </span>
          )}
        </div>
        <div className="p-4">
          <span className={`category-badge ${categoryInfo.color} text-white text-xs mb-2 inline-block`}>
            {categoryInfo.label}
          </span>
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {title}
          </h3>
          {excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{excerpt}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
