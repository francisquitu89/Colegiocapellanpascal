-- Create valores_matricula table
CREATE TABLE IF NOT EXISTS valores_matricula (
  id SERIAL PRIMARY KEY,
  matricula_incorporacion JSONB NOT NULL DEFAULT '{
    "hijo1": 75,
    "hijo2": 56.25,
    "hijo3": 37.5,
    "hijo4": 18.75,
    "hijo5": 0
  }'::jsonb,
  otros_cargos JSONB NOT NULL DEFAULT '{
    "matricula": 12,
    "cpp": 1.9,
    "caa": 0.2,
    "ayuda_mutua": 0.6,
    "seguro_escolaridad": "Cubre el pago de mensualidades del Colegio hasta IVº Medio o 6 años de universidad, en caso de fallecimiento, o invalidez 2/3, de los apoderados. Es obligatorio para los apoderados menores de 65 años. Cubre 100% al primer sostenedor y 50% al segundo sostenedor."
  }'::jsonb,
  colegiatura_anual JSONB NOT NULL DEFAULT '{
    "hijo1": 100,
    "hijo2": 98,
    "hijo3": 90,
    "hijo4": 60,
    "hijo5": 20,
    "hijo6": 0
  }'::jsonb,
  contacto JSONB NOT NULL DEFAULT '{
    "nombre": "Arantzazu Vicente Urcelay",
    "telefono": "227194306",
    "email": "administracion@ssccmanquehue.cl"
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default values
INSERT INTO valores_matricula (
  matricula_incorporacion,
  otros_cargos,
  colegiatura_anual,
  contacto
) VALUES (
  '{
    "hijo1": 75,
    "hijo2": 56.25,
    "hijo3": 37.5,
    "hijo4": 18.75,
    "hijo5": 0
  }'::jsonb,
  '{
    "matricula": 12,
    "cpp": 1.9,
    "caa": 0.2,
    "ayuda_mutua": 0.6,
    "seguro_escolaridad": "Cubre el pago de mensualidades del Colegio hasta IVº Medio o 6 años de universidad, en caso de fallecimiento, o invalidez 2/3, de los apoderados. Es obligatorio para los apoderados menores de 65 años. Cubre 100% al primer sostenedor y 50% al segundo sostenedor."
  }'::jsonb,
  '{
    "hijo1": 100,
    "hijo2": 98,
    "hijo3": 90,
    "hijo4": 60,
    "hijo5": 20,
    "hijo6": 0
  }'::jsonb,
  '{
    "nombre": "Arantzazu Vicente Urcelay",
    "telefono": "227194306",
    "email": "administracion@ssccmanquehue.cl"
  }'::jsonb
) ON CONFLICT DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE valores_matricula ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to valores_matricula"
  ON valores_matricula
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to update valores_matricula"
  ON valores_matricula
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert valores_matricula"
  ON valores_matricula
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at trigger (only if function doesn't exist)
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

DROP TRIGGER IF EXISTS update_valores_matricula_updated_at ON valores_matricula;

CREATE TRIGGER update_valores_matricula_updated_at
    BEFORE UPDATE ON valores_matricula
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
