-- Adds Chilean public holidays to the school calendar from October 2026
-- through 2027. These are national holidays, not school-specific activities;
-- confirm any effect on the school's schedule with the official school calendar.
-- Dates cross-checked against https://date.nager.at/api/v3/PublicHolidays/{year}/CL
-- Regional holidays are intentionally excluded.

BEGIN;

WITH holidays (fecha, actividad) AS (
  VALUES
    (DATE '2026-10-12', 'Feriado nacional: Día del Descubrimiento de Dos Mundos'),
    (DATE '2026-10-31', 'Feriado nacional: Día de las Iglesias Evangélicas y Protestantes'),
    (DATE '2026-11-01', 'Feriado nacional: Día de Todos los Santos'),
    (DATE '2026-12-08', 'Feriado nacional: Inmaculada Concepción'),
    (DATE '2026-12-25', 'Feriado nacional: Navidad'),
    (DATE '2027-01-01', 'Feriado nacional: Año Nuevo'),
    (DATE '2027-03-26', 'Feriado nacional: Viernes Santo'),
    (DATE '2027-03-27', 'Feriado nacional: Sábado Santo'),
    (DATE '2027-05-01', 'Feriado nacional: Día del Trabajo'),
    (DATE '2027-05-21', 'Feriado nacional: Día de las Glorias Navales'),
    (DATE '2027-06-21', 'Feriado nacional: Día Nacional de los Pueblos Indígenas'),
    (DATE '2027-06-28', 'Feriado nacional: San Pedro y San Pablo'),
    (DATE '2027-07-16', 'Feriado nacional: Virgen del Carmen'),
    (DATE '2027-08-15', 'Feriado nacional: Asunción de la Virgen'),
    (DATE '2027-09-18', 'Feriado nacional: Fiestas Patrias'),
    (DATE '2027-09-19', 'Feriado nacional: Día de las Glorias del Ejército'),
    (DATE '2027-10-11', 'Feriado nacional: Día del Descubrimiento de Dos Mundos'),
    (DATE '2027-10-31', 'Feriado nacional: Día de las Iglesias Evangélicas y Protestantes'),
    (DATE '2027-11-01', 'Feriado nacional: Día de Todos los Santos'),
    (DATE '2027-12-08', 'Feriado nacional: Inmaculada Concepción'),
    (DATE '2027-12-25', 'Feriado nacional: Navidad')
)
INSERT INTO fechas_importantes (fecha, hora, actividad, year)
SELECT
  holidays.fecha,
  NULL,
  holidays.actividad,
  EXTRACT(YEAR FROM holidays.fecha)::INTEGER
FROM holidays
WHERE NOT EXISTS (
  SELECT 1
  FROM fechas_importantes existing
  WHERE existing.fecha = holidays.fecha
    AND existing.hora IS NULL
    AND existing.actividad = holidays.actividad
);

COMMIT;
