-- Create table for department heads (Jefes de Departamentos)
CREATE TABLE IF NOT EXISTS department_heads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department TEXT NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for orientation team members (Equipo de Orientación)
CREATE TABLE IF NOT EXISTS orientation_team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for cycle coordinators (Coordinadores de Ciclo)
CREATE TABLE IF NOT EXISTS cycle_coordinators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_name TEXT NOT NULL,
  grade_range TEXT NOT NULL,
  coordinator_name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for pastoral team members (Equipo Pastoral)
CREATE TABLE IF NOT EXISTS pastoral_team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE department_heads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orientation_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_coordinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE pastoral_team ENABLE ROW LEVEL SECURITY;

-- Create policies for department_heads
CREATE POLICY "Enable read access for all users" ON department_heads
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON department_heads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON department_heads
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON department_heads
  FOR DELETE USING (true);

-- Create policies for orientation_team
CREATE POLICY "Enable read access for all users" ON orientation_team
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON orientation_team
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON orientation_team
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON orientation_team
  FOR DELETE USING (true);

-- Create policies for cycle_coordinators
CREATE POLICY "Enable read access for all users" ON cycle_coordinators
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON cycle_coordinators
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON cycle_coordinators
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON cycle_coordinators
  FOR DELETE USING (true);

-- Create policies for pastoral_team
CREATE POLICY "Enable read access for all users" ON pastoral_team
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON pastoral_team
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON pastoral_team
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON pastoral_team
  FOR DELETE USING (true);

-- Insert initial data for department heads
INSERT INTO department_heads (department, name, order_index) VALUES
  ('Matemática', 'Néstor Álvarez', 1),
  ('Lenguaje', 'Gonzalo Sanhueza', 2),
  ('Historia', 'Daniela Varas', 3),
  ('Ciencias', 'Lilian Ponce', 4),
  ('Inglés', 'Pamela Díaz', 5),
  ('Arte', 'Ángela Quezada', 6),
  ('Ed. Física y Deportes', 'Eduardo Martínez', 7),
  ('Religión y Filosofía', 'Ricardo Ramírez', 8);

-- Insert initial data for orientation team
INSERT INTO orientation_team (name, position, order_index) VALUES
  ('Maria Teresa Egaña', 'Psicopedagoga', 1),
  ('Daniela Schiavetti', 'Psicóloga, Jefe del departamento', 2),
  ('Daniela Fuentes', 'Coordinadora General de Convivencia Educativa', 3),
  ('Maria Cristina Prieto', 'Educadora diferencial', 4),
  ('Macarena Garrido', 'Psicopedagoga', 5),
  ('Andrea Luer', 'Psicóloga', 6);

-- Insert initial data for cycle coordinators
INSERT INTO cycle_coordinators (cycle_name, grade_range, coordinator_name, order_index) VALUES
  ('Ciclo Inicial', 'Medio mayor a Kínder', 'Loreto Alonso', 1),
  ('1er Ciclo Básico', '1º a 3º Básico', 'Aída Martínez', 2),
  ('2º Ciclo Básico', '4º a 6º Básico', 'Maddalena Muzio', 3),
  ('Ciclo E. Media Menor', '7º Básico a IIº Medio', 'Silvana Markusovic', 4),
  ('Ciclo E. Media Superior', 'IIIº a IVº Medio', 'Christian Fernández', 5);

-- Insert initial data for pastoral team
INSERT INTO pastoral_team (name, order_index) VALUES
  ('Padre Víctor Perez', 1),
  ('Benjamín Rodríguez', 2),
  ('Manuel Núñez', 3),
  ('Padre Joaquín Puertas', 4),
  ('Pilar Fuentes', 5),
  ('Aida Martínez', 6),
  ('Catalina Rodríguez', 7),
  ('Loreto Alonso', 8);
