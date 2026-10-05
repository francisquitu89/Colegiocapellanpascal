-- Create table for Departamento de Orientación
CREATE TABLE IF NOT EXISTS departamento_orientacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cover_image_url TEXT,
  intro_text TEXT DEFAULT 'El equipo del Departamento de Orientación brinda asesoría técnica a los distintos estamentos del colegio, a fin de enriquecer la tarea formativa y pedagógica. Para ello se enfoca en los siguientes ámbitos: acompañamiento psicológico, orientación vocacional y fomento de la convivencia escolar.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for team members
CREATE TABLE IF NOT EXISTS orientacion_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orientacion_team_order ON orientacion_team_members(order_index);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_departamento_orientacion_updated_at ON departamento_orientacion;
CREATE TRIGGER update_departamento_orientacion_updated_at
    BEFORE UPDATE ON departamento_orientacion
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orientacion_team_members_updated_at ON orientacion_team_members;
CREATE TRIGGER update_orientacion_team_members_updated_at
    BEFORE UPDATE ON orientacion_team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE departamento_orientacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE orientacion_team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for departamento_orientacion
CREATE POLICY "Allow public read on departamento_orientacion"
  ON departamento_orientacion FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on departamento_orientacion"
  ON departamento_orientacion FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on departamento_orientacion"
  ON departamento_orientacion FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete on departamento_orientacion"
  ON departamento_orientacion FOR DELETE
  USING (true);

-- RLS Policies for orientacion_team_members
CREATE POLICY "Allow public read on orientacion_team_members"
  ON orientacion_team_members FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on orientacion_team_members"
  ON orientacion_team_members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on orientacion_team_members"
  ON orientacion_team_members FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete on orientacion_team_members"
  ON orientacion_team_members FOR DELETE
  USING (true);

-- Insert initial configuration
INSERT INTO departamento_orientacion (intro_text) VALUES 
('El equipo del Departamento de Orientación brinda asesoría técnica a los distintos estamentos del colegio, a fin de enriquecer la tarea formativa y pedagógica. Para ello se enfoca en los siguientes ámbitos: acompañamiento psicológico, orientación vocacional y fomento de la convivencia escolar.');

-- Insert initial team members
INSERT INTO orientacion_team_members (name, position, order_index) VALUES
('Maria Teresa Egaña', 'Psicopedagoga', 1),
('Daniela Schiavetti', 'Psicóloga, Jefe del departamento', 2),
('Daniela Fuentes', 'Coordinadora General de Convivencia Educativa', 3),
('Maria Cristina Prieto', 'Educadora diferencial', 4),
('Macarena Garrido', 'Psicopedagoga', 5),
('Andrea Luer', 'Psicóloga', 6);
