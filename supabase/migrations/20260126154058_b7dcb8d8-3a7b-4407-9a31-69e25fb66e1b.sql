-- Add view_count column to news_articles
ALTER TABLE public.news_articles 
ADD COLUMN view_count integer NOT NULL DEFAULT 0;

-- Create index for faster sorting by popularity
CREATE INDEX idx_news_articles_view_count ON public.news_articles(view_count DESC);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(article_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE news_articles 
  SET view_count = view_count + 1 
  WHERE id = article_id;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.increment_view_count(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_view_count(uuid) TO authenticated;

-- Enable realtime for news_articles to track live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_articles;