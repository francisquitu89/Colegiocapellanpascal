-- Tabla para perfiles de miembros del equipo de fundación
CREATE TABLE IF NOT EXISTS equipo_fundacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cargo TEXT,
  curriculum TEXT,
  foto_url TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para ordenamiento
CREATE INDEX IF NOT EXISTS idx_equipo_fundacion_orden ON equipo_fundacion(orden);

-- Políticas RLS
ALTER TABLE equipo_fundacion ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Allow public read access on equipo_fundacion" ON equipo_fundacion;
DROP POLICY IF EXISTS "Allow authenticated users full access on equipo_fundacion" ON equipo_fundacion;

-- Permitir lectura pública
CREATE POLICY "Allow public read access on equipo_fundacion"
  ON equipo_fundacion
  FOR SELECT
  TO public
  USING (true);

-- Permitir todas las operaciones a usuarios autenticados
CREATE POLICY "Allow authenticated users full access on equipo_fundacion"
  ON equipo_fundacion
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
