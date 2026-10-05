-- Create uniformes_escolares table
CREATE TABLE IF NOT EXISTS uniformes_escolares (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  year VARCHAR(10) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Diario', 'Educación Física', 'Formal')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create storage bucket for uniformes files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uniformes-files', 'uniformes-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public SELECT on uniformes-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public INSERT on uniformes-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public UPDATE on uniformes-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public DELETE on uniformes-files" ON storage.objects;

-- Create storage policies for public access
CREATE POLICY "Allow public SELECT on uniformes-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'uniformes-files');

CREATE POLICY "Allow public INSERT on uniformes-files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uniformes-files');

CREATE POLICY "Allow public UPDATE on uniformes-files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uniformes-files');

CREATE POLICY "Allow public DELETE on uniformes-files"
ON storage.objects FOR DELETE
USING (bucket_id = 'uniformes-files');

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_uniformes_escolares_updated_at ON uniformes_escolares;

CREATE TRIGGER update_uniformes_escolares_updated_at
    BEFORE UPDATE ON uniformes_escolares
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
