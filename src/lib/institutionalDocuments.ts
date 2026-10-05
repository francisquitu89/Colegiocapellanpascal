export type DocumentSourceType = 'storage' | 'drive';
export type DocumentDatabaseOrigin = 'A' | 'N';

const RECENT_DOCUMENT_IDS_STORAGE_KEY = 'institutional-documents:recent-document-ids';

export interface InstitutionalDocumentRecord {
  id: string;
  category: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number | null;
  order_index: number;
  created_at: string;
  source_type?: DocumentSourceType | null;
  external_view_url?: string | null;
  external_download_url?: string | null;
  route_slug?: string | null;
  open_in_fullscreen?: boolean | null;
  is_hidden?: boolean | null;
  database_origin?: DocumentDatabaseOrigin | null;
}

export interface InstitutionalDocumentProjection {
  id: string;
  source_document_id: string | null;
  title: string;
  category: string;
  source_file_url: string | null;
  source_file_name: string | null;
  external_view_url: string;
  external_download_url: string | null;
  route_slug: string | null;
  open_in_fullscreen: boolean;
  is_hidden: boolean;
}

export interface ProjectedInstitutionalDocument extends InstitutionalDocumentRecord {
  projection_id?: string;
  source_document_id?: string | null;
  is_projection_orphan?: boolean;
}

const LEGACY_SUPABASE_HOST = 'idhwoewtblzebdxtlkuu.supabase.co';
const PRIMARY_SUPABASE_HOST = 'ntncdusmihemyaqrzajm.supabase.co';

const DRIVE_ID_PATTERNS = [
  /\/d\/([a-zA-Z0-9_-]{20,})/,
  /[?&]id=([a-zA-Z0-9_-]{20,})/,
] as const;

