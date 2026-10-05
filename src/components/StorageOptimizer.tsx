import React, { useEffect, useState } from 'react';
import { ArrowLeft, HardDrive, Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw, Save, Link as LinkIcon } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';
import { optimizeFile } from '../lib/fileOptimization';
import {
  buildDriveDownloadUrl,
  mergeDocumentsWithProjections,
  normalizeRouteSlug,
  type DocumentSourceType,
  type InstitutionalDocumentProjection,
  type ProjectedInstitutionalDocument,
} from '../lib/institutionalDocuments';

interface StorageOptimizerProps {
  onBack: () => void;
}

interface OptimizationResult {
  fileName: string;
  originalSize: number;
  optimizedSize: number;
  saved: number;
  status: 'success' | 'error' | 'skipped';
  message: string;
}

interface FileItem {
  name: string;
  size: number;
  selected: boolean;
  cacheStatus: 'checking' | 'cached' | 'needs-cache' | 'unknown';
  cacheMaxAge?: number;
}

interface ManagedInstitutionalDocument {
  id: string;
  source_document_id: string | null;
  projection_id?: string;
  is_projection_orphan?: boolean;
  title: string;
  category: string;
  source_type: DocumentSourceType;
  file_url: string;
  file_name: string;
  external_view_url: string | null;
  external_download_url: string | null;
  route_slug: string | null;
  open_in_fullscreen: boolean;
  is_hidden: boolean;
}

interface PrimaryInstitutionalDocumentRow {
  id: string;
  title: string;
  category: string;
  file_url: string;
  file_name: string;
  source_type?: DocumentSourceType | null;
  external_view_url?: string | null;
  external_download_url?: string | null;
  route_slug?: string | null;
  open_in_fullscreen?: boolean | null;
  is_hidden?: boolean | null;
}

const parseCacheAges = (cacheControlHeader: string | null): { maxAge?: number; sMaxAge?: number; effectiveAge?: number } => {
  if (!cacheControlHeader) {
    return {};
  }

  const maxAgeMatch = cacheControlHeader.match(/(?:^|,)\s*max-age=(\d+)/i);
  const sMaxAgeMatch = cacheControlHeader.match(/(?:^|,)\s*s-maxage=(\d+)/i);

  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : undefined;
  const sMaxAge = sMaxAgeMatch ? parseInt(sMaxAgeMatch[1], 10) : undefined;

  // Para Cached Egress, s-maxage (caché compartida/CDN) es más representativo.
  const effectiveAge = sMaxAge ?? maxAge;

  return { maxAge, sMaxAge, effectiveAge };
};

const getCacheControlFromMetadata = (metadata: any): string | null => {
  if (!metadata || typeof metadata !== 'object') return null;

  const value = metadata.cacheControl ?? metadata.cache_control ?? metadata['cache-control'];
  return typeof value === 'string' ? value : null;
};

