-- Create casino_menu table (single menu document)
CREATE TABLE IF NOT EXISTS casino_menu (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('pdf', 'image')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create storage bucket for casino files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('casino-files', 'casino-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public SELECT on casino-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public INSERT on casino-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public UPDATE on casino-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public DELETE on casino-files" ON storage.objects;

-- Create storage policies for public access
CREATE POLICY "Allow public SELECT on casino-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'casino-files');

CREATE POLICY "Allow public INSERT on casino-files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'casino-files');

CREATE POLICY "Allow public UPDATE on casino-files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'casino-files');

CREATE POLICY "Allow public DELETE on casino-files"
ON storage.objects FOR DELETE
USING (bucket_id = 'casino-files');

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_casino_menu_updated_at ON casino_menu;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_casino_menu_updated_at
    BEFORE UPDATE ON casino_menu
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
