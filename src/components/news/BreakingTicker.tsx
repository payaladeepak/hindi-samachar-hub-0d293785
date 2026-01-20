import { useBreakingNews } from '@/hooks/useNews';

export function BreakingTicker() {
  const { data: breakingNews } = useBreakingNews();

  if (!breakingNews || breakingNews.length === 0) return null;

  // Duplicate content for seamless scrolling
  const tickerItems = [...breakingNews, ...breakingNews];

  return (
    <div className="bg-breaking text-breaking-foreground py-2 overflow-hidden">
      <div className="container flex items-center gap-4">
        <span className="flex-shrink-0 bg-breaking-foreground text-breaking px-3 py-1 text-sm font-bold rounded breaking-pulse">
          ब्रेकिंग
        </span>
        <div className="ticker-wrapper flex-1">
          <div className="ticker-content">
            {tickerItems.map((news, index) => (
              <span key={`${news.id}-${index}`} className="inline-block mx-8">
                {news.title}
                <span className="mx-4 text-breaking-foreground/50">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
