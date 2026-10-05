-- Create announcement_popup table
CREATE TABLE IF NOT EXISTS announcement_popup (
  id SERIAL PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT false,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  document_url TEXT,
  document_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default record
INSERT INTO announcement_popup (is_active, title, message) 
VALUES (false, 'Anuncio Importante', 'Mensaje de ejemplo')
ON CONFLICT DO NOTHING;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_announcement_popup_updated_at ON announcement_popup;

CREATE TRIGGER update_announcement_popup_updated_at
    BEFORE UPDATE ON announcement_popup
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
