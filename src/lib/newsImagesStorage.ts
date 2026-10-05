import { driveRoutesSupabase, supabase } from './supabase';

export const NEWS_IMAGES_BUCKET = 'news-images';

export const getNewsImagesPublicUrl = (filePath: string): string => {
  const { data } = driveRoutesSupabase.storage
    .from(NEWS_IMAGES_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const uploadNewsImage = async (
  filePath: string,
  file: File | Blob,
  options?: { cacheControl?: string; upsert?: boolean }
) => {
  const { error } = await driveRoutesSupabase.storage
    .from(NEWS_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: options?.cacheControl ?? '3600',
      upsert: options?.upsert ?? false,
    });

  if (error) throw error;

  return {
    filePath,
    publicUrl: getNewsImagesPublicUrl(filePath),
  };
};

export const removeNewsImages = async (filePaths: string[]) => {
  const uniquePaths = Array.from(new Set(filePaths.filter(Boolean)));
  if (uniquePaths.length === 0) return;

  const { error } = await driveRoutesSupabase.storage
    .from(NEWS_IMAGES_BUCKET)
    .remove(uniquePaths);

  if (error) {
    throw error;
  }
};

export const getNewsImagePathFromUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const marker = `/${NEWS_IMAGES_BUCKET}/`;
    const markerIndex = parsed.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(parsed.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
};
