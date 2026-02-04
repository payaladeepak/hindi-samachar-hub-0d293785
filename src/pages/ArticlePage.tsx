import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { useNewsArticle, useNewsArticles } from '@/hooks/useNews';
import { useTrackView, useLiveViewCount } from '@/hooks/useViewTracking';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { NewsCard } from '@/components/news/NewsCard';
import { SocialShareButtons } from '@/components/news/SocialShareButtons';
import { AuthorBio } from '@/components/news/AuthorBio';
import { Loader2, Clock, ArrowLeft, Eye } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { hi } from 'date-fns/locale';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useNewsArticle(slug || '');
  const { data: relatedArticles } = useNewsArticles(article?.category);
  const { data: liveViewCount } = useLiveViewCount(article?.id || '');
  
  // Track view when article is loaded
  useTrackView(article?.id);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error || !article) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">खबर नहीं मिली</h1>
          <p className="text-muted-foreground mb-6">यह खबर मौजूद नहीं है या हटा दी गई है।</p>
          <Link to="/" className="text-primary hover:underline">
            ← होम पेज पर वापस जाएं
          </Link>
        </div>
      </MainLayout>
    );
  }

  const categoryInfo = NEWS_CATEGORIES[article.category];
  const related = relatedArticles?.filter(a => a.id !== article.id).slice(0, 3) || [];

  return (
    <MainLayout>
      <article className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">होम</Link>
          <span>/</span>
          <Link to={`/category/${article.category}`} className="hover:text-primary">
            {categoryInfo.label}
          </Link>
        </div>

        {/* Category & Breaking Badge */}
        <div className="flex items-center gap-2 mb-4">
          {article.is_breaking && (
            <span className="category-badge bg-breaking text-breaking-foreground breaking-pulse">
              ब्रेकिंग
            </span>
          )}
          <span className={`category-badge ${categoryInfo.color} text-white`}>
            {categoryInfo.label}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(article.published_at), { 
                addSuffix: true, 
                locale: hi 
              })}
            </span>
          </div>
          <span>•</span>
          <span>
            {format(new Date(article.published_at), 'dd MMMM yyyy, h:mm a', { locale: hi })}
          </span>
          <span>•</span>
          <div className="flex items-center gap-1 text-primary font-medium">
            <Eye className="w-4 h-4" />
            <span>{(liveViewCount ?? article.view_count ?? 0).toLocaleString('hi-IN')} व्यूज़</span>
          </div>
        </div>

        {/* Featured Image */}
        {article.image_url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-lg text-muted-foreground mb-6 border-l-4 border-primary pl-4 italic">
            {article.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Social Share & Back Link */}
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            वापस होम पेज पर जाएं
          </Link>
          
          <SocialShareButtons 
            title={article.title} 
            url={window.location.href} 
          />
        </div>

        {/* Author Bio */}
        <AuthorBio authorId={article.author_id} />
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="mt-12 pt-12 border-t">
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-4">
            संबंधित खबरें
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((relatedArticle) => (
              <NewsCard key={relatedArticle.id} {...relatedArticle} />
            ))}
          </div>
        </section>
      )}
    </MainLayout>
  );
}
