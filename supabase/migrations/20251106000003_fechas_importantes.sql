-- Create fechas_importantes table
CREATE TABLE IF NOT EXISTS fechas_importantes (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  hora VARCHAR(50),
  actividad TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert datos base 2025
INSERT INTO fechas_importantes (fecha, hora, actividad, year) VALUES
('2025-06-19', NULL, 'Último día de clases del primer semestre', 2025),
('2025-06-19', '19:00 hrs', 'Sf Aprende apoderados Playgroup a 4° Básicos', 2025),
('2025-06-20', NULL, 'Feriado por el Día Nacional de los Pueblos Indígenas', 2025),
('2025-07-10', '19:00 hrs', 'Sf Aprende apoderados 6°, 7° y 8° básicos', 2025),
('2025-06-20', NULL, 'Trabajo de Invierno (I a IV medio) - Del 20 al 25 de junio', 2025),
('2025-06-23', NULL, 'Vacaciones de invierno - Del 23 de junio al 4 de julio', 2025),
('2025-07-07', NULL, 'Inicio del segundo semestre', 2025),
('2025-07-24', NULL, 'Jornada Ministerial* (suspensión de clases) - 24 y 25 de julio', 2025),
('2025-07-29', '18:00 hrs', 'Semana de reuniones de apoderados - Del 29 al 31 de julio', 2025),
('2025-09-15', NULL, 'Receso de Fiestas Patrias - Del 15 al 17 de septiembre', 2025),
('2025-10-17', '12:00 hrs', 'Misa de despedida IV Medios', 2025),
('2025-10-17', NULL, 'Misiones Siembra (7º y 8º básico) - Del 17 al 19 de octubre', 2025),
('2025-10-20', NULL, 'Período de preparación PAES IV Medios - Del 20 al 30 de octubre', 2025),
('2025-11-13', '18:00 hrs', 'Ceremonia de Graduación IV Medios', 2025),
('2025-12-05', NULL, 'Último día de clases del segundo semestre', 2025),
('2025-12-09', NULL, 'Ceremonias de cierre del año escolar - Del 9 al 11 de diciembre', 2025),
('2025-12-15', NULL, 'Misiones de Verano (I a IV medio) - Del 15 al 20 de diciembre', 2025);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_fechas_importantes_updated_at ON fechas_importantes;

CREATE TRIGGER update_fechas_importantes_updated_at
    BEFORE UPDATE ON fechas_importantes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
