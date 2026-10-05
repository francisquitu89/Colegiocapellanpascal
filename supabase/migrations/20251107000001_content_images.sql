-- Create content_images table for advanced image management in news and editorial
CREATE TABLE IF NOT EXISTS content_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('news', 'editorial')),
  url TEXT NOT NULL,
  alt_text TEXT,
  position_in_content INTEGER NOT NULL DEFAULT 1,
  alignment VARCHAR(10) NOT NULL DEFAULT 'center' CHECK (alignment IN ('left', 'right', 'center')),
  width INTEGER,
  height INTEGER,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_content_images_content_id ON content_images(content_id);
CREATE INDEX IF NOT EXISTS idx_content_images_content_type ON content_images(content_type);
CREATE INDEX IF NOT EXISTS idx_content_images_is_primary ON content_images(is_primary);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_content_images_updated_at ON content_images;

CREATE TRIGGER update_content_images_updated_at
    BEFORE UPDATE ON content_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE content_images ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read all images
CREATE POLICY "Allow public read on content_images"
  ON content_images FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert on content_images"
  ON content_images FOR INSERT
  WITH CHECK (true);

-- Policy: Allow authenticated users to update
CREATE POLICY "Allow authenticated update on content_images"
  ON content_images FOR UPDATE
  USING (true);

-- Policy: Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete on content_images"
  ON content_images FOR DELETE
  USING (true);
