-- Enables Postimages thumbnails and seeds Chilean public holidays from
-- October 2026 through 2027. School-specific dates must be confirmed by CCP.
-- Photos are existing school/community images hosted on Postimages.

BEGIN;

ALTER TABLE fechas_importantes
  ADD COLUMN IF NOT EXISTS imagen_url TEXT;

CREATE TEMPORARY TABLE calendar_holiday_seed (
  fecha DATE,
  actividad TEXT,
  imagen_url TEXT
) ON COMMIT DROP;

INSERT INTO calendar_holiday_seed (fecha, actividad, imagen_url)
VALUES
    (DATE '2026-10-12', 'Feriado nacional: Día del Descubrimiento de Dos Mundos', 'https://i.postimg.cc/vZxQnd2N/Ftos.png'),
    (DATE '2026-10-31', 'Feriado nacional: Día de las Iglesias Evangélicas y Protestantes', NULL::TEXT),
    (DATE '2026-11-01', 'Feriado nacional: Día de Todos los Santos', NULL::TEXT),
    (DATE '2026-12-08', 'Feriado nacional: Inmaculada Concepción', NULL::TEXT),
    (DATE '2026-12-25', 'Feriado nacional: Navidad', NULL::TEXT),
    (DATE '2027-01-01', 'Feriado nacional: Año Nuevo', NULL::TEXT),
    (DATE '2027-03-26', 'Feriado nacional: Viernes Santo', NULL::TEXT),
    (DATE '2027-03-27', 'Feriado nacional: Sábado Santo', NULL::TEXT),
    (DATE '2027-05-01', 'Feriado nacional: Día del Trabajo', NULL::TEXT),
    (DATE '2027-05-21', 'Feriado nacional: Día de las Glorias Navales', 'https://i.postimg.cc/PrthSw3c/foto.webp'),
    (DATE '2027-06-21', 'Feriado nacional: Día Nacional de los Pueblos Indígenas', NULL::TEXT),
    (DATE '2027-06-28', 'Feriado nacional: San Pedro y San Pablo', NULL::TEXT),
    (DATE '2027-07-16', 'Feriado nacional: Virgen del Carmen', NULL::TEXT),
    (DATE '2027-08-15', 'Feriado nacional: Asunción de la Virgen', NULL::TEXT),
    (DATE '2027-09-18', 'Feriado nacional: Fiestas Patrias', 'https://i.postimg.cc/BvKVbc3m/ddaad.jpg'),
    (DATE '2027-09-19', 'Feriado nacional: Día de las Glorias del Ejército', NULL::TEXT),
    (DATE '2027-10-11', 'Feriado nacional: Día del Descubrimiento de Dos Mundos', 'https://i.postimg.cc/vZxQnd2N/Ftos.png'),
    (DATE '2027-10-31', 'Feriado nacional: Día de las Iglesias Evangélicas y Protestantes', NULL::TEXT),
    (DATE '2027-11-01', 'Feriado nacional: Día de Todos los Santos', NULL::TEXT),
    (DATE '2027-12-08', 'Feriado nacional: Inmaculada Concepción', NULL),
    (DATE '2027-12-25', 'Feriado nacional: Navidad', NULL);

UPDATE fechas_importantes existing
SET imagen_url = holidays.imagen_url
FROM calendar_holiday_seed holidays
WHERE existing.fecha = holidays.fecha
  AND existing.actividad = holidays.actividad
  AND holidays.imagen_url IS NOT NULL
  AND existing.imagen_url IS NULL;

INSERT INTO fechas_importantes (fecha, hora, actividad, year, imagen_url)
SELECT
  holidays.fecha,
  NULL,
  holidays.actividad,
  EXTRACT(YEAR FROM holidays.fecha)::INTEGER,
  holidays.imagen_url
FROM calendar_holiday_seed holidays
WHERE NOT EXISTS (
  SELECT 1
  FROM fechas_importantes existing
  WHERE existing.fecha = holidays.fecha
    AND existing.actividad = holidays.actividad
);

COMMIT;
