-- Tabla para el calendario de admisión Kínder a II°
CREATE TABLE IF NOT EXISTS admision_kinder_ii_calendario (
  id BIGSERIAL PRIMARY KEY,
  fecha TEXT NOT NULL,
  hora TEXT NOT NULL,
  proceso TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permitir gestión desde Supabase y admin
ALTER TABLE admision_kinder_ii_calendario DISABLE ROW LEVEL SECURITY;

-- Insertar datos iniciales
INSERT INTO admision_kinder_ii_calendario (fecha, hora, proceso, order_index) VALUES
('29/10', '9:00 hrs', 'Inicio proceso inscripción a través pág web', 1),
('04/11', '20:00 hrs', 'Cierre inscripción', 2),
('12/11', '15:00 hrs', 'Evaluaciones académicas a postulantes.', 3),
('10/11 al 25/11', '14:00 hrs 15:35 hrs 17:00 hrs', 'Entrevistas apoderados de postulantes. (se enviará correo electrónico para que se puedan inscribir)', 4),
('10/11 al 25/11', '14:00 hrs 15:35 hrs 17:00 hrs', 'Entrevista personal a postulantes con psicólogo. (Se enviará correo electrónico para que se puedan inscribir)', 5),
('28/11', '20:00 hrs', 'Entrega resultados por correo a Familias Postulantes', 6),
('1 al 5/12', '8:30 a 13:30 14:30 a 15:30', 'Pago Matrícula', 7)
ON CONFLICT DO NOTHING;
