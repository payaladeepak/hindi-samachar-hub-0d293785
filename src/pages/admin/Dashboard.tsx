import { AdminLayout } from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNewsArticles } from '@/hooks/useNews';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { FileText, Eye, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: articles } = useNewsArticles();

  const totalArticles = articles?.length || 0;
  const breakingNews = articles?.filter(a => a.is_breaking).length || 0;
  const featuredNews = articles?.filter(a => a.is_featured).length || 0;
  const todayArticles = articles?.filter(a => {
    const today = new Date();
    const articleDate = new Date(a.published_at);
    return articleDate.toDateString() === today.toDateString();
  }).length || 0;

  const categoryStats = Object.entries(NEWS_CATEGORIES).map(([key, { label }]) => ({
    key,
    label,
    count: articles?.filter(a => a.category === key).length || 0,
  }));

  const recentArticles = articles?.slice(0, 5) || [];

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
              <CardTitle className="text-sm font-medium">फीचर्ड</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredNews}</div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Stats */}
          <Card>
            <CardHeader>
              <CardTitle>श्रेणी अनुसार खबरें</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryStats.map(({ key, label, count }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{label}</span>
                    <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
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
