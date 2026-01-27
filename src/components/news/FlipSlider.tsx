import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { NEWS_CATEGORIES, type NewsCategory } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { hi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import type { NewsArticle } from '@/hooks/useNews';

interface FlipSliderProps {
  articles: NewsArticle[];
  autoPlay?: boolean;
  interval?: number;
}

export function FlipSlider({ articles, autoPlay = true, interval = 5000 }: FlipSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

  const goToNext = useCallback(() => {
    if (isFlipping || articles.length <= 1) return;
    setFlipDirection('next');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
      setTimeout(() => setIsFlipping(false), 300);
    }, 300);
  }, [isFlipping, articles.length]);

  const goToPrev = useCallback(() => {
    if (isFlipping || articles.length <= 1) return;
    setFlipDirection('prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
      setTimeout(() => setIsFlipping(false), 300);
    }, 300);
  }, [isFlipping, articles.length]);

  const goToSlide = useCallback((index: number) => {
    if (isFlipping || index === currentIndex) return;
    setFlipDirection(index > currentIndex ? 'next' : 'prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsFlipping(false), 300);
    }, 300);
  }, [isFlipping, currentIndex]);

  useEffect(() => {
    if (!autoPlay || articles.length <= 1) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, goToNext, articles.length]);

  if (articles.length === 0) {
    return (
      <div className="h-[400px] md:h-[500px] bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">कोई फीचर्ड खबर नहीं है</p>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];
  const categoryInfo = NEWS_CATEGORIES[currentArticle.category as NewsCategory];
  const timeAgo = formatDistanceToNow(new Date(currentArticle.published_at), { 
    addSuffix: true, 
    locale: hi 
  });

  return (
    <div className="relative h-[400px] md:h-[500px] perspective-1000">
      {/* Flip Container */}
      <div 
        className={`relative w-full h-full transition-transform duration-600 transform-style-3d ${
          isFlipping 
            ? flipDirection === 'next' 
              ? 'animate-flip-out' 
              : 'animate-flip-out-reverse'
            : 'animate-flip-in'
        }`}
      >
        <Link to={`/news/${currentArticle.slug}`} className="block h-full group">
          <article className="relative h-full rounded-xl overflow-hidden shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0 bg-muted">
              <img
                src={currentArticle.image_url || '/placeholder.svg'}
                alt={currentArticle.title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-3">
                {currentArticle.is_breaking && (
                  <span className="category-badge bg-breaking text-breaking-foreground breaking-pulse">
                    ब्रेकिंग
                  </span>
                )}
                <span className={`category-badge ${categoryInfo?.color || 'bg-primary'} text-white`}>
                  {categoryInfo?.label || currentArticle.category}
                </span>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-bold mb-3 line-clamp-3 group-hover:text-primary transition-colors">
                {currentArticle.title}
              </h2>
              
              {currentArticle.excerpt && (
                <p className="text-white/80 line-clamp-2 mb-4 text-base md:text-lg max-w-3xl">
                  {currentArticle.excerpt}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{timeAgo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{currentArticle.view_count.toLocaleString('hi-IN')} व्यूज</span>
                </div>
              </div>
            </div>
          </article>
        </Link>
      </div>

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10 backdrop-blur-sm z-10"
            onClick={(e) => { e.preventDefault(); goToPrev(); }}
            disabled={isFlipping}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10 backdrop-blur-sm z-10"
            onClick={(e) => { e.preventDefault(); goToNext(); }}
            disabled={isFlipping}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {articles.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
        {currentIndex + 1} / {articles.length}
      </div>
    </div>
  );
}
