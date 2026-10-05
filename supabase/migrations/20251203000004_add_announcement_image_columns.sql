-- Migration: add image fields to announcement_popup
ALTER TABLE announcement_popup
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS image_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS image_enabled BOOLEAN DEFAULT false;

-- Backfill for existing rows (no-op if already null)
UPDATE announcement_popup SET image_url = image_url WHERE id IS NOT NULL;
