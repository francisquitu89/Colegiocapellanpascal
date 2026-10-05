import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Trash2, Save, X, Upload, Loader2, FileText, AlertCircle, Link as LinkIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';
import { optimizeFile } from '../lib/fileOptimization';
import { buildDriveDownloadUrl, clearInstitutionalDocumentRecent, dedupeInstitutionalDocuments, isInstitutionalDocumentRecent, normalizeRouteSlug, setInstitutionalDocumentRecent, type DocumentSourceType } from '../lib/institutionalDocuments';

interface InstitutionalDocumentsManagementProps {
  onBack: () => void;
}

interface Document {
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
  source_type: DocumentSourceType;
  external_view_url: string | null;
  external_download_url: string | null;
  route_slug: string | null;
  open_in_fullscreen: boolean;
  is_hidden: boolean;
}

interface DocumentForm {
  category: string;
  title: string;
  description: string;
  file: File | null;
  order_index: number;
  subcategory?: string;
  source_type: DocumentSourceType;
  external_view_url: string;
  external_download_url: string;
  route_slug: string;
  open_in_fullscreen: boolean;
  is_hidden: boolean;
  is_recent: boolean;
}

const InstitutionalDocumentsManagement: React.FC<InstitutionalDocumentsManagementProps> = ({ onBack }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const documentsClients = [driveRoutesSupabase, supabase].filter((client, index, arr) => 
    index === 0 || client !== arr[0]  // Evitar duplicados si ambos clientes son iguales
  );

  const [formData, setFormData] = useState<DocumentForm>({
    category: 'Documentos de Matrícula 2026',
    title: '',
    description: '',
    file: null,
    order_index: 1,
    subcategory: 'Todos',
    source_type: 'storage',
    external_view_url: '',
    external_download_url: '',
    route_slug: '',
    open_in_fullscreen: true,
    is_hidden: false,
    is_recent: false
  });

  const categories = [
    'Documentos de Matrícula 2026',
    'Documentos, protocolos y reglamentos del Colegio',
    'Circulares',
    'Seguros escolares',
    'Planes',
    'Otros',
    'Listas útiles escolares'
  ];

  const getBaseCategory = (category: string) => {
    if (category.startsWith('Listas útiles escolares')) {
      return 'Listas útiles escolares';
    }

    return category;
  };

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

  const getDocumentsInCategory = (category: string) => {
    return sortDocuments(documents.filter((doc) => getBaseCategory(doc.category) === category));
  };

  const getRecentDocumentsInCategory = (category: string) => {
    return getDocumentsInCategory(category).filter((doc) => isInstitutionalDocumentRecent(doc));
  };

  const getRegularDocumentsInCategory = (category: string) => {
    return getDocumentsInCategory(category).filter((doc) => !isInstitutionalDocumentRecent(doc));
  };

  const normalizeCategoryOrder = async (category: string, orderedDocuments: Document[]) => {
    const updates = orderedDocuments.map((doc, index) =>
      driveRoutesSupabase
        .from('institutional_documents')
        .update({ order_index: index + 1 })
        .eq('id', doc.id)
    );

    const results = await Promise.all(updates);
    const updateError = results.find((result) => result.error)?.error;

    if (updateError) {
      throw updateError;
    }

    setSuccess(`Orden actualizado en ${category}`);
    fetchDocuments();
  };

  const moveDocument = async (doc: Document, direction: 'up' | 'down') => {
    const category = getBaseCategory(doc.category);
    const orderedDocuments = getRegularDocumentsInCategory(category);
    const currentIndex = orderedDocuments.findIndex((item) => item.id === doc.id);

    if (currentIndex === -1) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= orderedDocuments.length) {
      return;
    }

    const reorderedDocuments = [...orderedDocuments];
    [reorderedDocuments[currentIndex], reorderedDocuments[targetIndex]] = [reorderedDocuments[targetIndex], reorderedDocuments[currentIndex]];

    try {
      setError(null);
      setSuccess(null);
      await normalizeCategoryOrder(category, reorderedDocuments);
    } catch (error: any) {
      console.error('Error reordering document:', error);
      setError(error.message || 'Error al reordenar el documento');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const settledResults = await Promise.allSettled(
        documentsClients.map((client) =>
          client
            .from('institutional_documents')
            .select('*')
            .order('category')
            .order('order_index')
        )
      );

      const fetchedData = settledResults.flatMap((result) => {
        if (result.status !== 'fulfilled' || result.value.error) {
          return [] as Document[];
        }

        return (result.value.data || []) as Document[];
      });

      if (fetchedData.length === 0) throw new Error('No fue posible cargar documentos');

      setDocuments(dedupeInstitutionalDocuments(fetchedData as Document[]));
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Error al cargar los documentos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Optimizar archivo antes de subir
    const optimizedFile = await optimizeFile(file);
    console.log(`Archivo optimizado - Original: ${file.size} bytes, Optimizado: ${optimizedFile.size} bytes`);
    
    const fileExt = optimizedFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await driveRoutesSupabase.storage
      .from('institutional-documents')
      .upload(filePath, optimizedFile, {
        cacheControl: '31536000',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = driveRoutesSupabase.storage
      .from('institutional-documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const getStorageFilePathFromUrl = (fileUrl: string): string | null => {
    if (!fileUrl) return null;

    try {
      const url = new URL(fileUrl);
      const segments = url.pathname.split('/').filter(Boolean);
      return segments[segments.length - 1] || null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (formData.source_type === 'storage' && !editingId && !formData.file) {
      setError('Debe seleccionar un archivo para documentos internos');
      return;
    }

    if (formData.source_type === 'drive' && !formData.external_view_url.trim()) {
      setError('Debe ingresar el enlace de visualización de Google Drive');
      return;
    }

    try {
      setUploading(true);

      const existingDocument = editingId
        ? documents.find((doc) => doc.id === editingId)
        : null;

      let fileUrl = '';
      let fileName = `${formData.title}.gdrive`;
      let fileType = '';
      let fileSize: number | null = null;

      if (formData.source_type === 'storage') {
        if (formData.file) {
          fileUrl = await uploadFile(formData.file);
          fileName = formData.file.name;
          fileType = formData.file.type;
          fileSize = formData.file.size;
        } else if (existingDocument?.file_url) {
          fileUrl = existingDocument.file_url;
          fileName = existingDocument.file_name || fileName;
          fileType = existingDocument.file_type || fileType;
          fileSize = existingDocument.file_size ?? fileSize;
        } else {
          setError('No existe un archivo asociado a este documento para conservarlo al guardar.');
          return;
        }
      } else {
        fileUrl = formData.external_view_url.trim() || existingDocument?.file_url || existingDocument?.external_view_url || '';
        if (!fileUrl) {
          setError('Debe ingresar el enlace de visualización de Google Drive o conservar uno existente.');
          return;
        }
        fileName = `${formData.title}.gdrive`;
        fileType = 'application/vnd.google-apps.document';
        fileSize = null;
      }

      const normalizedRouteSlug = normalizeRouteSlug(formData.route_slug || formData.title);

      // compute final category value (include subcategory for listas útiles escolares)
      let finalCategory = formData.category;
      if (formData.category === 'Listas útiles escolares') {
        if (formData.subcategory && formData.subcategory !== 'Todos') {
          finalCategory = `Listas útiles escolares - ${formData.subcategory}`;
        } else {
          finalCategory = 'Listas útiles escolares';
        }
      }

      if (editingId) {
        // Update existing document
        const updateData: any = {
          category: finalCategory,
          title: formData.title,
          description: formData.description || null,
          file_url: fileUrl,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          order_index: formData.order_index,
          source_type: formData.source_type,
          external_view_url: formData.source_type === 'drive' ? formData.external_view_url.trim() : null,
          external_download_url: formData.source_type === 'drive' ? (formData.external_download_url.trim() || null) : null,
          is_recent: formData.is_recent,
          route_slug: normalizedRouteSlug || null,
          open_in_fullscreen: formData.open_in_fullscreen,
          is_hidden: formData.is_hidden,
          updated_at: new Date().toISOString()
        };

        const { error: updateError } = await driveRoutesSupabase
          .from('institutional_documents')
          .update(updateData)
          .eq('id', editingId);
        
        if (updateError) throw updateError;
        setInstitutionalDocumentRecent(editingId, formData.is_recent);
        setSuccess('Documento actualizado exitosamente');
      } else {
        // Insert new document
        const { data: insertedDocument, error } = await driveRoutesSupabase
          .from('institutional_documents')
          .insert([{ 
            category: finalCategory,
            title: formData.title,
            description: formData.description || null,
            file_url: fileUrl,
            file_name: fileName,
            file_type: fileType,
            file_size: fileSize,
            order_index: formData.order_index,
            source_type: formData.source_type,
            is_recent: formData.is_recent,
            external_view_url: formData.source_type === 'drive' ? formData.external_view_url.trim() : null,
            external_download_url: formData.source_type === 'drive' ? (formData.external_download_url.trim() || null) : null,
            route_slug: normalizedRouteSlug || null,
            open_in_fullscreen: formData.open_in_fullscreen,
            is_hidden: formData.is_hidden
          }])
          .select('id')
          .single();

        if (error) throw error;
        if (insertedDocument?.id) {
          setInstitutionalDocumentRecent(insertedDocument.id, formData.is_recent);
        }
        setSuccess('Documento agregado exitosamente');
      }

      // Reset form
      setFormData({
        category: 'Documentos de Matrícula 2026',
        title: '',
        description: '',
        file: null,
        order_index: 1,
        subcategory: 'Todos',
        source_type: 'storage',
        external_view_url: '',
        external_download_url: '',
        route_slug: '',
        open_in_fullscreen: true,
        is_hidden: false,
        is_recent: false
      });
      setIsEditing(false);
      setEditingId(null);
      fetchDocuments();
    } catch (error: any) {
      console.error('Error saving document:', error);
      setError(error.message || 'Error al guardar el documento');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (doc: Document) => {
    // Parse category for listas útiles escolares with optional subcategory
    let parsedCategory = doc.category;
    let parsedSub = 'Todos';
    if (doc.category && doc.category.startsWith('Listas útiles escolares')) {
      const parts = doc.category.split(' - ');
      parsedCategory = 'Listas útiles escolares';
      parsedSub = parts[1] || 'Todos';
    }

    setFormData({
      category: parsedCategory,
      title: doc.title,
      description: doc.description || '',
      file: null,
      order_index: doc.order_index,
      subcategory: parsedSub,
      source_type: doc.source_type || 'storage',
      external_view_url: doc.external_view_url || '',
      external_download_url: doc.external_download_url || '',
      route_slug: doc.route_slug || '',
      open_in_fullscreen: doc.open_in_fullscreen ?? true,
      is_hidden: doc.is_hidden ?? false,
      is_recent: isInstitutionalDocumentRecent(doc)
    });
    setEditingId(doc.id);
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este documento?')) return;

    try {
      const targetDocument = documents.find((doc) => doc.id === id);
      const storageFilePath = targetDocument?.source_type === 'storage'
        ? getStorageFilePathFromUrl(targetDocument.file_url)
        : null;

      const { error: deleteError } = await driveRoutesSupabase
        .from('institutional_documents')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      clearInstitutionalDocumentRecent(id);

      if (storageFilePath) {
        await driveRoutesSupabase.storage
          .from('institutional-documents')
          .remove([storageFilePath])
          .catch(err => console.warn('File deletion warning:', err));
      }

      setSuccess('Documento eliminado exitosamente');
      fetchDocuments();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      setError('Error al eliminar el documento');
    }
  };

  const handleCancel = () => {
    setFormData({
      category: 'Documentos de Matrícula 2026',
      title: '',
      description: '',
      file: null,
      order_index: 1,
      subcategory: 'Todos',
      source_type: 'storage',
      external_view_url: '',
      external_download_url: '',
      route_slug: '',
      open_in_fullscreen: true,
      is_hidden: false,
      is_recent: false
    });
    setIsEditing(false);
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  const orderedDocuments = sortDocuments(documents);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al panel de administración
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Gestión de Documentos Institucionales</h1>
          <p className="text-gray-600 mt-2">Administra los documentos oficiales del colegio</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <FileText className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Documento' : 'Agregar Nuevo Documento'}
            </h2>
            {isEditing && (
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orden
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: Math.max(1, parseInt(e.target.value || '1', 10) || 1) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            {/* Subcategory selector for Listas útiles escolares */}
            {formData.category === 'Listas útiles escolares' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategoría *
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {['Todos', 'Primer ciclo', 'Segundo ciclo', 'Tercer ciclo'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Documento *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Reglamento Interno 2025"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuente del documento
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, source_type: 'storage' })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.source_type === 'storage'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Archivo en Storage
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, source_type: 'drive' })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.source_type === 'drive'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Enlace de Google Drive
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Breve descripción del documento"
              />
            </div>

            {formData.source_type === 'storage' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivo {!editingId && '*'}
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5" />
                    <span>Seleccionar archivo</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                    />
                  </label>
                  {formData.file && (
                    <span className="text-sm text-gray-600">
                      {formData.file.name} ({formatFileSize(formData.file.size)})
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Formatos aceptados: PDF, Word, Excel, PowerPoint, Imágenes
                </p>
              </div>
            ) : (
              <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de visualización (Google Drive Docs o Slides) *
                  </label>
                  <input
                    type="url"
                    value={formData.external_view_url}
                    onChange={(e) => {
                      const viewUrl = e.target.value;
                      setFormData({
                        ...formData,
                        external_view_url: viewUrl,
                        external_download_url: viewUrl ? buildDriveDownloadUrl(viewUrl, null) : ''
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="https://docs.google.com/document/d/.../edit"
                    required={formData.source_type === 'drive'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de descarga (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.external_download_url}
                    onChange={(e) => setFormData({ ...formData, external_download_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="https://drive.google.com/uc?export=download&id=..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Si lo dejas vacío, se intentará generar automáticamente desde el enlace de visualización.
                  </p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ruta del documento
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.route_slug}
                    onChange={(e) => setFormData({ ...formData, route_slug: normalizeRouteSlug(e.target.value) })}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="reglamento-convivencia"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Se publicará como /documentosinstitucionales/tu-ruta. Si queda vacío, se genera desde el título.
                </p>
              </div>

              <div className="flex items-center mt-8 md:mt-0">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_recent: !formData.is_recent })}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    formData.is_recent
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {formData.is_recent ? 'Quitar reciente' : 'Poner como reciente'}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="inline-flex items-center gap-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.open_in_fullscreen}
                  onChange={(e) => setFormData({ ...formData, open_in_fullscreen: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                Abrir en visor de pantalla completa
              </label>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <label className="inline-flex items-start gap-3 text-sm text-amber-900">
                <input
                  type="checkbox"
                  checked={formData.is_hidden}
                  onChange={(e) => setFormData({ ...formData, is_hidden: e.target.checked })}
                  className="w-4 h-4 mt-0.5 text-amber-600 rounded"
                />
                <span>
                  <span className="font-semibold block">Ocultar en el listado público</span>
                  <span className="text-amber-800">
                    El documento no aparecerá en la sección pública, pero seguirá accesible por enlace directo.
                  </span>
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{editingId ? 'Actualizar' : 'Guardar'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Documentos Registrados</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Cargando documentos...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay documentos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibilidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Archivo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderedDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{doc.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                        {doc.description && (
                          <div className="text-sm text-gray-500">{doc.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${doc.source_type === 'drive' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {doc.source_type === 'drive' ? 'Drive' : 'Storage'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${doc.is_hidden ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-700'}`}>
                          {doc.is_hidden ? 'Oculto (solo link)' : 'Visible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isInstitutionalDocumentRecent(doc) ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                          {isInstitutionalDocumentRecent(doc) ? 'Reciente' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{doc.file_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{doc.route_slug || 'Sin ruta'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{formatFileSize(doc.file_size)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-8 text-center">{doc.order_index}</span>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => moveDocument(doc, 'up')}
                              disabled={isInstitutionalDocumentRecent(doc) || doc.order_index <= 1}
                              className="p-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Mover documento hacia arriba"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveDocument(doc, 'down')}
                              disabled={isInstitutionalDocumentRecent(doc) || doc.order_index >= getRegularDocumentsInCategory(getBaseCategory(doc.category)).length}
                              className="p-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Mover documento hacia abajo"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(doc)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionalDocumentsManagement;
