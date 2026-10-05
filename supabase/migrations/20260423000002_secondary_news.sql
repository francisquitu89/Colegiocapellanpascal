-- Proyecto secundario: tabla news y permisos para gestión pública/admin actual
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

DROP POLICY IF EXISTS "Anyone can read news" ON news;
DROP POLICY IF EXISTS "Authenticated users can insert news" ON news;
DROP POLICY IF EXISTS "Authenticated users can update news" ON news;
DROP POLICY IF EXISTS "Authenticated users can delete news" ON news;
DROP POLICY IF EXISTS "Anyone can insert news" ON news;
DROP POLICY IF EXISTS "Anyone can update news" ON news;
DROP POLICY IF EXISTS "Anyone can delete news" ON news;

CREATE POLICY "Anyone can read news"
  ON news
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert news"
  ON news
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update news"
  ON news
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete news"
  ON news
  FOR DELETE
  TO public
  USING (true);

CREATE OR REPLACE FUNCTION update_news_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_news_updated_at ON news;

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_news_updated_at_column();
