import { driveRoutesSupabase } from './supabase';

export const HOME_HERO_BUCKET = 'site-logos';
export const HOME_HERO_FILENAME = 'site-home-hero';
export const HOME_HERO_UPDATED_EVENT = 'site-hero-updated';
export const HOME_HERO_DEFAULT_IMAGES = [
  'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Fotos-colegia-219.webp',
  'https://colegiocapellanpascal.cl/wp-content/uploads/2025/03/Foto-1_-Alumnos-de-diferenciado-IV°.-Comprension-historica-del-presente.-Explicacion-a-del-Combate-Naval-de-Iquique--scaled.jpg',
  'https://colegiocapellanpascal.cl/wp-content/uploads/2026/04/LITURGIA-DE-CENIZAS-scaled.jpg',
  'https://colegiocapellanpascal.cl/wp-content/uploads/2025/02/Aniversario-CCP-2024-37-copia.webp'
];
const HOME_HERO_LOCAL_STORAGE_KEY = 'site-home-hero-base-images';

const upgradeLegacyHeroImage = (image: string): string => {
  const replacements: Array<[RegExp, string]> = [
    [
      /https?:\/\/i\.postimg\.cc\/TfmjSLLf\/Fotos-colegia-219\.webp/i,
      HOME_HERO_DEFAULT_IMAGES[0],
    ],
    [
      /https?:\/\/i\.postimg\.cc\/fbTHTZP9\/[^/?#]+/i,
      HOME_HERO_DEFAULT_IMAGES[1],
    ],
    [
      /https?:\/\/i\.postimg\.cc\/dtfQ9t28\/[^/?#]+/i,
      HOME_HERO_DEFAULT_IMAGES[2],
    ],
    [
      /https?:\/\/i\.postimg\.cc\/vTQ7XvdJ\/Aniversario-CCP-2024-37-copia(?:-1024x683)?\.webp/i,
      HOME_HERO_DEFAULT_IMAGES[3],
    ],
  ];

  const replacement = replacements.find(([pattern]) => pattern.test(image));
  return replacement ? image.replace(replacement[0], replacement[1]).split(/[?#]/, 1)[0] : image;
};

interface SiteHeroSettingsRow {
  id: boolean;
  base_images: string[] | null;
  updated_at?: string;
}

const normalizeHeroImages = (images: string[]): string[] => {
  return Array.from(
    new Set(
      images
        .map((value) => upgradeLegacyHeroImage(value.trim()))
        .filter(Boolean)
    )
  );
};

const getLocalBaseImages = (): string[] | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(HOME_HERO_LOCAL_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed)) return null;

    const normalized = normalizeHeroImages(parsed);
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
};

const setLocalBaseImages = (images: string[]) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(HOME_HERO_LOCAL_STORAGE_KEY, JSON.stringify(images));
  } catch {
    // noop
  }
};

export const emitHomeHeroUpdated = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(HOME_HERO_UPDATED_EVENT));
};

export async function getHomeHeroUrl(): Promise<string | null> {
  const { data: files, error } = await driveRoutesSupabase.storage
    .from(HOME_HERO_BUCKET)
    .list('', { search: HOME_HERO_FILENAME });

  if (error) {
    console.error('Error fetching home hero image:', error);
    return null;
  }

  const heroFile = files?.find((file) => file.name.startsWith(HOME_HERO_FILENAME));

  if (!heroFile) {
    return null;
  }

  const { data } = driveRoutesSupabase.storage
    .from(HOME_HERO_BUCKET)
    .getPublicUrl(heroFile.name);

  return `${data.publicUrl}?v=${Date.now()}`;
}

export async function deleteExistingHomeHeroImages(): Promise<void> {
  const { data: files } = await driveRoutesSupabase.storage
    .from(HOME_HERO_BUCKET)
    .list('', { search: HOME_HERO_FILENAME });

  if (!files?.length) {
    return;
  }

  const filesToDelete = files
    .filter((file) => file.name.startsWith(HOME_HERO_FILENAME))
    .map((file) => file.name);

  if (filesToDelete.length > 0) {
    await driveRoutesSupabase.storage.from(HOME_HERO_BUCKET).remove(filesToDelete);
    emitHomeHeroUpdated();
  }
}

export async function getHomeHeroBaseImages(): Promise<string[]> {
  try {
    const { data, error } = await driveRoutesSupabase
      .from('site_hero_settings')
      .select('id,base_images,updated_at')
      .eq('id', true)
      .maybeSingle<SiteHeroSettingsRow>();

    if (!error && data?.base_images && Array.isArray(data.base_images)) {
      const normalized = normalizeHeroImages(data.base_images);
      if (normalized.length > 0) {
        setLocalBaseImages(normalized);
        return normalized;
      }
    }

    const localImages = getLocalBaseImages();
    return localImages || HOME_HERO_DEFAULT_IMAGES;
  } catch (error) {
    console.error('Error loading hero base image config:', error);
    const localImages = getLocalBaseImages();
    return localImages || HOME_HERO_DEFAULT_IMAGES;
  }
}

export async function saveHomeHeroBaseImages(images: string[]): Promise<void> {
  const normalized = normalizeHeroImages(images);

  if (normalized.length === 0) {
    throw new Error('Debe existir al menos una imagen base para la portada.');
  }

  try {
    const { error } = await driveRoutesSupabase
      .from('site_hero_settings')
      .upsert(
        {
          id: true,
          base_images: normalized,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      throw error;
    }
  } catch (error) {
    console.warn('Could not persist hero base images in database, using local fallback:', error);
  }

  setLocalBaseImages(normalized);
  emitHomeHeroUpdated();
}
