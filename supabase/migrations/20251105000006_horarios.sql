-- Create horarios table
CREATE TABLE IF NOT EXISTS horarios (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  year VARCHAR(10) NOT NULL,
  categoria VARCHAR(100) NOT NULL CHECK (categoria IN (
    'Horarios Primer Ciclo',
    'Horarios Segundo Ciclo',
    'Horarios Enseñanza Media Menor',
    'Horarios Educación Media Superior',
    'Horarios ACLEs'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create storage bucket for horarios files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('horarios-files', 'horarios-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public SELECT on horarios-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public INSERT on horarios-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public UPDATE on horarios-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public DELETE on horarios-files" ON storage.objects;

-- Create storage policies for public access
CREATE POLICY "Allow public SELECT on horarios-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'horarios-files');

CREATE POLICY "Allow public INSERT on horarios-files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'horarios-files');

CREATE POLICY "Allow public UPDATE on horarios-files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'horarios-files');

CREATE POLICY "Allow public DELETE on horarios-files"
ON storage.objects FOR DELETE
USING (bucket_id = 'horarios-files');

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_horarios_updated_at ON horarios;

CREATE TRIGGER update_horarios_updated_at
    BEFORE UPDATE ON horarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
