-- Add link fields to announcement_popup table
ALTER TABLE announcement_popup
ADD COLUMN IF NOT EXISTS link_url TEXT,
ADD COLUMN IF NOT EXISTS link_text VARCHAR(255);
