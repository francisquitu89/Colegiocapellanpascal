-- Migration: update CHECK constraint to use 'Documentos de Matrícula 2026'
DO $proc$
DECLARE r RECORD;
BEGIN
  -- Drop any check constraint that references the old 2025 category
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'institutional_documents'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%Documentos de Matrícula 2025%'
  LOOP
    EXECUTE format('ALTER TABLE institutional_documents DROP CONSTRAINT %I', r.conname);
  END LOOP;

  -- Update any remaining rows that still reference 2025 BEFORE adding the new constraint
  UPDATE institutional_documents
  SET category = 'Documentos de Matrícula 2026'
  WHERE category = 'Documentos de Matrícula 2025';

  -- Add new constraint allowing 2026 instead of 2025
  EXECUTE 'ALTER TABLE institutional_documents ADD CONSTRAINT institutional_documents_category_check CHECK (category IN (''Documentos de Matrícula 2026'', ''Documentos, protocolos y reglamentos del Colegio'', ''Seguros escolares'', ''Otros''))';
END
$proc$;
