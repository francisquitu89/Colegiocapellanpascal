-- Arreglar políticas RLS de equipo_fundacion
-- Opción 1: Deshabilitar RLS completamente (más simple)
ALTER TABLE equipo_fundacion DISABLE ROW LEVEL SECURITY;

-- Si prefieres mantener RLS activo, comenta la línea de arriba y descomenta estas:
/*
-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Allow public read access on equipo_fundacion" ON equipo_fundacion;
DROP POLICY IF EXISTS "Allow authenticated users full access on equipo_fundacion" ON equipo_fundacion;
DROP POLICY IF EXISTS "Allow all operations on equipo_fundacion" ON equipo_fundacion;

-- Crear política super permisiva que permita TODO a TODOS
CREATE POLICY "Allow all operations on equipo_fundacion"
  ON equipo_fundacion
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
*/
