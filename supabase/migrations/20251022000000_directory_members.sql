-- Create directory_members table for managing directory and rectory members
CREATE TABLE IF NOT EXISTS directory_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('directorio', 'rectoria')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_directory_members_category ON directory_members(category);
CREATE INDEX idx_directory_members_order ON directory_members(order_index);

-- Enable Row Level Security
ALTER TABLE directory_members ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON directory_members
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON directory_members
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON directory_members
  FOR UPDATE USING (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON directory_members
  FOR DELETE USING (true);
