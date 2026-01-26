import { AdminLayout } from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNewsArticles } from '@/hooks/useNews';
import { useCategoryViewStats } from '@/hooks/useViewTracking';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { FileText, Eye, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: articles } = useNewsArticles();
  const { data: categoryStats } = useCategoryViewStats();

  const totalArticles = articles?.length || 0;
  const breakingNews = articles?.filter(a => a.is_breaking).length || 0;
  const totalViews = articles?.reduce((sum, a) => sum + (a.view_count || 0), 0) || 0;
  const todayArticles = articles?.filter(a => {
    const today = new Date();
    const articleDate = new Date(a.published_at);
    return articleDate.toDateString() === today.toDateString();
  }).length || 0;

  // Get sorted categories by views
  const sortedCategoryStats = categoryStats 
    ? Object.entries(categoryStats)
        .map(([key, data]) => ({
          key,
          label: NEWS_CATEGORIES[key as keyof typeof NEWS_CATEGORIES]?.label || key,
          ...data,
        }))
        .sort((a, b) => b.totalViews - a.totalViews)
    : [];

  const recentArticles = articles?.slice(0, 5) || [];
  const topArticles = [...(articles || [])].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">डैशबोर्ड</h1>
          <p className="text-muted-foreground">स्वागत है! यहाँ आपकी वेबसाइट का ओवरव्यू है।</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">कुल खबरें</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArticles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ब्रेकिंग न्यूज़</CardTitle>
              <TrendingUp className="h-4 w-4 text-breaking" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-breaking">{breakingNews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">कुल व्यूज़</CardTitle>
              <Eye className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalViews.toLocaleString('hi-IN')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="relative flex h-2 w-2 inline-flex mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                लाइव ट्रैकिंग
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">आज की खबरें</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayArticles}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Stats with Views */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                श्रेणी अनुसार व्यूज़
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedCategoryStats.slice(0, 8).map(({ key, label, totalViews, articleCount }, index) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {index === 0 && <TrendingUp className="w-4 h-4 text-green-500" />}
                      <span className="text-sm">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{articleCount} खबरें</span>
                      <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                        {totalViews.toLocaleString('hi-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Articles by Views */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                सबसे लोकप्रिय खबरें
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topArticles.length > 0 ? (
                <div className="space-y-3">
                  {topArticles.map((article, index) => (
                    <Link 
                      key={article.id} 
                      to={`/admin/articles/${article.id}/edit`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${index === 0 ? 'bg-yellow-500 text-white' : 
                          index === 1 ? 'bg-gray-400 text-white' : 
                          index === 2 ? 'bg-amber-600 text-white' : 
                          'bg-muted text-muted-foreground'}
                      `}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{article.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {(article.view_count || 0).toLocaleString('hi-IN')} व्यूज़
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  अभी कोई खबर नहीं है
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Articles */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>हाल की खबरें</CardTitle>
              <Link to="/admin/articles" className="text-sm text-primary hover:underline">
                सभी देखें
              </Link>
            </CardHeader>
            <CardContent>
              {recentArticles.length > 0 ? (
                <div className="space-y-3">
                  {recentArticles.map((article) => (
                    <Link 
                      key={article.id} 
                      to={`/admin/articles/${article.id}/edit`}
                      className="block p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <p className="font-medium line-clamp-1">{article.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {NEWS_CATEGORIES[article.category].label}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  अभी कोई खबर नहीं है
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
