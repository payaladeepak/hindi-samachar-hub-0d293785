import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Eye } from 'lucide-react';
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
  view_count?: number;
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
  view_count = 0,
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
        <article className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-muted">
            <img
              src={image_url || '/placeholder.svg'}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
          
          {/* Reading overlay effect */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-500" />
          
          {/* View indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
            <div className="bg-primary/90 rounded-full p-4 backdrop-blur-sm shadow-lg">
              <Eye className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-[-8px]">
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
            <h2 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-3 group-hover:text-primary-foreground transition-colors">
              {title}
            </h2>
            {excerpt && (
              <p className="text-white/80 line-clamp-2 mb-3">{excerpt}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{timeAgo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{view_count.toLocaleString('hi-IN')}</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                पढ़ें <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/news/${slug}`} className="block group">
        <article className="flex gap-4 p-3 rounded-lg hover:bg-accent/50 transition-all duration-300 border border-transparent hover:border-primary/20 hover:shadow-md">
          <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
            <img
              src={image_url || '/placeholder.svg'}
              alt={title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
          </div>
          <div className="flex-1 min-w-0">
            <span className={`category-badge ${categoryInfo.color} text-white text-xs mb-1 inline-block`}>
              {categoryInfo.label}
            </span>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{timeAgo}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{view_count.toLocaleString('hi-IN')}</span>
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-300 self-center flex-shrink-0 transform translate-x-[-4px] group-hover:translate-x-0" />
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/news/${slug}`} className="block group">
      <article className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-transparent hover:border-primary/30 transform hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={image_url || '/placeholder.svg'}
            alt={title}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* View button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-primary/90 rounded-full p-3 backdrop-blur-sm shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Eye className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          
          {is_breaking && (
            <span className="absolute top-3 left-3 category-badge bg-breaking text-breaking-foreground breaking-pulse">
              ब्रेकिंग
            </span>
          )}
          
          {/* Read more indicator */}
          <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-1 shadow-lg">
            पढ़ें <ArrowRight className="w-3 h-3" />
          </div>
        </div>
        <div className="p-5">
          <span className={`category-badge ${categoryInfo.color} text-white text-xs mb-2 inline-block`}>
            {categoryInfo.label}
          </span>
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-2">
            {title}
          </h3>
          {excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3 group-hover:text-foreground/80 transition-colors duration-300">{excerpt}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{timeAgo}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{view_count.toLocaleString('hi-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
