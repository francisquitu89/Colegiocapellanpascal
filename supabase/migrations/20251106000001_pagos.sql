-- Create pagos_info table
CREATE TABLE IF NOT EXISTS pagos_info (
  id SERIAL PRIMARY KEY,
  payment_link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_pagos_info_updated_at ON pagos_info;

CREATE TRIGGER update_pagos_info_updated_at
    BEFORE UPDATE ON pagos_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
