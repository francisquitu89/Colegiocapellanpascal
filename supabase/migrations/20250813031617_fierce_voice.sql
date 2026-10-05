/*
  # Rollback migration for page_sections system
  
  This migration reverts all changes made by 20250813031028_bitter_valley.sql
  
  1. Drops
    - Drop page_sections table completely
    - Drop all associated policies
    - Drop all triggers
    
  2. Cleanup
    - Remove all data and structure created by bitter_valley migration
*/

-- Drop all policies first
DROP POLICY IF EXISTS "Anyone can read page sections" ON page_sections;
DROP POLICY IF EXISTS "Anyone can insert page sections" ON page_sections;
DROP POLICY IF EXISTS "Anyone can update page sections" ON page_sections;
DROP POLICY IF EXISTS "Anyone can delete page sections" ON page_sections;

-- Drop trigger
DROP TRIGGER IF EXISTS update_page_sections_updated_at ON page_sections;

-- Drop the table completely
DROP TABLE IF EXISTS page_sections;

-- Note: The update_updated_at_column() function is shared with other tables,
-- so we don't drop it as it's used by news and editorial tables