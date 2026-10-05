-- Create table for institutional documents
CREATE TABLE IF NOT EXISTS institutional_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('Documentos de Matrícula 2025', 'Documentos, protocolos y reglamentos del Colegio', 'Seguros escolares', 'Otros')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Disable Row Level Security for this table
-- (Using custom admin authentication system)
ALTER TABLE institutional_documents DISABLE ROW LEVEL SECURITY;

-- Create storage bucket for institutional documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('institutional-documents', 'institutional-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "institutional_docs_public_access" ON storage.objects;
DROP POLICY IF EXISTS "institutional_docs_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "institutional_docs_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "institutional_docs_authenticated_delete" ON storage.objects;
DROP POLICY IF EXISTS "institutional_docs_public_upload" ON storage.objects;
DROP POLICY IF EXISTS "institutional_docs_public_update" ON storage.objects;
DROP POLICY IF EXISTS "institutional_docs_public_delete" ON storage.objects;

-- Create open storage policies (using custom admin authentication)
CREATE POLICY "institutional_docs_public_access"
ON storage.objects FOR SELECT
USING (bucket_id = 'institutional-documents');

CREATE POLICY "institutional_docs_public_upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'institutional-documents');

CREATE POLICY "institutional_docs_public_update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'institutional-documents')
WITH CHECK (bucket_id = 'institutional-documents');

CREATE POLICY "institutional_docs_public_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'institutional-documents');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_institutional_documents_category ON institutional_documents(category);
CREATE INDEX IF NOT EXISTS idx_institutional_documents_order ON institutional_documents(order_index);

-- Insert some example data
INSERT INTO institutional_documents (category, title, description, file_url, file_name, file_type, file_size, order_index) VALUES
  ('Documentos de Matrícula 2025', 'Ficha de Matrícula 2025', 'Formulario de inscripción para nuevos estudiantes', 'https://example.com/ficha-matricula-2025.pdf', 'ficha-matricula-2025.pdf', 'application/pdf', 524288, 1),
  ('Documentos, protocolos y reglamentos del Colegio', 'Reglamento Interno', 'Reglamento interno del establecimiento', 'https://example.com/reglamento-interno.pdf', 'reglamento-interno.pdf', 'application/pdf', 1048576, 1),
  ('Seguros escolares', 'Información Seguro Escolar', 'Detalles sobre cobertura del seguro escolar', 'https://example.com/seguro-escolar.pdf', 'seguro-escolar.pdf', 'application/pdf', 262144, 1);
