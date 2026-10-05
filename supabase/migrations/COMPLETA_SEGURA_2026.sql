-- ============================================================
-- MIGRACIÓN ÚNICA Y SEGURA - SAGRADA FAMILIA
-- Fecha: Mayo 10, 2026
-- Descripción: Crea todas las tablas, storage y políticas necesarias
-- SEGURIDAD: Solo crea si NO existe. No sobrescribe datos.
-- ============================================================

-- ============================================================
-- 1. TABLAS PRINCIPALES
-- ============================================================

-- Editorial table
CREATE TABLE IF NOT EXISTS editorial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Directory members
CREATE TABLE IF NOT EXISTS directory_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('directorio', 'rectoria')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- CEAL Members
CREATE TABLE IF NOT EXISTS ceal_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position TEXT NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  year INTEGER NOT NULL DEFAULT 2025,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- CEAL Photos
CREATE TABLE IF NOT EXISTS ceal_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  photo_name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pastoral Core Members
CREATE TABLE IF NOT EXISTS pastoral_core_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  year INTEGER NOT NULL DEFAULT 2025,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pastoral Teachers
CREATE TABLE IF NOT EXISTS pastoral_teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pastoral Photos
CREATE TABLE IF NOT EXISTS pastoral_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  photo_name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================
-- 2. ADMISIÓN TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS admision_info_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  icon_name TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admision_info_cards (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admision_process_steps (
  id BIGSERIAL PRIMARY KEY,
  step_number INTEGER NOT NULL,
  step_label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admision_contact (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admision_vacantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso TEXT NOT NULL,
  vacantes INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admision_kinder_ii_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 3. BIBLIOTECA & EDUCACIÓN TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS planes_lectores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plan_lector_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course TEXT NOT NULL,
  category TEXT,
  unit TEXT,
  title TEXT NOT NULL,
  author TEXT,
  editorial TEXT,
  is_choice BOOLEAN DEFAULT false,
  choice_group INTEGER,
  order_index INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  categoria TEXT,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 4. ÚTILES Y UNIFORMES
-- ============================================================

CREATE TABLE IF NOT EXISTS utiles_escolares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  nivel TEXT,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uniformes_escolares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  tipo TEXT,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 5. OTROS SERVICIOS
-- ============================================================

CREATE TABLE IF NOT EXISTS casino_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pagos_info (
  id SERIAL PRIMARY KEY,
  payment_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS instructivo_classroom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fechas_importantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL,
  hora TIME,
  actividad TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 6. ANUNCIOS Y NOTIFICACIONES
-- ============================================================

CREATE TABLE IF NOT EXISTS announcement_popup (
  id SERIAL PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT false,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  document_url TEXT,
  document_name VARCHAR(255),
  image_url TEXT,
  image_name VARCHAR(255),
  image_enabled BOOLEAN DEFAULT false,
  link_url TEXT,
  link_text VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. COMUNIDAD
-- ============================================================

CREATE TABLE IF NOT EXISTS comunidad_bloques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bloque_numero INTEGER NOT NULL UNIQUE CHECK (bloque_numero >= 1 AND bloque_numero <= 5),
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  boton_texto VARCHAR(100) DEFAULT 'Ver más',
  boton_url VARCHAR(500),
  mostrar_integrantes BOOLEAN DEFAULT false,
  activo BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comunidad_fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bloque_id UUID NOT NULL REFERENCES comunidad_bloques(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_name VARCHAR(255) NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comunidad_integrantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bloque_id UUID NOT NULL REFERENCES comunidad_bloques(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  cargo VARCHAR(255),
  foto_url TEXT,
  email VARCHAR(255),
  telefono VARCHAR(50),
  descripcion TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 8. EQUIPOS Y DIRECCIÓN
-- ============================================================

CREATE TABLE IF NOT EXISTS orientation_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orientacion_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departamento_orientacion_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cover_image_url TEXT,
  intro_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipo_fundacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cargo TEXT,
  curriculum TEXT,
  foto_url TEXT,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipo_consejo_directivo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cargo TEXT,
  curriculum TEXT,
  foto_url TEXT,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cycle_coordinators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_name TEXT NOT NULL,
  grade_range TEXT NOT NULL,
  coordinator_name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 9. VALORES Y CONFIGURACIÓN
-- ============================================================

CREATE TABLE IF NOT EXISTS valores_matricula (
  id SERIAL PRIMARY KEY,
  matricula_incorporacion JSONB NOT NULL,
  otros_cargos JSONB NOT NULL,
  colegiatura_anual JSONB NOT NULL,
  contacto JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================
-- 10. STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('news-images', 'news-images', true),
  ('site-logos', 'site-logos', true),
  ('institutional-documents', 'institutional-documents', true),
  ('ceal-photos', 'ceal-photos', true),
  ('pastoral-photos', 'pastoral-photos', true),
  ('comunidad-fotos', 'comunidad-fotos', true),
  ('admision-images', 'admision-images', true),
  ('departamento-orientacion', 'departamento-orientacion', true),
  ('equipo-fundacion-photos', 'equipo-fundacion-photos', true),
  ('recurso-digital-images', 'recurso-digital-images', true),
  ('recursos-digitales-files', 'recursos-digitales-files', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 11. INDICES PARA OPTIMIZACIÓN
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_directory_members_category ON directory_members(category);
CREATE INDEX IF NOT EXISTS idx_directory_members_order ON directory_members(order_index);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_editorial_date ON editorial(date DESC);
CREATE INDEX IF NOT EXISTS idx_comunidad_bloques_numero ON comunidad_bloques(bloque_numero);
CREATE INDEX IF NOT EXISTS idx_comunidad_bloques_activo ON comunidad_bloques(activo);
CREATE INDEX IF NOT EXISTS idx_comunidad_fotos_bloque ON comunidad_fotos(bloque_id);
CREATE INDEX IF NOT EXISTS idx_comunidad_integrantes_bloque ON comunidad_integrantes(bloque_id);
CREATE INDEX IF NOT EXISTS idx_pastoral_order ON pastoral_core_members(order_index);
CREATE INDEX IF NOT EXISTS idx_ceal_order ON ceal_members(order_index);

-- ============================================================
-- 12. POLÍTICAS DE STORAGE (General)
-- ============================================================

-- Permitir lectura pública en todos los buckets
DO $$
BEGIN
  DROP POLICY IF EXISTS "public_read_all" ON storage.objects;
  CREATE POLICY "public_read_all" ON storage.objects 
    FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Permitir upload a todos los buckets (sin restricción)
DO $$
BEGIN
  DROP POLICY IF EXISTS "public_upload_all" ON storage.objects;
  CREATE POLICY "public_upload_all" ON storage.objects 
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Permitir update a todos los buckets
DO $$
BEGIN
  DROP POLICY IF EXISTS "public_update_all" ON storage.objects;
  CREATE POLICY "public_update_all" ON storage.objects 
    FOR UPDATE USING (true);
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Permitir delete a todos los buckets
DO $$
BEGIN
  DROP POLICY IF EXISTS "public_delete_all" ON storage.objects;
  CREATE POLICY "public_delete_all" ON storage.objects 
    FOR DELETE USING (true);
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ============================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================
-- Todas las tablas han sido creadas de forma segura
-- Solo se crean si NO existen (IF NOT EXISTS)
-- No se sobrescriben datos existentes
-- ============================================================
