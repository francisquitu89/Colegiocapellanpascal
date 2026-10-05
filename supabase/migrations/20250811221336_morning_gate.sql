/*
  # Setup Supabase Storage for news images

  1. Storage Setup
    - Create 'news-images' bucket for storing uploaded images
    - Set up public access policies for reading images
    - Allow authenticated and anonymous users to upload images

  2. Security
    - Public read access for all images
    - Upload permissions for all users (demo purposes)
    - File size and type restrictions via policies
*/

-- Create the storage bucket for news images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for news images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload news images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update news images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete news images" ON storage.objects;

-- Allow public read access to images
CREATE POLICY "Public read access for news images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'news-images');

-- Allow anyone to upload images (for demo purposes)
CREATE POLICY "Anyone can upload news images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'news-images');

-- Allow anyone to update images (for demo purposes)
CREATE POLICY "Anyone can update news images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'news-images');

-- Allow anyone to delete images (for demo purposes)
CREATE POLICY "Anyone can delete news images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'news-images');