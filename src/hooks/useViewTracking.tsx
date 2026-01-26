import { useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { NewsArticle } from './useNews';

// Track article view
export function useTrackView(articleId: string | undefined) {
  useEffect(() => {
    if (!articleId) return;
    
    // Check if already viewed in this session
    const viewedKey = `viewed_${articleId}`;
    if (sessionStorage.getItem(viewedKey)) return;
    
    // Increment view count
    const trackView = async () => {
      try {
        await supabase.rpc('increment_view_count', { article_id: articleId });
        sessionStorage.setItem(viewedKey, 'true');
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };
    
    trackView();
  }, [articleId]);
}

// Get popular articles with realtime updates
export function usePopularArticles(limit = 5) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['news', 'popular', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as NewsArticle[];
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('popular-articles')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'news_articles',
        },
        () => {
          // Invalidate query to refetch with new order
          queryClient.invalidateQueries({ queryKey: ['news', 'popular'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

// Get category stats with view counts
export function useCategoryViewStats() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['category-view-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('category, view_count');
      
      if (error) throw error;
      
      // Aggregate by category
      const stats: Record<string, { totalViews: number; articleCount: number }> = {};
      
      data.forEach((article) => {
        if (!stats[article.category]) {
          stats[article.category] = { totalViews: 0, articleCount: 0 };
        }
        stats[article.category].totalViews += article.view_count || 0;
        stats[article.category].articleCount += 1;
      });
      
      return stats;
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('category-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news_articles',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['category-view-stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

// Live article view count
export function useLiveViewCount(articleId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['article-view-count', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('view_count')
        .eq('id', articleId)
        .single();
      
      if (error) throw error;
      return data.view_count;
    },
    enabled: !!articleId,
  });

  // Subscribe to realtime updates for this specific article
  useEffect(() => {
    if (!articleId) return;

    const channel = supabase
      .channel(`article-${articleId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'news_articles',
          filter: `id=eq.${articleId}`,
        },
        (payload) => {
          queryClient.setQueryData(['article-view-count', articleId], payload.new.view_count);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId, queryClient]);

  return query;
}
