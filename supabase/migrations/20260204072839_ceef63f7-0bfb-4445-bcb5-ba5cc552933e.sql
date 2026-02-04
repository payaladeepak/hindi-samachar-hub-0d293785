-- Add bio column to profiles table for author descriptions
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;

-- Add a comment for the column
COMMENT ON COLUMN public.profiles.bio IS 'Short biography/description of the user for author pages';