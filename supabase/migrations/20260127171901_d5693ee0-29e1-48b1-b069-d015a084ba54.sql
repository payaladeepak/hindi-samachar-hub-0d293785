-- Drop existing policies that need to be updated
DROP POLICY IF EXISTS "Admins and editors can update articles" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON public.news_articles;
DROP POLICY IF EXISTS "Admins and editors can insert articles" ON public.news_articles;

-- New INSERT policy: Editors must set themselves as author, Admins can insert for anyone
CREATE POLICY "Admins and editors can insert articles"
ON public.news_articles
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  OR (has_role(auth.uid(), 'editor'::app_role) AND author_id = auth.uid())
);

-- New UPDATE policy: Admins can update any, Editors can only update their own articles
CREATE POLICY "Admins can update any, editors own articles"
ON public.news_articles
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR (has_role(auth.uid(), 'editor'::app_role) AND author_id = auth.uid())
);

-- New DELETE policy: Admins can delete any, Editors can only delete their own articles
CREATE POLICY "Admins can delete any, editors own articles"
ON public.news_articles
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR (has_role(auth.uid(), 'editor'::app_role) AND author_id = auth.uid())
);