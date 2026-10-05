-- Tabla para perfiles de miembros del Consejo Directivo
CREATE TABLE IF NOT EXISTS equipo_consejo_directivo (
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
CREATE INDEX IF NOT EXISTS idx_equipo_consejo_directivo_orden ON equipo_consejo_directivo(orden);

-- Deshabilitar RLS para evitar problemas
ALTER TABLE equipo_consejo_directivo DISABLE ROW LEVEL SECURITY;
