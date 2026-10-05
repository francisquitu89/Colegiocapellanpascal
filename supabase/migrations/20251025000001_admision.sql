-- Admisión Tables Migration
-- Tables for managing the Admisión section

-- Info Cards (3D flip cards)
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

-- Process Steps (horizontal timeline)
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

-- Contact Information
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

-- Disable RLS (using custom admin authentication)
ALTER TABLE admision_info_cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE admision_process_steps DISABLE ROW LEVEL SECURITY;
ALTER TABLE admision_contact DISABLE ROW LEVEL SECURITY;

-- Storage bucket for admision images
INSERT INTO storage.buckets (id, name, public)
VALUES ('admision-images', 'admision-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (public access) - Drop if exists and recreate
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Public Access for admision-images" ON storage.objects;
    DROP POLICY IF EXISTS "Public Insert for admision-images" ON storage.objects;
    DROP POLICY IF EXISTS "Public Update for admision-images" ON storage.objects;
    DROP POLICY IF EXISTS "Public Delete for admision-images" ON storage.objects;
    
    -- Create policies
    CREATE POLICY "Public Access for admision-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'admision-images');

    CREATE POLICY "Public Insert for admision-images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'admision-images');

    CREATE POLICY "Public Update for admision-images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'admision-images');

    CREATE POLICY "Public Delete for admision-images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'admision-images');
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Ignore errors if policies already exist
END $$;

-- Insert default info cards
INSERT INTO admision_info_cards (title, description, icon_name, color, image_url, order_index)
VALUES
  ('Proceso de Admisión', 'Conoce los pasos a seguir para postular al Colegio Sagrada Familia. Un proceso transparente y orientado a conocer a tu familia.', 'FileText', 'from-blue-600 to-blue-800', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop', 1),
  ('Proyecto Educativo', 'Formación integral basada en valores schoenstatianos. Educación de excelencia académica y humana para tus hijos.', 'Users', 'from-green-600 to-green-800', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop', 2),
  ('Comunidad Educativa', 'Únete a una comunidad comprometida con la formación integral. Familias que comparten valores y visión educativa.', 'CheckCircle', 'from-purple-600 to-purple-800', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop', 3)
ON CONFLICT DO NOTHING;

-- Insert default process steps
INSERT INTO admision_process_steps (step_number, step_label, title, description, icon_name, color, order_index)
VALUES
  (1, 'PASO 1', 'Conócenos', 'Revisa aquí los aspectos esenciales de nuestro proyecto educativo. Conoce nuestra misión, visión y valores que guían la formación de nuestros estudiantes.', 'FileText', 'bg-blue-600', 1),
  (2, 'PASO 2', 'Postula', 'Completa el formulario de postulación con los datos de tu familia. Adjunta la documentación requerida y envía tu solicitud.', 'FileText', 'bg-green-600', 2),
  (3, 'PASO 3', 'Entrevista padres y visita al colegio', 'Conoce nuestras instalaciones y conversa con nuestro equipo directivo. Esta instancia nos permite conocernos mutuamente.', 'Users', 'bg-teal-600', 3),
  (4, 'PASO 4', 'Evaluación de madurez (Prekinder)', 'Para estudiantes de prekinder, realizamos una evaluación de madurez escolar que nos permite conocer mejor a tu hijo/a.', 'CheckCircle', 'bg-emerald-600', 4),
  (5, 'PASO 5', 'Respuesta a la postulación', 'Te comunicaremos la decisión del proceso de admisión. Recibirás información detallada sobre los siguientes pasos.', 'Mail', 'bg-cyan-600', 5),
  (6, 'PASO 6', 'Incorporación', 'Bienvenido a la familia Sagrada Familia. Recibe toda la información necesaria para el inicio del año escolar.', 'Users', 'bg-indigo-600', 6)
ON CONFLICT DO NOTHING;

-- Insert default contact information
INSERT INTO admision_contact (name, role, email, phone, address, photo_url)
VALUES
  ('Jennifer Martínez', 'Encargada de Admisión', 'admision@sagradafamilia.cl', '(+569) 9884 9756', 'Colegio Sagrada Familia
Parcela 4, Los Pinos, Reñaca
Casilla 5104 – Correo Reñaca', 'https://i.postimg.cc/B6RMxtwm/1516855554215.jpg')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admision_info_cards_order ON admision_info_cards(order_index);
CREATE INDEX IF NOT EXISTS idx_admision_process_steps_order ON admision_process_steps(order_index);
