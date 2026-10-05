-- Admisión - Vacantes y Secciones de Información Autogestionables
-- Migration to add vacancy table and editable information sections

-- Vacantes por curso (manageable table)
CREATE TABLE IF NOT EXISTS admision_vacantes (
  id BIGSERIAL PRIMARY KEY,
  curso TEXT NOT NULL,
  vacantes INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fecha de actualización de vacantes
CREATE TABLE IF NOT EXISTS admision_vacantes_fecha (
  id BIGSERIAL PRIMARY KEY,
  fecha_actualizacion TEXT NOT NULL DEFAULT 'Actualizadas al 15 de octubre',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Secciones de información editables (reemplaza las hardcodeadas)
CREATE TABLE IF NOT EXISTS admision_info_sections (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE admision_vacantes DISABLE ROW LEVEL SECURITY;
ALTER TABLE admision_vacantes_fecha DISABLE ROW LEVEL SECURITY;
ALTER TABLE admision_info_sections DISABLE ROW LEVEL SECURITY;

-- Insert default vacantes data
INSERT INTO admision_vacantes (curso, vacantes, order_index)
VALUES
  ('Playgroup', 0, 1),
  ('Prekínder', 0, 2),
  ('Kínder', 0, 3),
  ('1° básico', 0, 4),
  ('2° básico', 1, 5),
  ('3° básico', 0, 6),
  ('4° básico', 1, 7),
  ('5° básico', 0, 8),
  ('6° básico', 1, 9),
  ('7° básico', 1, 10),
  ('8° básico', 5, 11),
  ('I° M', 3, 12),
  ('I° H', 3, 13),
  ('II° M', 4, 14),
  ('II° H', 0, 15),
  ('III° M', 0, 16),
  ('III° H', 0, 17),
  ('IV° M', 0, 18),
  ('IV° H', 0, 19)
ON CONFLICT DO NOTHING;

-- Insert default fecha de actualización
INSERT INTO admision_vacantes_fecha (fecha_actualizacion)
VALUES ('Actualizadas al 15 de octubre')
ON CONFLICT DO NOTHING;

-- Insert default information sections
INSERT INTO admision_info_sections (title, content, icon_name, color, order_index)
VALUES
  ('Criterios Generales de Admisión', E'Cada año se abre el Proceso de Admisión para los cursos desde Playgroup hasta IV año Medio.\n\nEl proceso de matrícula está regulado por la Ley 20.845 de Inclusión Escolar.\n\nSe priorizan las postulaciones que cumplen alguno de los siguientes criterios de prioridad:\n\n1. Hermanos/as de alumnos del Colegio\n2. Hermanos/as de exalumnos del Colegio\n3. Hijos/as de padres y/o madres funcionarios del Colegio\n4. Hijos/as de exalumnos del Colegio\n5. Alumnos prioritarios y preferentes\n6. Alumnos que se encuentren cursando en establecimientos educacionales pertenecientes a la Fundación Pentecostés', 'FileText', 'from-blue-600 to-blue-800', 1),
  
  ('Requisitos y Antecedentes', E'3.1 Documentación del postulante:\n• Certificado de nacimiento\n• Informe de personalidad (desde prekínder)\n• Certificado de notas\n• Evaluaciones diferenciadas o PIE (si corresponde)\n\n3.2 Documentación de los padres:\n• Fotocopia de cédulas de identidad de ambos padres\n• Certificado de matrimonio o documentación que acredite situación familiar\n\n3.3 Otros antecedentes:\n• Carta de presentación familiar (opcional)\n• Carta de recomendación (opcional)', 'Users', 'from-green-600 to-green-800', 2),
  
  ('Vacantes Disponibles', E'Vacantes disponibles por curso para el proceso de admisión.\n\n[TABLA_VACANTES]\n\nLas vacantes están sujetas a cambios según el desarrollo del proceso de admisión.', 'Calendar', 'from-purple-600 to-purple-800', 3),
  
  ('Necesidades Educativas Especiales', E'El Colegio Sagrada Familia está comprometido con la inclusión educativa.\n\nCuando existan NEEP (Necesidades Educativas Especiales Permanentes) es necesario presentar todos los informes de especialistas e instalar este requerimiento en el proceso de admisión.\n\nEs requisito tener la voluntad de un trabajo colaborativo entre el colegio y la familia.\n\nEl colegio evaluará su factibilidad de atención según los recursos disponibles y el proyecto educativo.', 'CheckCircle', 'from-teal-600 to-teal-800', 4),
  
  ('Lista de Espera', E'Si no hay vacantes disponibles para el curso solicitado, las postulaciones quedan en lista de espera.\n\nLas familias en lista de espera serán contactadas en caso de que se liberen cupos durante el año escolar.\n\nLa lista de espera se mantiene activa hasta el término del año escolar correspondiente.', 'Users', 'from-orange-600 to-orange-800', 5),
  
  ('Cronograma de Postulación', E'Proceso de Admisión 2025:\n\n• Inicio de postulaciones: Agosto 2024\n• Cierre de postulaciones: Octubre 2024\n• Entrevistas y visitas: Septiembre - Octubre 2024\n• Evaluación de madurez (prekinder): Octubre 2024\n• Resultados del proceso: Noviembre 2024\n• Matrícula nuevos alumnos: Diciembre 2024 - Enero 2025\n\nLas fechas pueden estar sujetas a modificaciones que serán informadas oportunamente.', 'Calendar', 'from-indigo-600 to-indigo-800', 6),
  
  ('Costos y Proceso de Matrícula', E'Valores 2025:\n\n• Proceso de postulación: 1 UF\n• Matrícula Pre kínder y Kínder: 10 UF\n• Matrícula 1° Básico a IV Medio: 12 UF\n\nPara información detallada de valores de colegiatura, consulte el Documento Referencial 2025 disponible en nuestro sitio web.\n\nLos valores de colegiatura se ajustan anualmente según normativa vigente.', 'DollarSign', 'from-red-600 to-red-800', 7)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admision_vacantes_order ON admision_vacantes(order_index);
CREATE INDEX IF NOT EXISTS idx_admision_info_sections_order ON admision_info_sections(order_index);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admision_vacantes_updated_at BEFORE UPDATE ON admision_vacantes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admision_vacantes_fecha_updated_at BEFORE UPDATE ON admision_vacantes_fecha
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admision_info_sections_updated_at BEFORE UPDATE ON admision_info_sections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
