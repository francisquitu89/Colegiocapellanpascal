-- Actualizar categorías de Listas útiles escolares
-- Cambiar Pre-Escolar, Básica, Media a Primer ciclo, Segundo ciclo, Tercer ciclo

-- Ver qué categorías existen actualmente
SELECT DISTINCT category 
FROM institutional_documents 
WHERE category LIKE '%Listas útiles escolares%'
ORDER BY category;

-- Actualizar Pre-Escolar a Primer ciclo
UPDATE institutional_documents
SET category = REPLACE(category, 'Pre-Escolar', 'Primer ciclo')
WHERE category LIKE '%Pre-Escolar%';

-- Actualizar Básica a Segundo ciclo
UPDATE institutional_documents
SET category = REPLACE(category, 'Básica', 'Segundo ciclo')
WHERE category LIKE '%Básica%';

-- Actualizar Media a Tercer ciclo
UPDATE institutional_documents
SET category = REPLACE(category, 'Media', 'Tercer ciclo')
WHERE category LIKE '%Media%';

-- Verificar los cambios finales
SELECT id, category, title 
FROM institutional_documents 
WHERE category LIKE '%Listas útiles escolares%' OR category LIKE '%ciclo%'
ORDER BY category;
