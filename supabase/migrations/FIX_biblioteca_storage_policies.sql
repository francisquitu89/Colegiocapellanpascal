-- FIX: Corregir políticas de storage para biblioteca-files
-- Ejecuta este script si ya corriste la migración anterior y tienes el error de RLS

-- Paso 1: Asegúrate de que la tabla existe
CREATE TABLE IF NOT EXISTS planes_lectores (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS on table
ALTER TABLE planes_lectores DISABLE ROW LEVEL SECURITY;

-- Paso 2: Crear o actualizar el trigger
CREATE OR REPLACE FUNCTION update_planes_lectores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_planes_lectores_timestamp ON planes_lectores;

CREATE TRIGGER update_planes_lectores_timestamp 
BEFORE UPDATE ON planes_lectores
FOR EACH ROW 
EXECUTE FUNCTION update_planes_lectores_updated_at();

-- Paso 3: Asegúrate de que el bucket existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('biblioteca-files', 'biblioteca-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Paso 4: Elimina todas las políticas existentes
DROP POLICY IF EXISTS "Public can view biblioteca files" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload biblioteca files" ON storage.objects;
DROP POLICY IF EXISTS "Public can update biblioteca files" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete biblioteca files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload biblioteca files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update biblioteca files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete biblioteca files" ON storage.objects;

-- Paso 5: Crea nuevas políticas que permitan todas las operaciones
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
