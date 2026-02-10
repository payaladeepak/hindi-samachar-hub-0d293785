-- Change category column from enum to text to support dynamic categories
ALTER TABLE public.news_articles 
  ALTER COLUMN category TYPE text USING category::text;

-- Set default to 'national' as text
ALTER TABLE public.news_articles 
  ALTER COLUMN category SET DEFAULT 'national';

-- Drop the old enum type (no longer needed)
DROP TYPE IF EXISTS public.news_category;