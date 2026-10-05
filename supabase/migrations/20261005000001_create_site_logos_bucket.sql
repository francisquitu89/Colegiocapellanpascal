-- Storage bucket for the site logo and home hero images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-logos',
  'site-logos',
  true,
  8388608,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read site logos" ON storage.objects;
DROP POLICY IF EXISTS "Public upload site logos" ON storage.objects;
DROP POLICY IF EXISTS "Public update site logos" ON storage.objects;
DROP POLICY IF EXISTS "Public delete site logos" ON storage.objects;

CREATE POLICY "Public read site logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-logos');

CREATE POLICY "Public upload site logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-logos');

CREATE POLICY "Public update site logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-logos')
WITH CHECK (bucket_id = 'site-logos');

CREATE POLICY "Public delete site logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-logos');