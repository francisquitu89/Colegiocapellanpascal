-- Create instructivo_classroom table
CREATE TABLE IF NOT EXISTS instructivo_classroom (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create storage bucket for recursos digitales files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('recursos-digitales-files', 'recursos-digitales-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public SELECT on recursos-digitales-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public INSERT on recursos-digitales-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public UPDATE on recursos-digitales-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public DELETE on recursos-digitales-files" ON storage.objects;

-- Create storage policies for public access
CREATE POLICY "Allow public SELECT on recursos-digitales-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'recursos-digitales-files');

CREATE POLICY "Allow public INSERT on recursos-digitales-files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'recursos-digitales-files');

CREATE POLICY "Allow public UPDATE on recursos-digitales-files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'recursos-digitales-files');

CREATE POLICY "Allow public DELETE on recursos-digitales-files"
ON storage.objects FOR DELETE
USING (bucket_id = 'recursos-digitales-files');

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_instructivo_classroom_updated_at ON instructivo_classroom;

CREATE TRIGGER update_instructivo_classroom_updated_at
    BEFORE UPDATE ON instructivo_classroom
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
