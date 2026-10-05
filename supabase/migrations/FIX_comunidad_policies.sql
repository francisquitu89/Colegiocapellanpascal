-- Script para corregir políticas de seguridad de Comunidad
-- EJECUTAR ESTE SCRIPT COMPLETO EN SUPABASE SQL EDITOR

-- ===== DESHABILITAR RLS TEMPORALMENTE =====
ALTER TABLE comunidad_bloques DISABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad_fotos DISABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad_integrantes DISABLE ROW LEVEL SECURITY;

-- ===== ELIMINAR TODAS LAS POLÍTICAS ANTIGUAS =====
DROP POLICY IF EXISTS "Allow public read access to comunidad_bloques" ON comunidad_bloques;
DROP POLICY IF EXISTS "Allow authenticated users to insert comunidad_bloques" ON comunidad_bloques;
DROP POLICY IF EXISTS "Allow authenticated users to update comunidad_bloques" ON comunidad_bloques;
DROP POLICY IF EXISTS "Allow authenticated users to delete comunidad_bloques" ON comunidad_bloques;
DROP POLICY IF EXISTS "Allow authenticated users to manage comunidad_bloques" ON comunidad_bloques;

DROP POLICY IF EXISTS "Allow public read access to comunidad_fotos" ON comunidad_fotos;
DROP POLICY IF EXISTS "Allow authenticated users to insert comunidad_fotos" ON comunidad_fotos;
DROP POLICY IF EXISTS "Allow authenticated users to update comunidad_fotos" ON comunidad_fotos;
DROP POLICY IF EXISTS "Allow authenticated users to delete comunidad_fotos" ON comunidad_fotos;
DROP POLICY IF EXISTS "Allow authenticated users to manage comunidad_fotos" ON comunidad_fotos;

DROP POLICY IF EXISTS "Allow public read access to comunidad_integrantes" ON comunidad_integrantes;
DROP POLICY IF EXISTS "Allow authenticated users to insert comunidad_integrantes" ON comunidad_integrantes;
DROP POLICY IF EXISTS "Allow authenticated users to update comunidad_integrantes" ON comunidad_integrantes;
DROP POLICY IF EXISTS "Allow authenticated users to delete comunidad_integrantes" ON comunidad_integrantes;
DROP POLICY IF EXISTS "Allow authenticated users to manage comunidad_integrantes" ON comunidad_integrantes;

-- ===== HABILITAR RLS DE NUEVO =====
ALTER TABLE comunidad_bloques ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad_integrantes ENABLE ROW LEVEL SECURITY;

-- ===== CREAR POLÍTICAS NUEVAS Y PERMISIVAS =====

-- comunidad_bloques
CREATE POLICY "Allow all access to comunidad_bloques"
  ON comunidad_bloques
  USING (true)
  WITH CHECK (true);

-- comunidad_fotos
CREATE POLICY "Allow all access to comunidad_fotos"
  ON comunidad_fotos
  USING (true)
  WITH CHECK (true);

-- comunidad_integrantes
CREATE POLICY "Allow all access to comunidad_integrantes"
  ON comunidad_integrantes
  USING (true)
  WITH CHECK (true);

-- ===== STORAGE comunidad-fotos =====
-- Eliminar políticas existentes del bucket
DROP POLICY IF EXISTS "Allow public read access on comunidad-fotos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload comunidad-fotos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update comunidad-fotos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete comunidad-fotos" ON storage.objects;

-- Crear políticas nuevas para el storage
CREATE POLICY "Allow public read access on comunidad-fotos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'comunidad-fotos');

CREATE POLICY "Allow authenticated users to upload comunidad-fotos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'comunidad-fotos');

CREATE POLICY "Allow authenticated users to update comunidad-fotos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'comunidad-fotos')
  WITH CHECK (bucket_id = 'comunidad-fotos');

CREATE POLICY "Allow authenticated users to delete comunidad-fotos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'comunidad-fotos');

-- ===== TABLA comunidad_integrantes =====
-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Allow public read access to comunidad_integrantes" ON comunidad_integrantes;
DROP POLICY IF EXISTS "Allow authenticated users to insert comunidad_integrantes" ON comunidad_integrantes;
DROP POLICY IF EXISTS "Allow authenticated users to update comunidad_integrantes" ON comunidad_integrantes;
DROP POLICY IF EXISTS "Allow authenticated users to delete comunidad_integrantes" ON comunidad_integrantes;
DROP POLICY IF EXISTS "Allow authenticated users to manage comunidad_integrantes" ON comunidad_integrantes;

-- Crear políticas nuevas
CREATE POLICY "Allow public read access to comunidad_integrantes"
  ON comunidad_integrantes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert comunidad_integrantes"
  ON comunidad_integrantes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update comunidad_integrantes"
  ON comunidad_integrantes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete comunidad_integrantes"
  ON comunidad_integrantes FOR DELETE
  TO authenticated
  USING (true);

-- ===== STORAGE comunidad-integrantes =====
-- Eliminar políticas existentes del bucket
DROP POLICY IF EXISTS "Allow public read access on comunidad-integrantes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload comunidad-integrantes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update comunidad-integrantes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete comunidad-integrantes" ON storage.objects;

-- Crear políticas nuevas para el storage
CREATE POLICY "Allow public read access on comunidad-integrantes"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'comunidad-integrantes');

CREATE POLICY "Allow authenticated users to upload comunidad-integrantes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'comunidad-integrantes');

CREATE POLICY "Allow authenticated users to update comunidad-integrantes"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'comunidad-integrantes')
  WITH CHECK (bucket_id = 'comunidad-integrantes');

CREATE POLICY "Allow authenticated users to delete comunidad-integrantes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'comunidad-integrantes');

-- ===== VERIFICACIÓN =====
-- Verificar que las tablas tengan RLS habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('comunidad_bloques', 'comunidad_fotos', 'comunidad_integrantes');

-- Verificar políticas creadas
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename IN ('comunidad_bloques', 'comunidad_fotos', 'comunidad_integrantes')
ORDER BY tablename, policyname;

-- Verificar políticas de storage
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%comunidad%';
