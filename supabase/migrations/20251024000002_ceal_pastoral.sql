-- Create table for CEAL members
CREATE TABLE IF NOT EXISTS ceal_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position TEXT NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  year INTEGER NOT NULL DEFAULT 2025,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for CEAL photos
CREATE TABLE IF NOT EXISTS ceal_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  photo_name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for Pastoral Juvenil core members
CREATE TABLE IF NOT EXISTS pastoral_core_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  year INTEGER NOT NULL DEFAULT 2025,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for Pastoral Juvenil teachers
CREATE TABLE IF NOT EXISTS pastoral_teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for Pastoral Juvenil photos
CREATE TABLE IF NOT EXISTS pastoral_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  photo_name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Disable Row Level Security for all tables
ALTER TABLE ceal_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE ceal_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE pastoral_core_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE pastoral_teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE pastoral_photos DISABLE ROW LEVEL SECURITY;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('ceal-photos', 'ceal-photos', true),
  ('pastoral-photos', 'pastoral-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "ceal_photos_public_access" ON storage.objects;
DROP POLICY IF EXISTS "ceal_photos_public_upload" ON storage.objects;
DROP POLICY IF EXISTS "ceal_photos_public_update" ON storage.objects;
DROP POLICY IF EXISTS "ceal_photos_public_delete" ON storage.objects;
DROP POLICY IF EXISTS "pastoral_photos_public_access" ON storage.objects;
DROP POLICY IF EXISTS "pastoral_photos_public_upload" ON storage.objects;
DROP POLICY IF EXISTS "pastoral_photos_public_update" ON storage.objects;
DROP POLICY IF EXISTS "pastoral_photos_public_delete" ON storage.objects;

-- Create storage policies for CEAL photos
CREATE POLICY "ceal_photos_public_access"
ON storage.objects FOR SELECT
USING (bucket_id = 'ceal-photos');

CREATE POLICY "ceal_photos_public_upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ceal-photos');

CREATE POLICY "ceal_photos_public_update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ceal-photos')
WITH CHECK (bucket_id = 'ceal-photos');

CREATE POLICY "ceal_photos_public_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'ceal-photos');

-- Create storage policies for Pastoral photos
CREATE POLICY "pastoral_photos_public_access"
ON storage.objects FOR SELECT
USING (bucket_id = 'pastoral-photos');

CREATE POLICY "pastoral_photos_public_upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pastoral-photos');

CREATE POLICY "pastoral_photos_public_update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pastoral-photos')
WITH CHECK (bucket_id = 'pastoral-photos');

CREATE POLICY "pastoral_photos_public_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'pastoral-photos');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ceal_members_order ON ceal_members(order_index);
CREATE INDEX IF NOT EXISTS idx_ceal_photos_order ON ceal_photos(order_index);
CREATE INDEX IF NOT EXISTS idx_pastoral_core_members_order ON pastoral_core_members(order_index);
CREATE INDEX IF NOT EXISTS idx_pastoral_teachers_order ON pastoral_teachers(order_index);
CREATE INDEX IF NOT EXISTS idx_pastoral_photos_order ON pastoral_photos(order_index);

-- Insert initial CEAL data
INSERT INTO ceal_members (position, name, order_index, year) VALUES
  ('Presidente', 'Clemente Chanique', 1, 2025),
  ('Vicepresidente', 'Juan Herrera', 2, 2025),
  ('Secretaria', 'Ignacia Fernandez', 3, 2025),
  ('Tesorero', 'Josefina Larraín', 4, 2025),
  ('Convivencia', 'Laura Young', 5, 2025),
  ('Cultura y medio ambiente', 'Josefa Gorigoitía', 6, 2025),
  ('Pastoral', 'Vicente Gasto', 7, 2025),
  ('Deportes', 'Tomás Dalmazzo', 8, 2025);

-- Insert initial Pastoral Juvenil data
INSERT INTO pastoral_core_members (name, order_index, year) VALUES
  ('Gorka Gorigoitia', 1, 2025),
  ('Nicolás Gutierrez', 2, 2025),
  ('Juan Ignacio Serrano', 3, 2025),
  ('Magdalena Brieba', 4, 2025),
  ('María Simonetti', 5, 2025),
  ('Lucía Santamarina', 6, 2025);

INSERT INTO pastoral_teachers (name, order_index) VALUES
  ('Manuel Núñez', 1);
