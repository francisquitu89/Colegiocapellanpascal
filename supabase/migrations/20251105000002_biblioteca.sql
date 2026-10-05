-- Biblioteca - Planes Lectores
-- Migration to add biblioteca planes lectores table and storage bucket

-- Create planes_lectores table
CREATE TABLE IF NOT EXISTS planes_lectores (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE planes_lectores DISABLE ROW LEVEL SECURITY;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_planes_lectores_year ON planes_lectores(year DESC);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_planes_lectores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS update_planes_lectores_timestamp ON planes_lectores;

CREATE TRIGGER update_planes_lectores_timestamp 
BEFORE UPDATE ON planes_lectores
FOR EACH ROW 
EXECUTE FUNCTION update_planes_lectores_updated_at();

-- Create storage bucket for biblioteca files
INSERT INTO storage.buckets (id, name, public)
VALUES ('biblioteca-files', 'biblioteca-files', true)
ON CONFLICT (id) DO NOTHING;

-- Disable RLS on storage bucket
UPDATE storage.buckets 
SET public = true
WHERE id = 'biblioteca-files';

-- Storage policies - Allow all operations without authentication for simplicity
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public can view biblioteca files" ON storage.objects;
  DROP POLICY IF EXISTS "Public can upload biblioteca files" ON storage.objects;
  DROP POLICY IF EXISTS "Public can update biblioteca files" ON storage.objects;
  DROP POLICY IF EXISTS "Public can delete biblioteca files" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload biblioteca files" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update biblioteca files" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete biblioteca files" ON storage.objects;
END $$;

-- Create new policies that allow all operations
CREATE POLICY "Public can view biblioteca files"
ON storage.objects FOR SELECT
USING (bucket_id = 'biblioteca-files');

CREATE POLICY "Public can upload biblioteca files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'biblioteca-files');

CREATE POLICY "Public can update biblioteca files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'biblioteca-files');

CREATE POLICY "Public can delete biblioteca files"
ON storage.objects FOR DELETE
USING (bucket_id = 'biblioteca-files');

-- Insert sample data (optional)
INSERT INTO planes_lectores (title, file_url, year)
VALUES 
  ('Plan Lector 2025', 'https://ejemplo.com/plan-lector-2025.pdf', '2025')
ON CONFLICT DO NOTHING;
