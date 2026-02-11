import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { NewsCategory, ArticleStatus } from '@/lib/constants';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: NewsCategory;
  image_url: string | null;
  is_breaking: boolean;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  author_id: string | null;
  seo_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  og_image: string | null;
  canonical_url: string | null;
  view_count: number;
  status: ArticleStatus;
}

export function useNewsArticles(category?: NewsCategory) {
  return useQuery({
    queryKey: ['news', category],
    queryFn: async () => {
      let query = supabase
        .from('news_articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as NewsArticle[];
    },
  });
}

// Extended type for admin articles with author info
export interface AdminNewsArticle extends NewsArticle {
  author_name?: string | null;
}

// Fetch articles for admin panel - admins see all, editors see only their own
export function useAdminArticles(userId: string | undefined, isAdmin: boolean) {
  return useQuery({
    queryKey: ['news', 'admin', userId, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false });
      
      // Editors only see their own articles
      if (!isAdmin && userId) {
        query = query.eq('author_id', userId);
      }
      
      const { data: articles, error } = await query;
      
      if (error) throw error;
      
      // Fetch author names for all unique author_ids
      const authorIds = [...new Set(articles?.filter(a => a.author_id).map(a => a.author_id) || [])];
      
      let authorMap: Record<string, string> = {};
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', authorIds);
        
        if (profiles) {
          authorMap = profiles.reduce((acc, p) => {
            acc[p.user_id] = p.display_name || 'अज्ञात';
            return acc;
          }, {} as Record<string, string>);
        }
      }
      
      // Merge author names into articles
      return (articles || []).map(article => ({
        ...article,
        author_name: article.author_id ? authorMap[article.author_id] || 'अज्ञात' : null,
      })) as AdminNewsArticle[];
    },
    enabled: !!userId,
  });
}

export function useBreakingNews() {
  return useQuery({
    queryKey: ['news', 'breaking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('is_breaking', true)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as NewsArticle[];
    },
  });
}

export function useFeaturedNews() {
  return useQuery({
    queryKey: ['news', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data?.[0] as NewsArticle | undefined;
    },
  });
}

export function useNewsArticle(slug: string) {
  return useQuery({
    queryKey: ['news', 'article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as NewsArticle;
    },
    enabled: !!slug,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('news_articles')
        .insert(article)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...article }: Partial<NewsArticle> & { id: string }) => {
      const { data, error } = await supabase
        .from('news_articles')
        .update(article)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}
