import { driveRoutesSupabase } from './supabase';

export const SITE_LOGO_BUCKET = 'site-logos';
export const SITE_LOGO_FILENAME = 'site-main-logo';

export async function getSiteLogoUrl(): Promise<string | null> {
  const { data: files, error } = await driveRoutesSupabase.storage
    .from(SITE_LOGO_BUCKET)
    .list('', { search: SITE_LOGO_FILENAME });

  if (error) {
    console.error('Error fetching site logo:', error);
    return null;
  }

  const logoFile = files?.find((file) => file.name.startsWith(SITE_LOGO_FILENAME));

  if (!logoFile) {
    return null;
  }

  const { data } = driveRoutesSupabase.storage
    .from(SITE_LOGO_BUCKET)
    .getPublicUrl(logoFile.name);

  return `${data.publicUrl}?v=${Date.now()}`;
}

export async function deleteExistingSiteLogos(): Promise<void> {
  const { data: files } = await driveRoutesSupabase.storage
    .from(SITE_LOGO_BUCKET)
    .list('', { search: SITE_LOGO_FILENAME });

  if (!files?.length) {
    return;
  }

  const filesToDelete = files
    .filter((file) => file.name.startsWith(SITE_LOGO_FILENAME))
    .map((file) => file.name);

  if (filesToDelete.length > 0) {
    await driveRoutesSupabase.storage.from(SITE_LOGO_BUCKET).remove(filesToDelete);
  }
}
