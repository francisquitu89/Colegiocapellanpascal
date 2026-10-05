-- Migration: rename category 'Documentos de Matrícula 2025' to 'Documentos de Matrícula 2026'
BEGIN;

-- Drop the check constraint that restricts category values
ALTER TABLE institutional_documents DROP CONSTRAINT IF EXISTS institutional_documents_category_check;

UPDATE institutional_documents
SET category = 'Documentos de Matrícula 2026'
WHERE category = 'Documentos de Matrícula 2025';

COMMIT;
