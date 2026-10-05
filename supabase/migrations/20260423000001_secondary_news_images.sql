-- Proyecto secundario: bucket news-images para mover imágenes y logo
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read access for news images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload news images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update news images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete news images" ON storage.objects;

CREATE POLICY "Public read access for news images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'news-images');

CREATE POLICY "Anyone can upload news images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Anyone can update news images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'news-images');

CREATE POLICY "Anyone can delete news images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'news-images');
