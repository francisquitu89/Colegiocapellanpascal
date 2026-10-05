-- Add hidden visibility flag for institutional documents and drive projections
ALTER TABLE public.institutional_documents
  ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

ALTER TABLE public.institutional_document_projections
  ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

UPDATE public.institutional_documents
SET is_hidden = false
WHERE is_hidden IS NULL;

UPDATE public.institutional_document_projections
SET is_hidden = false
WHERE is_hidden IS NULL;