export function normalizeRouteSlug(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function extractDriveId(url: string): string | null {
  for (const pattern of DRIVE_ID_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export function buildDrivePreviewUrl(url: string): string {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return '';
  }

  if (trimmedUrl.includes('/document/d/')) {
    const id = extractDriveId(trimmedUrl);
    return id ? `https://docs.google.com/document/d/${id}/preview` : trimmedUrl;
  }

  if (trimmedUrl.includes('/presentation/d/')) {
    const id = extractDriveId(trimmedUrl);
    return id ? `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false&delayms=3000` : trimmedUrl;
  }

  const id = extractDriveId(trimmedUrl);
  return id ? `https://drive.google.com/file/d/${id}/preview` : trimmedUrl;
}

export function buildDriveDownloadUrl(viewUrl: string, configuredDownloadUrl?: string | null): string {
  if (configuredDownloadUrl?.trim()) {
    return configuredDownloadUrl.trim();
  }

  const id = extractDriveId(viewUrl);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : viewUrl;
}

export function getDocumentViewUrl(doc: InstitutionalDocumentRecord): string {
  if (doc.source_type === 'drive') {
    return buildDrivePreviewUrl(doc.external_view_url || doc.file_url);
  }

  return doc.file_url;
}

export function getDocumentDownloadUrl(doc: InstitutionalDocumentRecord): string {
  if (doc.source_type === 'drive') {
    return buildDriveDownloadUrl(doc.external_view_url || doc.file_url, doc.external_download_url);
  }

  return doc.file_url;
}

function readRecentDocumentIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(RECENT_DOCUMENT_IDS_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
  } catch {
    return [];
  }
}

function writeRecentDocumentIds(documentIds: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(RECENT_DOCUMENT_IDS_STORAGE_KEY, JSON.stringify(documentIds));
}

import { driveRoutesSupabase } from './supabase';

export async function persistInstitutionalDocumentRecent(documentId: string, isRecent: boolean) {
  try {
    await driveRoutesSupabase
      .from('institutional_documents')
      .update({ is_recent: isRecent, updated_at: new Date().toISOString() })
      .eq('id', documentId);
  } catch (err) {
    console.warn('Error persisting is_recent to Supabase:', err);
  }
}

export function isInstitutionalDocumentRecent(doc: Pick<InstitutionalDocumentRecord, 'id' | 'is_recent'>): boolean {
  // Prefer server-side flag when available
  if (typeof (doc as any).is_recent === 'boolean') {
    return Boolean((doc as any).is_recent);
  }

  return readRecentDocumentIds().includes(doc.id);
}

export function setInstitutionalDocumentRecent(documentId: string, isRecent: boolean) {
  const currentIds = readRecentDocumentIds();
  const nextIds = isRecent
    ? Array.from(new Set([...currentIds, documentId]))
    : currentIds.filter((id) => id !== documentId);

  writeRecentDocumentIds(nextIds);

  // Fire-and-forget: persist to Supabase so incognito / other browsers see it
  if (typeof window !== 'undefined') {
    void persistInstitutionalDocumentRecent(documentId, isRecent);
  }
}

export function clearInstitutionalDocumentRecent(documentId: string) {
  setInstitutionalDocumentRecent(documentId, false);
}

export function getDocumentDatabaseOrigin(doc: InstitutionalDocumentRecord): DocumentDatabaseOrigin {
  if (doc.database_origin === 'A' || doc.database_origin === 'N') {
    return doc.database_origin;
  }

  const searchableValues = [doc.external_view_url, doc.external_download_url, doc.file_url]
    .filter((value): value is string => Boolean(value));

  if (searchableValues.some((value) => value.includes(LEGACY_SUPABASE_HOST))) {
    return 'A';
  }

  if (searchableValues.some((value) => value.includes(PRIMARY_SUPABASE_HOST))) {
    return 'N';
  }

  if (doc.projection_id || doc.source_type === 'drive') {
    return 'N';
  }

  return 'A';
}

export function dedupeInstitutionalDocuments<T extends InstitutionalDocumentRecord>(documents: T[]): T[] {
  const seen = new Set<string>();

  return documents.filter((doc) => {
    if (!doc.id || seen.has(doc.id)) {
      return false;
    }

    seen.add(doc.id);
    return true;
  });
}

export function mergeDocumentsWithProjections(
  primaryDocuments: InstitutionalDocumentRecord[],
  projections: InstitutionalDocumentProjection[]
): ProjectedInstitutionalDocument[] {
  const uniquePrimaryDocuments = dedupeInstitutionalDocuments(primaryDocuments);
  const projectionBySourceId = new Map<string, InstitutionalDocumentProjection>();
  const primaryIds = new Set(uniquePrimaryDocuments.map((doc) => doc.id));

  for (const projection of projections) {
    if (projection.source_document_id) {
      projectionBySourceId.set(projection.source_document_id, projection);
    }
  }

  const mergedPrimary = uniquePrimaryDocuments
    .filter((doc) => !(doc.is_hidden ?? false))
    .map((doc) => {
      const projection = projectionBySourceId.get(doc.id);

      if (!projection) {
        return {
          ...doc,
          source_type: doc.source_type || 'storage',
          open_in_fullscreen: doc.open_in_fullscreen ?? true,
          is_hidden: doc.is_hidden ?? false,
          is_projection_orphan: false,
          source_document_id: doc.id,
          database_origin: doc.database_origin ?? null,
        } satisfies ProjectedInstitutionalDocument;
      }

      return {
        ...doc,
        source_type: 'drive',
        external_view_url: projection.external_view_url,
        external_download_url: projection.external_download_url,
        route_slug: projection.route_slug,
        open_in_fullscreen: projection.open_in_fullscreen,
        is_hidden: Boolean(projection.is_hidden) || Boolean(doc.is_hidden),
        projection_id: projection.id,
        source_document_id: doc.id,
        is_projection_orphan: false,
        database_origin: doc.database_origin ?? 'N',
      } satisfies ProjectedInstitutionalDocument;
    });

  const orphanProjections = projections
    .filter((projection) => !projection.is_hidden)
    .filter((projection) => !projection.source_document_id || !primaryIds.has(projection.source_document_id))
    .map((projection) => {
      const syntheticId = `projection-${projection.id}`;

      return {
        id: syntheticId,
        category: projection.category,
        title: projection.title,
        description: null,
        file_url: projection.external_view_url,
        file_name: projection.source_file_name || `${projection.title}.gdrive`,
        file_type: 'application/vnd.google-apps.document',
        file_size: null,
        order_index: 0,
        created_at: new Date().toISOString(),
        source_type: 'drive',
        external_view_url: projection.external_view_url,
        external_download_url: projection.external_download_url,
        route_slug: projection.route_slug,
        open_in_fullscreen: projection.open_in_fullscreen,
        is_hidden: projection.is_hidden,
        projection_id: projection.id,
        source_document_id: projection.source_document_id,
        is_projection_orphan: true,
        database_origin: 'N',
      } satisfies ProjectedInstitutionalDocument;
    });

  return [...mergedPrimary, ...orphanProjections];
}
