/*
  # Create editorial management system

  1. New Tables
    - `editorial`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, rich text content)
      - `date` (date, publication date)
      - `images` (jsonb, array of image URLs)
      - `video_url` (text, optional YouTube/Vimeo URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `editorial` table
    - Add policies for public read access
    - Add policies for anyone to manage editorial (demo purposes)
*/

CREATE TABLE IF NOT EXISTS editorial (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  images jsonb DEFAULT '[]'::jsonb,
  video_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE editorial ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read editorial" ON editorial;
DROP POLICY IF EXISTS "Anyone can insert editorial" ON editorial;
DROP POLICY IF EXISTS "Anyone can update editorial" ON editorial;
DROP POLICY IF EXISTS "Anyone can delete editorial" ON editorial;

-- Allow public read access to editorial
CREATE POLICY "Anyone can read editorial"
  ON editorial
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert editorial (for demo purposes)
CREATE POLICY "Anyone can insert editorial"
  ON editorial
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to update editorial (for demo purposes)
CREATE POLICY "Anyone can update editorial"
  ON editorial
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete editorial (for demo purposes)
CREATE POLICY "Anyone can delete editorial"
  ON editorial
  FOR DELETE
  TO public
  USING (true);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_editorial_updated_at ON editorial;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_editorial_updated_at
  BEFORE UPDATE ON editorial
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();