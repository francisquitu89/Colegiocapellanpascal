-- Secondary project table: stores Drive/route projections independent from source documents
CREATE TABLE IF NOT EXISTS public.institutional_document_projections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_document_id uuid,
  title text NOT NULL,
  category text NOT NULL,
  source_file_url text,
  source_file_name text,
  external_view_url text NOT NULL,
  external_download_url text,
  route_slug text,
  open_in_fullscreen boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.institutional_document_projections DISABLE ROW LEVEL SECURITY;

-- Ensure browser clients (anon/authenticated) can read/write projections even if RLS is enabled.
ALTER TABLE public.institutional_document_projections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inst_doc_proj_select" ON public.institutional_document_projections;
DROP POLICY IF EXISTS "inst_doc_proj_insert" ON public.institutional_document_projections;
DROP POLICY IF EXISTS "inst_doc_proj_update" ON public.institutional_document_projections;
DROP POLICY IF EXISTS "inst_doc_proj_delete" ON public.institutional_document_projections;

CREATE POLICY "inst_doc_proj_select"
  ON public.institutional_document_projections
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "inst_doc_proj_insert"
  ON public.institutional_document_projections
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "inst_doc_proj_update"
  ON public.institutional_document_projections
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "inst_doc_proj_delete"
  ON public.institutional_document_projections
  FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE UNIQUE INDEX IF NOT EXISTS idx_inst_doc_proj_source_document_unique
  ON public.institutional_document_projections(source_document_id)
  WHERE source_document_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_inst_doc_proj_route_slug_unique
  ON public.institutional_document_projections(lower(route_slug))
  WHERE route_slug IS NOT NULL AND route_slug <> '';

CREATE INDEX IF NOT EXISTS idx_inst_doc_proj_category
  ON public.institutional_document_projections(category);
