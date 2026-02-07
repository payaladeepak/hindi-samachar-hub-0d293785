-- Create SEO settings table for site-wide configuration
CREATE TABLE public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read SEO settings (needed for meta tags)
CREATE POLICY "SEO settings are publicly readable"
ON public.seo_settings
FOR SELECT
USING (true);

-- Only admins can modify SEO settings
CREATE POLICY "Only admins can insert SEO settings"
ON public.seo_settings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can update SEO settings"
ON public.seo_settings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert default settings
INSERT INTO public.seo_settings (setting_key, setting_value) VALUES
  ('site_name', 'ताज़ा खबर'),
  ('site_description', 'भारत की सबसे विश्वसनीय हिंदी समाचार वेबसाइट'),
  ('default_keywords', 'हिंदी समाचार, ताज़ा खबर, भारत समाचार'),
  ('google_verification', ''),
  ('bing_verification', ''),
  ('google_analytics_id', '');

-- Add trigger for updated_at
CREATE TRIGGER update_seo_settings_updated_at
BEFORE UPDATE ON public.seo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();