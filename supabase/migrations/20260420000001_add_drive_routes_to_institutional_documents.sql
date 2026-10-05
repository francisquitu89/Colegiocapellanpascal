-- Add support for Drive-backed institutional documents and per-document public routes
ALTER TABLE institutional_documents
  ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'storage',
  ADD COLUMN IF NOT EXISTS external_view_url TEXT,
  ADD COLUMN IF NOT EXISTS external_download_url TEXT,
  ADD COLUMN IF NOT EXISTS route_slug TEXT,
  ADD COLUMN IF NOT EXISTS open_in_fullscreen BOOLEAN NOT NULL DEFAULT true;

DO $proc$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'institutional_documents'::regclass
      AND contype = 'c'
      AND conname LIKE '%source_type%'
  LOOP
    EXECUTE format('ALTER TABLE institutional_documents DROP CONSTRAINT %I', r.conname);
  END LOOP;
END
$proc$;

ALTER TABLE institutional_documents
  ADD CONSTRAINT institutional_documents_source_type_check
  CHECK (source_type IN ('storage', 'drive'));

UPDATE institutional_documents
SET source_type = 'storage'
WHERE source_type IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_institutional_documents_route_slug_unique
  ON institutional_documents (lower(route_slug))
  WHERE route_slug IS NOT NULL AND route_slug <> '';
