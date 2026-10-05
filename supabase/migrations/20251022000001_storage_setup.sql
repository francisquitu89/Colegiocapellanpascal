-- Create storage bucket for directory images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public read access to images
CREATE POLICY "Public Access to images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Create policy to allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

-- Create policy to allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
