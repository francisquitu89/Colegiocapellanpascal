-- EJECUTA ESTO DIRECTAMENTE EN EL SQL EDITOR DE SUPABASE
-- Paso 1: Eliminar tabla si existe (para empezar limpio)
DROP TABLE IF EXISTS valores_matricula CASCADE;

-- Paso 2: Crear la tabla
CREATE TABLE valores_matricula (
  id SERIAL PRIMARY KEY,
  matricula_incorporacion JSONB NOT NULL,
  otros_cargos JSONB NOT NULL,
  colegiatura_anual JSONB NOT NULL,
  contacto JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Paso 3: Insertar valores predeterminados
INSERT INTO valores_matricula (
  id,
  matricula_incorporacion,
  otros_cargos,
  colegiatura_anual,
  contacto
) VALUES (
  1,
  '{"hijo1": 75, "hijo2": 56.25, "hijo3": 37.5, "hijo4": 18.75, "hijo5": 0}'::jsonb,
  '{"matricula": 12, "cpp": 1.9, "caa": 0.2, "ayuda_mutua": 0.6, "seguro_escolaridad": "Cubre el pago de mensualidades del Colegio hasta IVº Medio o 6 años de universidad, en caso de fallecimiento, o invalidez 2/3, de los apoderados. Es obligatorio para los apoderados menores de 65 años. Cubre 100% al primer sostenedor y 50% al segundo sostenedor."}'::jsonb,
  '{"hijo1": 100, "hijo2": 98, "hijo3": 90, "hijo4": 60, "hijo5": 20, "hijo6": 0}'::jsonb,
  '{"nombre": "Arantzazu Vicente Urcelay", "telefono": "227194306", "email": "administracion@ssccmanquehue.cl"}'::jsonb
);

-- Paso 4: Habilitar RLS
ALTER TABLE valores_matricula ENABLE ROW LEVEL SECURITY;

-- Paso 5: Eliminar políticas existentes si hay
DROP POLICY IF EXISTS "Allow public read access to valores_matricula" ON valores_matricula;
DROP POLICY IF EXISTS "Allow authenticated users to update valores_matricula" ON valores_matricula;
DROP POLICY IF EXISTS "Allow authenticated users to insert valores_matricula" ON valores_matricula;
DROP POLICY IF EXISTS "Allow authenticated users to delete valores_matricula" ON valores_matricula;
DROP POLICY IF EXISTS "Allow anon to update valores_matricula" ON valores_matricula;
DROP POLICY IF EXISTS "Allow anon to insert valores_matricula" ON valores_matricula;

-- Paso 6: Crear políticas nuevas (más permisivas para testing)
CREATE POLICY "Allow public read access to valores_matricula"
  ON valores_matricula
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all to update valores_matricula"
  ON valores_matricula
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to insert valores_matricula"
  ON valores_matricula
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow all to delete valores_matricula"
  ON valores_matricula
  FOR DELETE
  TO public
  USING (true);

-- Paso 7: Crear trigger para updated_at (solo si la función no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column'
    ) THEN
        CREATE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW.updated_at = TIMEZONE('utc'::text, NOW());
            RETURN NEW;
        END;
        $func$ language 'plpgsql';
    END IF;
END $$;

-- Paso 8: Crear el trigger
DROP TRIGGER IF EXISTS update_valores_matricula_updated_at ON valores_matricula;

CREATE TRIGGER update_valores_matricula_updated_at
    BEFORE UPDATE ON valores_matricula
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar que todo se creó correctamente
SELECT * FROM valores_matricula;
