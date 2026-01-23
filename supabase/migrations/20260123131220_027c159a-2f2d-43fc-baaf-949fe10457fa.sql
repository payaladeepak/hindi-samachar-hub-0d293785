-- Create storage bucket for news article images
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true);

-- Allow anyone to view images
CREATE POLICY "Anyone can view news images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'news-images');

-- Allow admins and editors to upload images
CREATE POLICY "Admins and editors can upload news images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'news-images' 
  AND (
    public.has_role(auth.uid(), 'admin'::app_role) 
    OR public.has_role(auth.uid(), 'editor'::app_role)
  )
);

-- Allow admins and editors to update images
CREATE POLICY "Admins and editors can update news images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'news-images' 
  AND (
    public.has_role(auth.uid(), 'admin'::app_role) 
    OR public.has_role(auth.uid(), 'editor'::app_role)
  )
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete news images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'news-images' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);