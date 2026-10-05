/*
  # Create page sections management system

  1. New Tables
    - `page_sections`
      - `id` (uuid, primary key)
      - `section_name` (text, main navbar section like "COLEGIO")
      - `subsection_name` (text, dropdown item like "HISTORIA")
      - `title` (text, page title)
      - `content` (text, rich text content)
      - `template_type` (text, template identifier)
      - `images` (jsonb, array of image URLs)
      - `video_url` (text, optional video)
      - `order_index` (integer, for ordering subsections)
      - `is_active` (boolean, to show/hide sections)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `page_sections` table
    - Add policies for public read access
    - Add policies for anyone to manage sections (demo purposes)
*/

CREATE TABLE IF NOT EXISTS page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name text NOT NULL,
  subsection_name text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  template_type text NOT NULL DEFAULT 'template_1',
  images jsonb DEFAULT '[]'::jsonb,
  video_url text,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique combination of section and subsection
  UNIQUE(section_name, subsection_name)
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access to page sections
CREATE POLICY "Anyone can read page sections"
  ON page_sections
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow anyone to insert page sections (for demo purposes)
CREATE POLICY "Anyone can insert page sections"
  ON page_sections
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to update page sections (for demo purposes)
CREATE POLICY "Anyone can update page sections"
  ON page_sections
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete page sections (for demo purposes)
CREATE POLICY "Anyone can delete page sections"
  ON page_sections
  FOR DELETE
  TO public
  USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON page_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data to test the system
INSERT INTO page_sections (section_name, subsection_name, title, content, template_type, order_index) VALUES
('COLEGIO', 'DIRECTORIO', 'Directorio del Colegio', '<p>Información sobre el directorio del colegio...</p>', 'template_1', 1),
('COLEGIO', 'RECTORÍA', 'Rectoría', '<p>Información sobre la rectoría...</p>', 'template_2', 2),
('ÁREA ACADÉMICA', 'VICERRECTORÍA ACADÉMICA', 'Vicerrectoría Académica', '<p>Información sobre la vicerrectoría académica...</p>', 'template_1', 1),
('FORMACIÓN', 'VICERRECTORÍA DE FORMACIÓN', 'Vicerrectoría de Formación', '<p>Información sobre la vicerrectoría de formación...</p>', 'template_3', 1);