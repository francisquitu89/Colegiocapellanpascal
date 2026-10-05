-- Migration: Add 'Listas útiles escolares' category support
DO $proc$
DECLARE r RECORD;
BEGIN
  -- Drop the existing check constraint
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'institutional_documents'::regclass
      AND contype = 'c'
      AND conname = 'institutional_documents_category_check'
  LOOP
    EXECUTE format('ALTER TABLE institutional_documents DROP CONSTRAINT %I', r.conname);
  END LOOP;

  -- Add new constraint allowing 'Listas útiles escolares' and its subcategories
  -- We use a LIKE pattern to allow subcategories like 'Listas útiles escolares - Pre-Escolar'
  EXECUTE 'ALTER TABLE institutional_documents ADD CONSTRAINT institutional_documents_category_check CHECK (
    category IN (
      ''Documentos de Matrícula 2026'',
      ''Documentos, protocolos y reglamentos del Colegio'',
      ''Seguros escolares'',
      ''Otros'',
      ''Listas útiles escolares''
    ) OR category LIKE ''Listas útiles escolares - %''
  )';
END
$proc$;
