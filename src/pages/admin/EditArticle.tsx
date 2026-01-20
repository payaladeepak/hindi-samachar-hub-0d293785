import { useParams } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import type { NewsArticle } from '@/hooks/useNews';

export default function EditArticle() {
  const { id } = useParams<{ id: string }>();
  
  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as NewsArticle;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!article) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">खबर नहीं मिली</h1>
          <p className="text-muted-foreground">यह खबर मौजूद नहीं है।</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">खबर संपादित करें</h1>
          <p className="text-muted-foreground">इस खबर में बदलाव करें</p>
        </div>
        <ArticleForm article={article} />
      </div>
    </AdminLayout>
  );
}
