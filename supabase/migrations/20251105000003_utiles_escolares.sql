-- Útiles Escolares - Documentos por Nivel
-- Migration to add utiles escolares table and storage bucket

-- Create utiles_escolares table
CREATE TABLE IF NOT EXISTS utiles_escolares (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  year TEXT NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('Pre-Escolar', 'Básica', 'Media')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE utiles_escolares DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_utiles_escolares_year ON utiles_escolares(year DESC);
CREATE INDEX IF NOT EXISTS idx_utiles_escolares_nivel ON utiles_escolares(nivel);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_utiles_escolares_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_utiles_escolares_timestamp ON utiles_escolares;

CREATE TRIGGER update_utiles_escolares_timestamp 
BEFORE UPDATE ON utiles_escolares
FOR EACH ROW 
EXECUTE FUNCTION update_utiles_escolares_updated_at();

-- Create storage bucket for utiles escolares files
INSERT INTO storage.buckets (id, name, public)
VALUES ('utiles-escolares-files', 'utiles-escolares-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies - Allow all operations
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public can view utiles files" ON storage.objects;
  DROP POLICY IF EXISTS "Public can upload utiles files" ON storage.objects;
  DROP POLICY IF EXISTS "Public can update utiles files" ON storage.objects;
  DROP POLICY IF EXISTS "Public can delete utiles files" ON storage.objects;
END $$;

-- Create new policies that allow all operations
CREATE POLICY "Public can view utiles files"
ON storage.objects FOR SELECT
USING (bucket_id = 'utiles-escolares-files');

CREATE POLICY "Public can upload utiles files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'utiles-escolares-files');

CREATE POLICY "Public can update utiles files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'utiles-escolares-files');

CREATE POLICY "Public can delete utiles files"
ON storage.objects FOR DELETE
USING (bucket_id = 'utiles-escolares-files');

-- Insert sample data (optional)
INSERT INTO utiles_escolares (title, file_url, year, nivel)
VALUES 
  ('Lista de Útiles Pre-Kínder 2025', 'https://ejemplo.com/utiles-prekinder-2025.pdf', '2025', 'Pre-Escolar'),
  ('Lista de Útiles 1° Básico 2025', 'https://ejemplo.com/utiles-1basico-2025.pdf', '2025', 'Básica'),
  ('Lista de Útiles I° Medio 2025', 'https://ejemplo.com/utiles-1medio-2025.pdf', '2025', 'Media')
ON CONFLICT DO NOTHING;
