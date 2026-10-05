-- Secondary project: persistent config for homepage hero base images order
CREATE TABLE IF NOT EXISTS public.site_hero_settings (
  id boolean PRIMARY KEY DEFAULT true,
  base_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_hero_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_hero_settings_select" ON public.site_hero_settings;
DROP POLICY IF EXISTS "site_hero_settings_insert" ON public.site_hero_settings;
DROP POLICY IF EXISTS "site_hero_settings_update" ON public.site_hero_settings;
DROP POLICY IF EXISTS "site_hero_settings_delete" ON public.site_hero_settings;

CREATE POLICY "site_hero_settings_select"
  ON public.site_hero_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "site_hero_settings_insert"
  ON public.site_hero_settings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "site_hero_settings_update"
  ON public.site_hero_settings
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "site_hero_settings_delete"
  ON public.site_hero_settings
  FOR DELETE
  TO public
  USING (true);

CREATE OR REPLACE FUNCTION update_site_hero_settings_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_site_hero_settings_updated_at ON public.site_hero_settings;

CREATE TRIGGER update_site_hero_settings_updated_at
  BEFORE UPDATE ON public.site_hero_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_hero_settings_updated_at_column();
