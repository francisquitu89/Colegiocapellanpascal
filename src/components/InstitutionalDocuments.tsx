import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Loader2, X, Maximize2 } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';
import { handleProtectedDownload } from '../lib/downloadRateLimit';
import {
  getDocumentDownloadUrl,
  getDocumentViewUrl,
  isInstitutionalDocumentRecent,
  mergeDocumentsWithProjections,
  type InstitutionalDocumentProjection,
  type ProjectedInstitutionalDocument,
} from '../lib/institutionalDocuments';

interface InstitutionalDocumentsProps {
  onBack: () => void;
}

type Document = ProjectedInstitutionalDocument;

const DOCUMENT_ROUTE_BASE = '/documentosinstitucionales';

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname || '/';
}

function getRouteSlugFromPath(pathname: string) {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath.startsWith('/documentos/')) {
    const legacySlug = normalizedPath.slice('/documentos/'.length).trim();
    return legacySlug || null;
  }

  if (!normalizedPath.startsWith(`${DOCUMENT_ROUTE_BASE}/`)) {
    return null;
  }

  const slug = normalizedPath.slice(`${DOCUMENT_ROUTE_BASE}/`.length).trim();
  return slug || null;
}

const InstitutionalDocuments: React.FC<InstitutionalDocumentsProps> = ({ onBack }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('Todos');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [requestedRouteSlug, setRequestedRouteSlug] = useState<string | null>(() => getRouteSlugFromPath(window.location.pathname));

  const categories = [
    { id: 'all', name: 'Todos', color: 'blue' },
    { id: 'Documentos de Matrícula 2026', name: 'Matrícula 2026', color: 'green' },
    { id: 'Documentos, protocolos y reglamentos del Colegio', name: 'Protocolos y Reglamentos', color: 'purple' },
    { id: 'Circulares', name: 'Circulares', color: 'indigo' },
    { id: 'Seguros escolares', name: 'Seguros Escolares', color: 'orange' },
    { id: 'Planes', name: 'Planes', color: 'amber' },
    { id: 'Listas útiles escolares', name: 'Listas útiles escolares', color: 'teal' },
    { id: 'Otros', name: 'Otros', color: 'gray' }
  ];

  useEffect(() => {
    setIsVisible(true);
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (!documents.length || !requestedRouteSlug) {
      return;
    }

    const matchingDocument = documents.find((doc) => doc.route_slug === requestedRouteSlug);
    if (matchingDocument) {
      setSelectedDocument(matchingDocument);
    }
  }, [documents, requestedRouteSlug]);

  useEffect(() => {
    const onPopState = () => {
      const routeSlug = getRouteSlugFromPath(window.location.pathname);
      setRequestedRouteSlug(routeSlug);

      if (!routeSlug) {
        setSelectedDocument(null);
        return;
      }

      const matchingDocument = documents.find((doc) => doc.route_slug === routeSlug);
      setSelectedDocument(matchingDocument || null);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const [secondaryResult, primaryResult] = await Promise.allSettled([
        driveRoutesSupabase
          .from('institutional_documents')
          .select('*')
          .order('category')
          .order('order_index'),
        supabase
          .from('institutional_documents')
          .select('*')
          .order('category')
          .order('order_index')
      ]);

      const secondaryData = secondaryResult.status === 'fulfilled' && !secondaryResult.value.error
        ? ((secondaryResult.value.data || []) as Document[]).map((doc) => ({
            ...doc,
            database_origin: 'N' as const,
          }))
        : [];

      const primaryData = primaryResult.status === 'fulfilled' && !primaryResult.value.error
        ? ((primaryResult.value.data || []) as Document[]).map((doc) => ({
            ...doc,
            database_origin: 'A' as const,
          }))
        : [];

      if (secondaryResult.status === 'rejected' && primaryResult.status === 'rejected') {
        throw new Error('No fue posible cargar documentos');
      }

      const { data: projectionData, error: projectionError } = await driveRoutesSupabase
        .from('institutional_document_projections')
        .select('*');

      if (projectionError) {
        // Keep main docs alive even if projection table isn't ready yet.
        console.warn('No se pudieron cargar proyecciones de documentos:', projectionError.message);
      }

      const merged = mergeDocumentsWithProjections(
        [...secondaryData, ...primaryData],
        (projectionData || []) as InstitutionalDocumentProjection[]
      );

      setDocuments(merged);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('image')) return '🖼️';
    return '📎';
  };

  const openDocument = (doc: Document) => {
    if (doc.open_in_fullscreen === false) {
      window.open(getDocumentViewUrl(doc), '_blank', 'noopener,noreferrer');
      return;
    }

    setSelectedDocument(doc);

    if (doc.route_slug) {
      window.history.pushState({}, '', `${DOCUMENT_ROUTE_BASE}/${doc.route_slug}`);
      setRequestedRouteSlug(doc.route_slug);
    }
  };

  const closeDocumentViewer = () => {
    setSelectedDocument(null);

    if (getRouteSlugFromPath(window.location.pathname)) {
      window.history.replaceState({}, '', '/documentosinstitucionales');
      setRequestedRouteSlug(null);
    }
  };

  const MATR_2025 = 'Documentos de Matrícula 2025';
  const MATR_2026 = 'Documentos de Matrícula 2026';
  const publicDocuments = documents.filter((doc) => !doc.is_hidden);

  let filteredDocuments: Document[] = publicDocuments;
  if (activeCategory !== 'all') {
    if (activeCategory === 'Listas útiles escolares') {
      // Filter documentos for listas útiles escolares and its subcategories
      if (activeSubcategory === 'Todos') {
        filteredDocuments = documents.filter(doc => (doc.category || '').includes('Listas útiles escolares'));
      } else {
        filteredDocuments = documents.filter(doc => {
          const c = doc.category || '';
          return (c.includes('Listas útiles escolares') && c.includes(activeSubcategory)) || c === activeSubcategory;
        });
      }
    } else if (activeCategory === MATR_2026) {
      // Treat 2025 and 2026 as the same category in the UI so existing documents appear under 2026
      filteredDocuments = documents.filter(doc => doc.category === MATR_2026 || doc.category === MATR_2025);
    } else {
      filteredDocuments = documents.filter(doc => doc.category === activeCategory);
    }
  }

  const sortDocuments = (docs: Document[]) => {
    return [...docs].sort((left, right) => {
      const leftRecent = isInstitutionalDocumentRecent(left);
      const rightRecent = isInstitutionalDocumentRecent(right);

      if (leftRecent !== rightRecent) {
        return leftRecent ? -1 : 1;
      }

      const leftOrder = Number.isFinite(left.order_index) ? left.order_index : Number.MAX_SAFE_INTEGER;
      const rightOrder = Number.isFinite(right.order_index) ? right.order_index : Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.title.localeCompare(right.title, 'es', { sensitivity: 'base' });
    });
  };

  filteredDocuments = sortDocuments(filteredDocuments);

  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    // Normalize old 2025 category to 2026 for display/grouping
    const key = doc.category === MATR_2025 ? MATR_2026 : doc.category;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'gray';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Documentos Institucionales
          </h1>
          <p className="text-gray-600 mt-2">Accede a todos los documentos oficiales del colegio</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className={`bg-white rounded-lg shadow-md p-4 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? `bg-${category.color}-600 text-white shadow-lg`
                    : `bg-${category.color}-100 text-${category.color}-700 hover:bg-${category.color}-200`
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          {activeCategory === 'Listas útiles escolares' && (
            <div className="flex flex-wrap gap-3 mt-4">
              {['Todos', 'Primer ciclo', 'Segundo ciclo', 'Tercer ciclo'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                    activeSubcategory === sub ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando documentos...</span>
          </div>
        ) : (
          /* Documents by Category */
          <div className="space-y-8">
            {Object.keys(groupedDocuments).length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No hay documentos disponibles en esta categoría</p>
              </div>
            ) : (
              Object.entries(groupedDocuments).map(([category, docs], index) => {
                const color = getCategoryColor(category);
                const recentDocuments = docs.filter((doc) => isInstitutionalDocumentRecent(doc));
                const regularDocuments = docs.filter((doc) => !isInstitutionalDocumentRecent(doc));
                return (
                  <div
                    key={category}
                    className={`transition-all duration-1000 delay-${(index + 2) * 100} ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                  >
                    <h2 className={`text-2xl font-bold text-${color}-700 mb-4 flex items-center`}>
                      <div className={`w-1 h-8 bg-${color}-600 mr-3 rounded`}></div>
                      {category}
                    </h2>

                    {recentDocuments.length > 0 && (
                      <div className="mb-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            Recientes
                          </div>
                          <span className="text-xs text-gray-500">Se muestran primero dentro de la categoría</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {recentDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-emerald-200 hover:border-emerald-300 group"
                            >
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <span className="text-3xl flex-shrink-0">{getFileIcon(doc.file_type)}</span>
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors break-words">
                                        {doc.title}
                                      </h3>
                                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                                        Reciente
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end" />
                              </div>

                              <div className="flex items-center justify-end gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => openDocument(doc)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                                  >
                                    <Maximize2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Ver archivo</span>
                                  </button>
                                  <button
                                    onClick={handleProtectedDownload(getDocumentDownloadUrl(doc), doc.file_name)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
                                  >
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Descargar</span>
                                  </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {regularDocuments.length > 0 && recentDocuments.length > 0 && (
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                          Documentos
                        </div>
                      </div>
                    )}

                    {regularDocuments.length > 0 && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {regularDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 group"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <span className="text-3xl flex-shrink-0">{getFileIcon(doc.file_type)}</span>
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors break-words">
                                  {doc.title}
                                </h3>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end" />
                            </div>

                            <div className="flex items-center justify-end gap-2 flex-shrink-0">
                                <button
                                  onClick={() => openDocument(doc)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                                >
                                  <Maximize2 className="w-4 h-4" />
                                  <span className="hidden sm:inline">Ver archivo</span>
                                </button>
                                <button
                                  onClick={handleProtectedDownload(getDocumentDownloadUrl(doc), doc.file_name)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
                                >
                                  <Download className="w-4 h-4" />
                                  <span className="hidden sm:inline">Descargar</span>
                                </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {selectedDocument && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm">
          <div className="h-full w-full flex flex-col">
            <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{selectedDocument.title}</h3>
                <p className="text-sm text-gray-500 truncate">{selectedDocument.file_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleProtectedDownload(getDocumentDownloadUrl(selectedDocument), selectedDocument.file_name)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
                <button
                  onClick={closeDocumentViewer}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                  Cerrar
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-950">
              <iframe
                src={getDocumentViewUrl(selectedDocument)}
                title={selectedDocument.title}
                className="w-full h-full"
                allow="autoplay; fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionalDocuments;
