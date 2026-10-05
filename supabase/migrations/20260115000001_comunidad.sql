-- Crear tablas para la sección de Comunidad

-- Tabla de bloques de comunidad (5 bloques)
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

-- Tabla de fotos para carruseles de cada bloque
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

-- Tabla de integrantes por bloque (opcional)
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

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_comunidad_bloques_numero ON comunidad_bloques(bloque_numero);
CREATE INDEX IF NOT EXISTS idx_comunidad_bloques_activo ON comunidad_bloques(activo);
CREATE INDEX IF NOT EXISTS idx_comunidad_fotos_bloque ON comunidad_fotos(bloque_id);
CREATE INDEX IF NOT EXISTS idx_comunidad_fotos_order ON comunidad_fotos(bloque_id, order_index);
CREATE INDEX IF NOT EXISTS idx_comunidad_integrantes_bloque ON comunidad_integrantes(bloque_id);
CREATE INDEX IF NOT EXISTS idx_comunidad_integrantes_order ON comunidad_integrantes(bloque_id, order_index);

-- Insertar los 5 bloques iniciales
INSERT INTO comunidad_bloques (bloque_numero, titulo, descripcion, boton_texto, order_index) VALUES
  (1, 'Centro de Padres', 'Organización que representa a los apoderados del colegio', 'Ver más', 1),
  (2, 'Pastoral Familiar', 'Acompañamiento espiritual para las familias', 'Ver más', 2),
  (3, 'Voluntariado', 'Iniciativas de servicio y compromiso social', 'Ver más', 3),
  (4, 'Ex Alumnos', 'Red de egresados del colegio', 'Ver más', 4),
  (5, 'Grupos Comunitarios', 'Espacios de encuentro y formación', 'Ver más', 5)
ON CONFLICT (bloque_numero) DO NOTHING;

-- Configurar Storage bucket para fotos de comunidad
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'comunidad-fotos',
  'comunidad-fotos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para comunidad-fotos
DROP POLICY IF EXISTS "Allow public read access on comunidad-fotos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload comunidad-fotos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update comunidad-fotos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete comunidad-fotos" ON storage.objects;

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

-- Políticas RLS para las tablas
ALTER TABLE comunidad_bloques ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad_integrantes ENABLE ROW LEVEL SECURITY;

-- Políticas para comunidad_bloques
DROP POLICY IF EXISTS "Allow public read access to comunidad_bloques" ON comunidad_bloques;
DROP POLICY IF EXISTS "Allow authenticated users to insert comunidad_bloques" ON comunidad_bloques;
DROP POLICY IF EXISTS "Allow authenticated users to update comunidad_bloques" ON comunidad_bloques;
DROP POLICY IF EXISTS "Allow authenticated users to delete comunidad_bloques" ON comunidad_bloques;

CREATE POLICY "Allow public read access to comunidad_bloques"
  ON comunidad_bloques FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert comunidad_bloques"
  ON comunidad_bloques FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update comunidad_bloques"
  ON comunidad_bloques FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete comunidad_bloques"
  ON comunidad_bloques FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para comunidad_fotos
DROP POLICY IF EXISTS "Allow public read access to comunidad_fotos" ON comunidad_fotos;
DROP POLICY IF EXISTS "Allow authenticated users to insert comunidad_fotos" ON comunidad_fotos;
DROP POLICY IF EXISTS "Allow authenticated users to update comunidad_fotos" ON comunidad_fotos;
DROP POLICY IF EXISTS "Allow authenticated users to delete comunidad_fotos" ON comunidad_fotos;

CREATE POLICY "Allow public read access to comunidad_fotos"
  ON comunidad_fotos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert comunidad_fotos"
  ON comunidad_fotos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update comunidad_fotos"
  ON comunidad_fotos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete comunidad_fotos"
  ON comunidad_fotos FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para comunidad_integrantes
DROP POLICY IF EXISTS "Allow public read access to comunidad_integrantes" ON comunidad_integrantes;
DROP POLICY IF EXISTS "Allow authenticated users to insert comunidad_integrantes" ON comunidad_integrantes;
DROP POLICY IF EXISTS "Allow authenticated users to update comunidad_integrantes" ON comunidad_integrantes;
DROP POLICY IF EXISTS "Allow authenticated users to delete comunidad_integrantes" ON comunidad_integrantes;

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

-- Storage bucket para fotos de integrantes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'comunidad-integrantes',
  'comunidad-integrantes',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para comunidad-integrantes
DROP POLICY IF EXISTS "Allow public read access on comunidad-integrantes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload comunidad-integrantes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update comunidad-integrantes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete comunidad-integrantes" ON storage.objects;

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
