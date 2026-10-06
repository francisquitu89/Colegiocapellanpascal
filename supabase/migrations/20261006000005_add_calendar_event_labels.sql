-- Adds short visible titles to calendar events. Existing sample event labels
-- are assigned by their exact sample date and activity text.

ALTER TABLE fechas_importantes
  ADD COLUMN IF NOT EXISTS etiqueta VARCHAR(50);

WITH sample_labels (fecha, actividad, etiqueta) AS (
  VALUES
    (DATE '2026-10-15', 'Actividad de muestra: Jornada de vida escolar (confirmar fecha)', 'Vida escolar'),
    (DATE '2026-10-23', 'Actividad de muestra: Encuentro de comunidad Pascal (confirmar fecha)', 'Comunidad Pascal'),
    (DATE '2026-11-06', 'Actividad de muestra: Jornada de aprendizaje y reflexión (confirmar fecha)', 'Aprendizaje'),
    (DATE '2026-11-20', 'Actividad de muestra: Encuentro de formación escolar (confirmar fecha)', 'Formación'),
    (DATE '2026-12-04', 'Actividad de muestra: Cierre de actividades de la comunidad (confirmar fecha)', 'Cierre escolar'),
    (DATE '2026-12-11', 'Actividad de muestra: Jornada de encuentro y celebración (confirmar fecha)', 'Celebración'),
    (DATE '2027-02-24', 'Actividad de muestra: Bienvenida a la comunidad educativa (confirmar fecha)', 'Bienvenida'),
    (DATE '2027-03-12', 'Actividad de muestra: Jornada de integración escolar (confirmar fecha)', 'Integración'),
    (DATE '2027-04-09', 'Actividad de muestra: Encuentro de aprendizaje por cursos (confirmar fecha)', 'Aprendizaje'),
    (DATE '2027-04-23', 'Actividad de muestra: Jornada de reflexión y comunidad (confirmar fecha)', 'Comunidad'),
    (DATE '2027-05-07', 'Actividad de muestra: Actividad formativa del colegio (confirmar fecha)', 'Formación'),
    (DATE '2027-06-04', 'Actividad de muestra: Encuentro de comunidad educativa (confirmar fecha)', 'Encuentro escolar'),
    (DATE '2027-07-09', 'Actividad de muestra: Jornada de convivencia escolar (confirmar fecha)', 'Convivencia'),
    (DATE '2027-08-06', 'Actividad de muestra: Celebración de la vida escolar (confirmar fecha)', 'Vida escolar'),
    (DATE '2027-09-10', 'Actividad de muestra: Encuentro de tradiciones y comunidad (confirmar fecha)', 'Tradiciones'),
    (DATE '2027-10-22', 'Actividad de muestra: Jornada de aprendizaje y servicio (confirmar fecha)', 'Aprendizaje y servicio'),
    (DATE '2027-11-12', 'Actividad de muestra: Encuentro de formación integral (confirmar fecha)', 'Formación integral'),
    (DATE '2027-12-03', 'Actividad de muestra: Cierre de año de la comunidad Pascal (confirmar fecha)', 'Cierre de año')
)
UPDATE fechas_importantes event
SET etiqueta = sample_labels.etiqueta
FROM sample_labels
WHERE event.fecha = sample_labels.fecha
  AND event.actividad = sample_labels.actividad
  AND (event.etiqueta IS NULL OR event.etiqueta = '');
