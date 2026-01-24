-- Add SEO fields to news_articles table
ALTER TABLE public.news_articles 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- Add index on keywords for faster search
CREATE INDEX IF NOT EXISTS idx_news_articles_keywords ON public.news_articles USING GIN(keywords);