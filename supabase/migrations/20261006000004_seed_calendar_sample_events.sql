-- Adds clearly labeled sample school events with the same images used by the
-- public home-page slideshow. Replace or remove these dates with CCP's
-- confirmed academic calendar before treating them as official.

INSERT INTO fechas_importantes (fecha, hora, actividad, year, imagen_url)
SELECT
  sample.fecha,
  sample.hora,
  sample.actividad,
  EXTRACT(YEAR FROM sample.fecha)::INTEGER,
  sample.imagen_url
FROM (
  VALUES
    (DATE '2026-10-15', '09:00 hrs', 'Actividad de muestra: Jornada de vida escolar (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Fotos-colegia-219.webp'),
    (DATE '2026-10-23', '10:00 hrs', 'Actividad de muestra: Encuentro de comunidad Pascal (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Aniversario-CCP-2024-37-copia.webp'),
    (DATE '2026-11-06', '09:30 hrs', 'Actividad de muestra: Jornada de aprendizaje y reflexión (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/03/Foto-1_-Alumnos-de-diferenciado-IV%C2%B0.-Comprension-historica-del-presente.-Explicacion-a-del-Combate-Naval-de-Iquique--scaled.jpg'),
    (DATE '2026-11-20', '11:00 hrs', 'Actividad de muestra: Encuentro de formación escolar (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2026/04/LITURGIA-DE-CENIZAS-scaled.jpg'),
    (DATE '2026-12-04', '10:00 hrs', 'Actividad de muestra: Cierre de actividades de la comunidad (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Fotos-colegia-219.webp'),
    (DATE '2026-12-11', '09:30 hrs', 'Actividad de muestra: Jornada de encuentro y celebración (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Aniversario-CCP-2024-37-copia.webp'),
    (DATE '2027-02-24', '08:30 hrs', 'Actividad de muestra: Bienvenida a la comunidad educativa (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Fotos-colegia-219.webp'),
    (DATE '2027-03-12', '09:00 hrs', 'Actividad de muestra: Jornada de integración escolar (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/03/Foto-1_-Alumnos-de-diferenciado-IV%C2%B0.-Comprension-historica-del-presente.-Explicacion-a-del-Combate-Naval-de-Iquique--scaled.jpg'),
    (DATE '2027-04-09', '10:00 hrs', 'Actividad de muestra: Encuentro de aprendizaje por cursos (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Aniversario-CCP-2024-37-copia.webp'),
    (DATE '2027-04-23', '09:30 hrs', 'Actividad de muestra: Jornada de reflexión y comunidad (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2026/04/LITURGIA-DE-CENIZAS-scaled.jpg'),
    (DATE '2027-05-07', '11:00 hrs', 'Actividad de muestra: Actividad formativa del colegio (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Fotos-colegia-219.webp'),
    (DATE '2027-06-04', '09:00 hrs', 'Actividad de muestra: Encuentro de comunidad educativa (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/03/Foto-1_-Alumnos-de-diferenciado-IV%C2%B0.-Comprension-historica-del-presente.-Explicacion-a-del-Combate-Naval-de-Iquique--scaled.jpg'),
    (DATE '2027-07-09', '10:00 hrs', 'Actividad de muestra: Jornada de convivencia escolar (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Aniversario-CCP-2024-37-copia.webp'),
    (DATE '2027-08-06', '09:30 hrs', 'Actividad de muestra: Celebración de la vida escolar (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2026/04/LITURGIA-DE-CENIZAS-scaled.jpg'),
    (DATE '2027-09-10', '11:00 hrs', 'Actividad de muestra: Encuentro de tradiciones y comunidad (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Aniversario-CCP-2024-37-copia.webp'),
    (DATE '2027-10-22', '09:00 hrs', 'Actividad de muestra: Jornada de aprendizaje y servicio (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/03/Foto-1_-Alumnos-de-diferenciado-IV%C2%B0.-Comprension-historica-del-presente.-Explicacion-a-del-Combate-Naval-de-Iquique--scaled.jpg'),
    (DATE '2027-11-12', '10:00 hrs', 'Actividad de muestra: Encuentro de formación integral (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Fotos-colegia-219.webp'),
    (DATE '2027-12-03', '09:30 hrs', 'Actividad de muestra: Cierre de año de la comunidad Pascal (confirmar fecha)', 'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Aniversario-CCP-2024-37-copia.webp')
) AS sample (fecha, hora, actividad, imagen_url)
WHERE NOT EXISTS (
  SELECT 1
  FROM fechas_importantes existing
  WHERE existing.fecha = sample.fecha
    AND existing.actividad = sample.actividad
);
