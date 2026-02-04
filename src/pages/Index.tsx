import { MainLayout } from '@/layouts/MainLayout';
import { NewsGrid } from '@/components/news/NewsGrid';
import { NewsCard } from '@/components/news/NewsCard';
import { FlipSlider } from '@/components/news/FlipSlider';
import { PopularArticles } from '@/components/news/PopularArticles';
import { CategoryPopularityWidget } from '@/components/news/CategoryPopularityWidget';
import { useNewsArticles, useFeaturedNews } from '@/hooks/useNews';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const { data: articles, isLoading } = useNewsArticles();
  const { data: featuredArticle } = useFeaturedNews();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const latestArticles = articles?.slice(0, 6) || [];
  const sideArticles = articles?.slice(6, 10) || [];
  
  // Get top articles for the flip slider (featured + breaking + top viewed)
  const sliderArticles = articles?.slice(0, 5) || [];

  return (
    <MainLayout>
      {/* Hero Section with Flip Slider */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flip Slider */}
          <div className="lg:col-span-2">
            <FlipSlider articles={sliderArticles} autoPlay interval={5000} />
          </div>

          {/* Side Articles */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b-2 border-primary pb-2">
              ताज़ा खबरें
            </h3>
            {sideArticles.length > 0 ? (
              sideArticles.map((article) => (
                <NewsCard key={article.id} {...article} variant="compact" />
              ))
            ) : (
              <p className="text-muted-foreground text-sm py-4">
                अभी कोई खबर नहीं है
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Second Layer - Popular Articles with Live Tracking */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PopularArticles />
          <CategoryPopularityWidget />
        </div>
      </section>

      {/* Latest News */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">
            ताज़ा खबरें
          </h2>
        </div>
        {latestArticles.length > 0 ? (
          <NewsGrid articles={latestArticles} />
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground mb-4">
              अभी कोई खबर प्रकाशित नहीं हुई है
            </p>
            <Link to="/auth" className="text-primary hover:underline">
              एडमिन के रूप में लॉगिन करें और खबरें जोड़ें
            </Link>
          </div>
        )}
      </section>

      {/* Category Sections */}
      {Object.entries(NEWS_CATEGORIES).slice(0, 4).map(([key, { label }]) => {
        const categoryArticles = articles?.filter(a => a.category === key).slice(0, 3) || [];
        
        if (categoryArticles.length === 0) return null;

        return (
          <section key={key} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">
                {label}
              </h2>
              <Link 
                to={`/category/${key}`}
                className="text-primary hover:underline font-medium"
              >
                और देखें →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categoryArticles.map((article) => (
                <NewsCard key={article.id} {...article} />
              ))}
            </div>
          </section>
        );
      })}
    </MainLayout>
  );
}
