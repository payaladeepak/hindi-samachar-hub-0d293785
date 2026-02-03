-- Create article status enum
CREATE TYPE public.article_status AS ENUM ('draft', 'pending_review', 'published');

-- Add status column to news_articles
ALTER TABLE public.news_articles 
ADD COLUMN status public.article_status NOT NULL DEFAULT 'published';

-- Update existing articles to published status (they were already live)
UPDATE public.news_articles SET status = 'published' WHERE status IS NULL;

-- Update RLS policy for viewing - only show published articles publicly, but authors can see their own drafts
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.news_articles;

CREATE POLICY "Public can view published articles"
ON public.news_articles
FOR SELECT
USING (
  status = 'published' 
  OR author_id = auth.uid() 
  OR has_role(auth.uid(), 'admin'::app_role)
);