const StorageOptimizer: React.FC<StorageOptimizerProps> = ({ onBack }) => {
  const [selectedBucket, setSelectedBucket] = useState<string>('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [results, setResults] = useState<OptimizationResult[]>([]);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [showOnlyNeedsCache, setShowOnlyNeedsCache] = useState(false);
  const [documents, setDocuments] = useState<ManagedInstitutionalDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [savingDocumentIds, setSavingDocumentIds] = useState<Set<string>>(new Set());
  const [documentsMessage, setDocumentsMessage] = useState<string | null>(null);

  const bucketOptions = [
    { value: '', label: 'Selecciona un bucket...' },
    { value: 'news-images', label: 'Noticias (Imágenes)' },
    { value: 'ceal-photos', label: 'CEAL (Fotos)' },
    { value: 'pastoral-photos', label: 'Pastoral (Fotos)' },
    { value: 'biblioteca-files', label: 'Biblioteca (Archivos)' },
    { value: 'casino-files', label: 'Casino (Menús)' },
    { value: 'horarios-files', label: 'Horarios' },
    { value: 'institutional-documents', label: 'Documentos Institucionales' },
    { value: 'recursos-digitales-files', label: 'Recursos Digitales' }
  ];

  useEffect(() => {
    loadInstitutionalDocuments();
  }, []);

  const loadInstitutionalDocuments = async () => {
    setLoadingDocuments(true);
    setDocumentsMessage(null);

    try {
      const [secondaryResult, primaryResult] = await Promise.allSettled([
        driveRoutesSupabase
          .from('institutional_documents')
          .select('id,title,category,file_url,file_name,source_type,external_view_url,external_download_url,route_slug,open_in_fullscreen,is_hidden')
          .order('category')
          .order('title'),
        supabase
          .from('institutional_documents')
          .select('id,title,category,file_url,file_name,source_type,external_view_url,external_download_url,route_slug,open_in_fullscreen,is_hidden')
          .order('category')
          .order('title')
      ]);

      const secondaryData = secondaryResult.status === 'fulfilled' && !secondaryResult.value.error
        ? (secondaryResult.value.data || []) as PrimaryInstitutionalDocumentRow[]
        : [];

      const primaryData = primaryResult.status === 'fulfilled' && !primaryResult.value.error
        ? (primaryResult.value.data || []) as PrimaryInstitutionalDocumentRow[]
        : [];

      if (secondaryData.length === 0 && primaryData.length === 0) {
        throw new Error('No fue posible cargar documentos');
      }

      const { data: projectionData, error: projectionError } = await driveRoutesSupabase
        .from('institutional_document_projections')
        .select('*');

      if (projectionError) {
        console.warn('No se pudieron cargar proyecciones de documentos:', projectionError.message);
        setDocumentsMessage('Se cargaron documentos del proyecto principal. Falta acceso a proyecciones Drive en el proyecto secundario.');
      }

      const primaryRows = [...secondaryData, ...primaryData];
      const normalizedPrimary = primaryRows.map((doc) => ({
        ...doc,
        source_type: doc.source_type || 'storage',
        external_view_url: doc.external_view_url || null,
        external_download_url: doc.external_download_url || null,
        route_slug: doc.route_slug || null,
        open_in_fullscreen: doc.open_in_fullscreen ?? true,
        is_hidden: doc.is_hidden ?? false,
      }));

      const merged = mergeDocumentsWithProjections(
        normalizedPrimary as ProjectedInstitutionalDocument[],
        (projectionData || []) as InstitutionalDocumentProjection[]
      );

      setDocuments(
        merged.map((doc) => ({
          ...doc,
          source_type: doc.source_type ?? 'storage',
          external_view_url: doc.external_view_url ?? null,
          external_download_url: doc.external_download_url ?? null,
          route_slug: doc.route_slug ?? null,
          open_in_fullscreen: doc.open_in_fullscreen ?? true,
          is_hidden: doc.is_hidden ?? false,
          source_document_id: doc.source_document_id || (doc.is_projection_orphan ? null : doc.id),
          projection_id: doc.projection_id,
        }))
      );
    } catch (error) {
      console.error('Error loading institutional documents for optimizer:', error);
      setDocumentsMessage('No se pudieron cargar los documentos institucionales. Verifica que la migración esté aplicada.');
    } finally {
      setLoadingDocuments(false);
    }
  };

  const updateManagedDocumentField = <K extends keyof ManagedInstitutionalDocument>(
    id: string,
    field: K,
    value: ManagedInstitutionalDocument[K]
  ) => {
    setDocuments(prev => prev.map(doc => (
      doc.id === id ? { ...doc, [field]: value } : doc
    )));
  };

  const updateManagedDocumentDriveViewUrl = (id: string, viewUrl: string) => {
    setDocuments(prev => prev.map(doc => (
      doc.id === id
        ? {
            ...doc,
            external_view_url: viewUrl,
            external_download_url: viewUrl ? buildDriveDownloadUrl(viewUrl, null) : '',
          }
        : doc
    )));
  };

  const saveManagedDocument = async (doc: ManagedInstitutionalDocument) => {
    setDocumentsMessage(null);

    if (doc.source_type === 'drive' && !(doc.external_view_url || '').trim()) {
      setDocumentsMessage(`El documento "${doc.title}" necesita una URL de visualización de Drive.`);
      return;
    }

    setSavingDocumentIds(prev => new Set(prev).add(doc.id));

    try {
      const routeSlug = normalizeRouteSlug(doc.route_slug || doc.title);
      const payload = {
        source_document_id: doc.source_document_id,
        title: doc.title,
        category: doc.category,
        source_file_url: doc.file_url || null,
        source_file_name: doc.file_name || null,
        external_view_url: (doc.external_view_url || '').trim(),
        external_download_url: (doc.external_download_url || '').trim() || null,
        route_slug: routeSlug || null,
        open_in_fullscreen: doc.open_in_fullscreen,
        is_hidden: doc.is_hidden,
        updated_at: new Date().toISOString(),
      };

      if (!doc.projection_id && doc.source_document_id) {
        const { data: existingProjection } = await driveRoutesSupabase
          .from('institutional_document_projections')
          .select('id')
          .eq('source_document_id', doc.source_document_id)
          .maybeSingle();

        if (existingProjection?.id) {
          doc.projection_id = existingProjection.id;
        }
      }

      if (doc.projection_id) {
        const { error } = await driveRoutesSupabase
          .from('institutional_document_projections')
          .update(payload)
          .eq('id', doc.projection_id);

        if (error) throw error;
      } else {
        const { data, error } = await driveRoutesSupabase
          .from('institutional_document_projections')
          .insert([payload])
          .select('id')
          .single();

        if (error) throw error;

        if (data?.id) {
          doc.projection_id = data.id;
        }
      }

      setDocumentsMessage(`Configuración actualizada: ${doc.title}`);
      updateManagedDocumentField(doc.id, 'route_slug', routeSlug);
    } catch (error: any) {
      console.error('Error updating institutional document from optimizer:', error);
      setDocumentsMessage(error.message || `No se pudo actualizar ${doc.title}`);
    } finally {
      setSavingDocumentIds(prev => {
        const next = new Set(prev);
        next.delete(doc.id);
        return next;
      });
    }
  };

  const getCacheConfig = (bucketName: string): string => {
    // Configurar caché según el tipo de bucket
    if (bucketName === 'institutional-documents' || bucketName === 'horarios-files') {
      return '31536000'; // 1 año para documentos estáticos
    } else if (bucketName === 'casino-files') {
      return '604800'; // 1 semana para menús
    } else {
      return '2592000'; // 1 mes por defecto
    }
  };

  const loadFiles = async () => {
    if (!selectedBucket) {
      alert('Selecciona un bucket primero');
      return;
    }

    setLoadingFiles(true);
    setFiles([]);
    setResults([]);

    try {
      const { data: fileList, error: listError } = await supabase.storage
        .from(selectedBucket)
        .list('', { limit: 1000 });

      if (listError) throw listError;
      
      if (!fileList || fileList.length === 0) {
        alert('No hay archivos en este bucket');
        setLoadingFiles(false);
        return;
      }

      const expectedMaxAge = parseInt(getCacheConfig(selectedBucket), 10);

      // Cargar archivos y usar metadata primero para evitar falsos positivos por HEAD/CDN
      const formattedFiles: FileItem[] = fileList.map(file => ({
        name: file.name,
        size: file.metadata?.size || 0,
        selected: false,
        cacheStatus: (() => {
          const metadataCacheControl = getCacheControlFromMetadata(file.metadata);
          const { effectiveAge } = parseCacheAges(metadataCacheControl);
          if (effectiveAge === undefined) return 'checking' as const;
          return effectiveAge >= expectedMaxAge * 0.8 ? 'cached' as const : 'needs-cache' as const;
        })(),
        cacheMaxAge: (() => {
          const metadataCacheControl = getCacheControlFromMetadata(file.metadata);
          return parseCacheAges(metadataCacheControl).effectiveAge;
        })()
      }));

      setFiles(formattedFiles);

      // Verificar por HEAD solo los que no traen metadata util
      const batchSize = 5;
      const filesNeedingHeadCheck = fileList.filter(file => {
        const metadataCacheControl = getCacheControlFromMetadata(file.metadata);
        return parseCacheAges(metadataCacheControl).effectiveAge === undefined;
      });
      
      for (let i = 0; i < filesNeedingHeadCheck.length; i += batchSize) {
        const batch = filesNeedingHeadCheck.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (file) => {
          try {
            const { data: publicUrlData } = supabase.storage
              .from(selectedBucket)
              .getPublicUrl(file.name);

            // Hacer HEAD sin caché para evitar leer headers stale del navegador/CDN
            const response = await fetch(`${publicUrlData.publicUrl}?_cache_check=${Date.now()}`, {
              method: 'HEAD',
              cache: 'no-store'
            });
            const cacheControl = response.headers.get('cache-control');
            
            let status: 'cached' | 'needs-cache' = 'needs-cache';
            let maxAge: number | undefined = undefined;

            if (cacheControl) {
              const { effectiveAge } = parseCacheAges(cacheControl);
              if (effectiveAge !== undefined) {
                maxAge = effectiveAge;
                // Considerar "cached" si la caché efectiva (s-maxage o max-age) llega al 80% del esperado.
                if (effectiveAge >= expectedMaxAge * 0.8) {
                  status = 'cached';
                }
              }
            }

            setFiles(prev => prev.map(f => 
              f.name === file.name 
                ? { ...f, cacheStatus: status, cacheMaxAge: maxAge }
                : f
            ));
          } catch (error) {
            console.error(`Error checking cache for ${file.name}:`, error);
            setFiles(prev => prev.map(f => 
              f.name === file.name 
                ? { ...f, cacheStatus: 'unknown' as const }
                : f
            ));
          }
        }));
      }
    } catch (error) {
      console.error('Error loading files:', error);
      alert('Error al cargar archivos del bucket');
    } finally {
      setLoadingFiles(false);
    }
  };

  const toggleFileSelection = (fileName: string) => {
    setFiles(prev => prev.map(file => 
      file.name === fileName ? { ...file, selected: !file.selected } : file
    ));
  };

  const toggleSelectAll = () => {
    const allSelected = files.every(f => f.selected);
    setFiles(prev => prev.map(file => ({ ...file, selected: !allSelected })));
  };

  const optimizeSelected = async () => {
    const selectedFiles = files.filter(f => f.selected);
    
    if (selectedFiles.length === 0) {
      alert('Selecciona al menos un archivo para optimizar');
      return;
    }

    if (!confirm(`¿Optimizar ${selectedFiles.length} archivo(s) seleccionado(s)?\n\nEsto reemplazará los archivos con versiones optimizadas y cache configurado.`)) {
      return;
    }

    setOptimizing(true);
    setResults([]);
    setProgress(null);

    try {
      setProgress({ current: 0, total: selectedFiles.length });
      const optimizationResults: OptimizationResult[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setProgress({ current: i + 1, total: selectedFiles.length });

        try {
          // Detectar tipo de archivo
          const isImage = file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
          const isPdf = file.name.match(/\.pdf$/i);
          const isOfficeDoc = file.name.match(/\.(docx|xlsx|pptx|doc|xls|ppt)$/i);

          // Descargar archivo
          const { data: downloadData, error: downloadError } = await supabase.storage
            .from(selectedBucket)
            .download(file.name);

          if (downloadError) throw downloadError;

          const originalSize = downloadData.size;
          
          // Obtener configuración de caché para este bucket
          const cacheControl = getCacheConfig(selectedBucket);

          // Estrategia según tipo de archivo:
          if (isImage || isPdf) {
            // IMÁGENES y PDFs: Intentar optimizar
            const optimizedFile = await optimizeFile(downloadData as File);
            const optimizedSize = optimizedFile.size;
            const saved = originalSize - optimizedSize;

            // Re-subir con caché (siempre, incluso si no hubo optimización)
            const { error: uploadError } = await supabase.storage
              .from(selectedBucket)
              .upload(file.name, optimizedFile, { 
                upsert: true,
                cacheControl: cacheControl
              });

            if (uploadError) throw uploadError;

            if (saved > originalSize * 0.05) {
              optimizationResults.push({
                fileName: file.name,
                originalSize,
                optimizedSize,
                saved,
                status: 'success',
                message: `Reducido ${Math.round((saved / originalSize) * 100)}% + caché (${cacheControl}s)`
              });
            } else {
              optimizationResults.push({
                fileName: file.name,
                originalSize,
                optimizedSize: originalSize,
                saved: 0,
                status: 'success',
                message: `Caché configurado (${cacheControl}s) - sin compresión adicional`
              });
            }
          } else {
            // OTROS ARCHIVOS (docx, xlsx, etc): Solo configurar caché
            const { error: uploadError } = await supabase.storage
              .from(selectedBucket)
              .upload(file.name, downloadData, { 
                upsert: true,
                cacheControl: cacheControl,
                contentType: downloadData.type
              });

            if (uploadError) throw uploadError;

            optimizationResults.push({
              fileName: file.name,
              originalSize,
              optimizedSize: originalSize,
              saved: 0,
              status: 'success',
              message: `✓ Caché configurado (${cacheControl}s) - Tipo: ${isOfficeDoc ? 'Office' : 'otro'}`
            });
          }
        } catch (error: any) {
          console.error(`Error optimizing ${file.name}:`, error);
          optimizationResults.push({
            fileName: file.name,
            originalSize: file.size,
            optimizedSize: file.size,
            saved: 0,
            status: 'error',
            message: error.message || 'Error desconocido'
          });
        }
      }

      setResults(optimizationResults);
      
      // Desmarcar archivos procesados y actualizar estado de caché
      const successfulFiles = optimizationResults
        .filter(r => r.status === 'success')
        .map(r => r.fileName);
      
      setFiles(prev => prev.map(f => {
        if (selectedFiles.some(sf => sf.name === f.name)) {
          const wasSuccessful = successfulFiles.includes(f.name);
          return {
            ...f,
            selected: false,
            cacheStatus: wasSuccessful ? 'cached' as const : f.cacheStatus,
            cacheMaxAge: wasSuccessful ? parseInt(getCacheConfig(selectedBucket)) : f.cacheMaxAge
          };
        }
        return f;
      }));
      
      alert(`✅ Optimización completada para ${selectedFiles.length} archivo(s). Revisa los resultados abajo.`);
    } catch (error) {
      console.error('Error optimizing files:', error);
      alert('Error durante la optimización. Revisa la consola.');
    } finally {
      setOptimizing(false);
      setProgress(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">🔧 Optimizador de Storage</h1>
          <p className="text-gray-600 mt-2">
            Selecciona archivos individuales para optimizar y configurar caché
          </p>
        </div>

        {/* Section 0: Drive Configuration */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">0. Configuración Drive + Rutas</h2>
              <p className="text-sm text-gray-600 mt-1">
                Ajusta la URL de visualización de Drive y el slug público para documentos institucionales.
              </p>
            </div>
            <button
              onClick={loadInstitutionalDocuments}
              disabled={loadingDocuments || optimizing}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              {loadingDocuments ? 'Cargando...' : 'Actualizar listado'}
            </button>
          </div>

          {documentsMessage && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              {documentsMessage}
            </div>
          )}

          {loadingDocuments ? (
            <div className="flex items-center text-gray-600 py-4">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Cargando documentos institucionales...
            </div>
          ) : documents.length === 0 ? (
            <p className="text-sm text-gray-600 py-2">No hay documentos disponibles para configurar.</p>
          ) : (
            <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-1">
              {documents.map((doc) => {
                const isSaving = savingDocumentIds.has(doc.id);
                const isDrive = doc.source_type === 'drive';

                return (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{doc.title}</p>
                        <p className="text-xs text-gray-500">{doc.category}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${isDrive ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>
                        {isDrive ? 'Drive' : 'Storage'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">URL visualización Drive</label>
                        <input
                          type="url"
                          value={doc.external_view_url || ''}
                          onChange={(e) => updateManagedDocumentDriveViewUrl(doc.id, e.target.value)}
                          placeholder="https://drive.google.com/file/d/.../view"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Ruta pública (slug)</label>
                        <input
                          type="text"
                          value={doc.route_slug || ''}
                          onChange={(e) => updateManagedDocumentField(doc.id, 'route_slug', e.target.value)}
                          placeholder="reglamento-interno"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={doc.open_in_fullscreen}
                            onChange={(e) => updateManagedDocumentField(doc.id, 'open_in_fullscreen', e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600"
                          />
                          Abrir en vista completa
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-amber-800">
                          <input
                            type="checkbox"
                            checked={doc.is_hidden}
                            onChange={(e) => updateManagedDocumentField(doc.id, 'is_hidden', e.target.checked)}
                            className="w-4 h-4 rounded text-amber-600"
                          />
                          Ocultar del listado público
                        </label>
                      </div>

                      <button
                        onClick={() => saveManagedDocument(doc)}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Guardar
                          </>
                        )}
                      </button>
                    </div>

                    {doc.external_download_url && (
                      <a
                        href={doc.external_download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                      >
                        <LinkIcon className="w-3 h-3" />
                        Ver enlace de descarga generado
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bucket Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Selecciona el Bucket</h2>
          <div className="flex gap-4">
            <select
              value={selectedBucket}
              onChange={(e) => {
                setSelectedBucket(e.target.value);
                setFiles([]);
                setResults([]);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={optimizing || loadingFiles}
            >
              {bucketOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <button
              onClick={loadFiles}
              disabled={!selectedBucket || loadingFiles || optimizing}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              {loadingFiles ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Cargando...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Cargar Archivos</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cache Status Summary */}
        {files.length > 0 && files.every(f => f.cacheStatus !== 'checking') && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Resumen de Estado de Caché</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Optimizados</span>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {files.filter(f => f.cacheStatus === 'cached').length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-yellow-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-600">Necesitan optimización</span>
                </div>
                <p className="text-3xl font-bold text-yellow-600">
                  {files.filter(f => f.cacheStatus === 'needs-cache').length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <HardDrive className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Total de archivos</span>
                </div>
                <p className="text-3xl font-bold text-gray-700">
                  {files.length}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowOnlyNeedsCache(!showOnlyNeedsCache)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showOnlyNeedsCache
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showOnlyNeedsCache ? '✓ Mostrando solo sin caché' : 'Filtrar solo sin caché'}
              </button>
              {showOnlyNeedsCache && (
                <p className="text-sm text-gray-600">
                  Mostrando {files.filter(f => f.cacheStatus === 'needs-cache').length} de {files.length} archivos
                </p>
              )}
            </div>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                2. Selecciona Archivos ({files.filter(f => f.selected).length} de {showOnlyNeedsCache ? files.filter(f => f.cacheStatus === 'needs-cache').length : files.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFiles(prev => prev.map(f => ({
                      ...f,
                      selected: f.cacheStatus === 'needs-cache'
                    })));
                  }}
                  className="px-4 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors font-medium"
                >
                  ⚡ Seleccionar sin caché ({files.filter(f => f.cacheStatus === 'needs-cache').length})
                </button>
                <button
                  onClick={toggleSelectAll}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  {files.every(f => f.selected) ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <input
                        type="checkbox"
                        checked={files.length > 0 && files.every(f => f.selected)}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Archivo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamaño</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado Caché</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files
                    .filter(f => !showOnlyNeedsCache || f.cacheStatus === 'needs-cache')
                    .map((file) => (
                    <tr
                      key={file.name}
                      className={`hover:bg-gray-50 cursor-pointer ${file.selected ? 'bg-blue-50' : ''}`}
                      onClick={() => toggleFileSelection(file.name)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={file.selected}
                          onChange={() => toggleFileSelection(file.name)}
                          className="w-4 h-4 text-blue-600 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-md" title={file.name}>{file.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatBytes(file.size)}</td>
                      <td className="px-4 py-3">
                        {file.cacheStatus === 'checking' && (
                          <span className="inline-flex items-center space-x-1 text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-xs">Verificando...</span>
                          </span>
                        )}
                        {file.cacheStatus === 'cached' && (
                          <span className="inline-flex items-center space-x-1 text-green-600" title={`Caché configurado: ${file.cacheMaxAge}s`}>
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">✓ Optimizado</span>
                          </span>
                        )}
                        {file.cacheStatus === 'needs-cache' && (
                          <span className="inline-flex items-center space-x-1 text-yellow-600" title={file.cacheMaxAge ? `Caché actual: ${file.cacheMaxAge}s` : 'Sin caché configurado'}>
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">⚠ Necesita optimización</span>
                          </span>
                        )}
                        {file.cacheStatus === 'unknown' && (
                          <span className="text-xs text-gray-400">? Desconocido</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Optimize Button */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Ejecutar Optimización</h2>
            
            <button
              onClick={optimizeSelected}
              disabled={optimizing || files.filter(f => f.selected).length === 0}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {optimizing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Optimizando... {progress?.current || 0} de {progress?.total || 0}</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-5 h-5" />
                  <span>Optimizar {files.filter(f => f.selected).length} Archivo(s) Seleccionado(s)</span>
                </>
              )}
            </button>

            <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">💡 Optimización segura por archivo:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Solo se optimizan los archivos que selecciones ✅</li>
                    <li><strong>Todos los archivos</strong> reciben configuración de caché (reduce egreso 90-99%)</li>
                    <li>Imágenes: se optimizan a 1920x1080 max y 80% calidad + caché</li>
                    <li>PDFs: se validan y agregan caché (no se comprimen)</li>
                    <li>Office (docx, xlsx): se agrega caché (no se comprimen)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resultados de Optimización</h2>
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg flex items-start space-x-3 ${
                    result.status === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : result.status === 'error'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {result.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                  {result.status === 'error' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                  {result.status === 'skipped' && <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{result.fileName}</p>
                    <p className="text-sm text-gray-600">{result.message}</p>
                    {result.saved > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatBytes(result.originalSize)} → {formatBytes(result.optimizedSize)} 
                        (ahorrado: {formatBytes(result.saved)})
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageOptimizer;
