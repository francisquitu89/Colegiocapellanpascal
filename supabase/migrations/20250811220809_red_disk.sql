/*
  # Fix news permissions for anonymous users

  1. Security Updates
    - Allow anonymous users to insert, update, and delete news
    - This is for demo purposes - in production you'd want proper authentication
    
  2. Changes
    - Update RLS policies to allow anonymous operations
    - Keep read access public
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can insert news" ON news;
DROP POLICY IF EXISTS "Authenticated users can update news" ON news;
DROP POLICY IF EXISTS "Authenticated users can delete news" ON news;
DROP POLICY IF EXISTS "Anyone can insert news" ON news;
DROP POLICY IF EXISTS "Anyone can update news" ON news;
DROP POLICY IF EXISTS "Anyone can delete news" ON news;

-- Allow anonymous users to insert news (for demo purposes)
CREATE POLICY "Anyone can insert news"
  ON news
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anonymous users to update news (for demo purposes)
CREATE POLICY "Anyone can update news"
  ON news
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete news (for demo purposes)
CREATE POLICY "Anyone can delete news"
  ON news
  FOR DELETE
  TO public
  USING (true);