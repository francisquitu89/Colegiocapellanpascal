-- Update valores_matricula table structure
-- Drop existing table
DROP TABLE IF EXISTS valores_matricula CASCADE;

-- Create new table structure
CREATE TABLE valores_matricula (
  id SERIAL PRIMARY KEY,
  -- Porcentaje de pago de la matrícula de incorporación para hermanos
  matricula_hermanos JSONB NOT NULL DEFAULT '{
    "hijo2": {"porcentaje": 75, "uf": 56.25},
    "hijo3": {"porcentaje": 50, "uf": 37.5},
    "hijo4": {"porcentaje": 25, "uf": 18.75},
    "hijo5_mas": {"porcentaje": 0, "uf": 0}
  }'::jsonb,
  -- Otros cargos detallados
  otros_cargos JSONB NOT NULL DEFAULT '{
    "matricula_2026": {"valor": 13, "unidad": "por hijo"},
    "seguro_vida_iv_medio": {"valor": 0.5994, "unidad": "por cada hijo/a", "descripcion": "Seguro de vida y escolaridad hasta IV Medio (sept. 2025 a feb. 2026, valor proporcional)"},
    "seguro_vida_superior": {"valor": 1.1247, "unidad": "por hijo/a", "descripcion": "Seguro de vida y escolaridad hasta Educación Superior"},
    "cuota_centro_padres": {"valor": 1.9, "unidad": "por Familia"},
    "acciona": {"valor": 0.6, "unidad": "por Familia", "descripcion": "ex Fundación de Ayuda Mutua"},
    "cuota_centro_alumnos": {"valor": 0.2, "unidad": "por Familia"},
    "aporte_exalumnos": {"valor": "Voluntario", "unidad": "", "descripcion": "Aporte voluntario Asociación de Exalumnos"}
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default values
INSERT INTO valores_matricula (
  matricula_hermanos,
  otros_cargos
) VALUES (
  '{
    "hijo2": {"porcentaje": 75, "uf": 56.25},
    "hijo3": {"porcentaje": 50, "uf": 37.5},
    "hijo4": {"porcentaje": 25, "uf": 18.75},
    "hijo5_mas": {"porcentaje": 0, "uf": 0}
  }'::jsonb,
  '{
    "matricula_2026": {"valor": 13, "unidad": "por hijo"},
    "seguro_vida_iv_medio": {"valor": 0.5994, "unidad": "por cada hijo/a", "descripcion": "Seguro de vida y escolaridad hasta IV Medio (sept. 2025 a feb. 2026, valor proporcional)"},
    "seguro_vida_superior": {"valor": 1.1247, "unidad": "por hijo/a", "descripcion": "Seguro de vida y escolaridad hasta Educación Superior"},
    "cuota_centro_padres": {"valor": 1.9, "unidad": "por Familia"},
    "acciona": {"valor": 0.6, "unidad": "por Familia", "descripcion": "ex Fundación de Ayuda Mutua"},
    "cuota_centro_alumnos": {"valor": 0.2, "unidad": "por Familia"},
    "aporte_exalumnos": {"valor": "Voluntario", "unidad": "", "descripcion": "Aporte voluntario Asociación de Exalumnos"}
  }'::jsonb
);

-- Enable RLS (Row Level Security)
ALTER TABLE valores_matricula ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_valores_matricula_updated_at ON valores_matricula;

CREATE TRIGGER update_valores_matricula_updated_at
    BEFORE UPDATE ON valores_matricula
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
