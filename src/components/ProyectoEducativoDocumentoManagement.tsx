import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, FileText, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { driveRoutesSupabase } from '../lib/supabase';

interface ProyectoEducativoDocumentoManagementProps {
  onBack: () => void;
}

const ProyectoEducativoDocumentoManagement: React.FC<ProyectoEducativoDocumentoManagementProps> = ({ onBack }) => {
  const [currentDocument, setCurrentDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadCurrentDocument();
  }, []);

  const loadCurrentDocument = async () => {
    try {
      setLoading(true);
      const { data, error } = await driveRoutesSupabase.storage
        .from('images')
        .list('proyecto_educativo', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading document:', error);
        return;
      }

      if (data && data.length > 0) {
        setCurrentDocument(data[0]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea un PDF
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Solo se permiten archivos PDF' });
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'El archivo no debe superar los 10MB' });
      return;
    }

    try {
      setUploading(true);
      setMessage(null);

      // Eliminar documento anterior si existe
      if (currentDocument) {
        await driveRoutesSupabase.storage
          .from('images')
          .remove([`proyecto_educativo/${currentDocument.name}`]);
      }

      // Subir nuevo documento
      const fileName = `proyecto_educativo_${Date.now()}.pdf`;
      const { error: uploadError } = await driveRoutesSupabase.storage
        .from('images')
        .upload(`proyecto_educativo/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      setMessage({ type: 'success', text: 'Documento subido exitosamente' });
      await loadCurrentDocument();

      // Limpiar input
      event.target.value = '';
    } catch (err) {
      console.error('Error uploading file:', err);
      setMessage({ type: 'error', text: 'Error al subir el documento' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentDocument) return;

    if (!confirm('¿Está seguro de eliminar el documento actual?')) return;

    try {
      setLoading(true);
      const { error } = await driveRoutesSupabase.storage
        .from('images')
        .remove([`proyecto_educativo/${currentDocument.name}`]);

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Documento eliminado exitosamente' });
      setCurrentDocument(null);
    } catch (err) {
      console.error('Error deleting document:', err);
      setMessage({ type: 'error', text: 'Error al eliminar el documento' });
    } finally {
      setLoading(false);
    }
  };

  const getDocumentUrl = () => {
    if (!currentDocument) return null;
    const { data } = driveRoutesSupabase.storage
      .from('images')
      .getPublicUrl(`proyecto_educativo/${currentDocument.name}`);
    return data.publicUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al Panel
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Gestión Documento Proyecto Educativo
          </h1>
          <p className="text-gray-600 mt-2">
            Suba el documento PDF del Proyecto Educativo Institucional
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Upload className="w-6 h-6 mr-3 text-blue-600" />
            Subir Documento
          </h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
              >
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  {uploading ? 'Subiendo...' : 'Haga clic para seleccionar un archivo PDF'}
                </p>
                <p className="text-sm text-gray-500">
                  Máximo 10MB • Solo archivos PDF
                </p>
              </label>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Al subir un nuevo documento, el documento anterior será reemplazado automáticamente.
              </p>
            </div>
          </div>
        </div>

        {/* Current Document */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        )}

        {!loading && currentDocument && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-green-600" />
              Documento Actual
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Nombre del archivo:</p>
                    <p className="font-semibold text-gray-900 mb-3">{currentDocument.name}</p>
                    
                    <p className="text-sm text-gray-600 mb-1">Tamaño:</p>
                    <p className="font-semibold text-gray-900 mb-3">
                      {(currentDocument.metadata?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-1">Subido:</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(currentDocument.created_at).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleDelete}
                    className="ml-4 flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>

              <a
                href={getDocumentUrl() || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>Ver Documento</span>
              </a>
            </div>
          </div>
        )}

        {!loading && !currentDocument && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No hay documento cargado actualmente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProyectoEducativoDocumentoManagement;
