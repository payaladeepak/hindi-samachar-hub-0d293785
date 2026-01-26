import { useCategoryViewStats } from '@/hooks/useViewTracking';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function CategoryPopularityWidget() {
  const { data: stats, isLoading } = useCategoryViewStats();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-primary pb-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">लोकप्रिय श्रेणियां</h3>
        </div>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  // Sort categories by total views
  const sortedCategories = Object.entries(stats)
    .map(([category, data]) => ({
      category,
      ...data,
      categoryInfo: NEWS_CATEGORIES[category as keyof typeof NEWS_CATEGORIES],
    }))
    .sort((a, b) => b.totalViews - a.totalViews);

  const maxViews = sortedCategories[0]?.totalViews || 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b-2 border-primary pb-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">लोकप्रिय श्रेणियां</h3>
        <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          लाइव
        </span>
      </div>
      
      <div className="space-y-3">
        {sortedCategories.slice(0, 6).map(({ category, totalViews, articleCount, categoryInfo }, index) => {
          const percentage = (totalViews / maxViews) * 100;
          
          return (
            <div key={category} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {index === 0 && <TrendingUp className="w-4 h-4 text-green-500" />}
                  <span className={`px-2 py-0.5 rounded text-white text-xs ${categoryInfo?.color || 'bg-gray-500'}`}>
                    {categoryInfo?.label || category}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">
                  {totalViews.toLocaleString('hi-IN')} व्यूज़ • {articleCount} खबरें
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${categoryInfo?.color || 'bg-gray-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
