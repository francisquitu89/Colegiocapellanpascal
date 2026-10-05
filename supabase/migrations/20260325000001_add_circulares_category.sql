-- Migration: Add 'Circulares' category support for institutional documents
DO $proc$
DECLARE r RECORD;
BEGIN
  -- Drop the existing category check constraint if present
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'institutional_documents'::regclass
      AND contype = 'c'
      AND conname = 'institutional_documents_category_check'
  LOOP
    EXECUTE format('ALTER TABLE institutional_documents DROP CONSTRAINT %I', r.conname);
  END LOOP;

  -- Recreate constraint including 'Circulares' and keeping listas subcategory pattern
  EXECUTE 'ALTER TABLE institutional_documents ADD CONSTRAINT institutional_documents_category_check CHECK (
    category IN (
      ''Documentos de Matrícula 2026'',
      ''Documentos, protocolos y reglamentos del Colegio'',
      ''Circulares'',
      ''Seguros escolares'',
      ''Otros'',
      ''Listas útiles escolares''
    ) OR category LIKE ''Listas útiles escolares - %''
  )';
END
$proc$;
