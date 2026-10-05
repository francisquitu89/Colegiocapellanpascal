-- Script alternativo para solucionar problemas con el bucket equipo-fundacion
-- EJECUTAR SOLO SI EL SCRIPT PRINCIPAL NO FUNCIONA

-- Opción 1: Recrear el bucket completamente
DELETE FROM storage.objects WHERE bucket_id = 'equipo-fundacion';
DELETE FROM storage.buckets WHERE id = 'equipo-fundacion';

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'equipo-fundacion', 
  'equipo-fundacion', 
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Eliminar todas las políticas del bucket
DROP POLICY IF EXISTS "Allow all operations on equipo-fundacion bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access on equipo-fundacion bucket" ON storage.objects;

-- Crear política super permisiva para autenticados
CREATE POLICY "Allow all operations on equipo-fundacion bucket"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'equipo-fundacion')
  WITH CHECK (bucket_id = 'equipo-fundacion');

-- Permitir lectura pública
CREATE POLICY "Allow public read access on equipo-fundacion bucket"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'equipo-fundacion');

-- Verificar resultado
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'equipo-fundacion';
