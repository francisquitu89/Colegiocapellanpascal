/*
  # Create news management system

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, rich text content)
      - `date` (date, publication date)
      - `images` (jsonb, array of image URLs)
      - `video_url` (text, optional YouTube/Vimeo URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `news` table
    - Add policies for public read access
    - Add policies for authenticated users to manage news
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  images jsonb DEFAULT '[]'::jsonb,
  video_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read news" ON news;
DROP POLICY IF EXISTS "Authenticated users can insert news" ON news;
DROP POLICY IF EXISTS "Authenticated users can update news" ON news;
DROP POLICY IF EXISTS "Authenticated users can delete news" ON news;

-- Allow public read access to news
CREATE POLICY "Anyone can read news"
  ON news
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert news
CREATE POLICY "Authenticated users can insert news"
  ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update news
CREATE POLICY "Authenticated users can update news"
  ON news
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete news
CREATE POLICY "Authenticated users can delete news"
  ON news
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_news_updated_at ON news;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();