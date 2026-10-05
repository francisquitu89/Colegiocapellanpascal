import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProyectoEducativoDocumentoProps {
  onBack: () => void;
}

const ProyectoEducativoDocumento: React.FC<ProyectoEducativoDocumentoProps> = ({ onBack }) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument = async () => {
    try {
      setLoading(true);
      setError(null);

      // Intentar cargar el documento desde Supabase Storage
      const { data, error: storageError } = await supabase.storage
        .from('images')
        .list('proyecto_educativo', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (storageError) {
        console.error('Error listing files:', storageError);
        setError('No se pudo cargar el documento');
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setError('No hay documento disponible. Por favor, suba uno desde el panel de administración.');
        setLoading(false);
        return;
      }

      // Obtener la URL pública del documento
      const fileName = data[0].name;
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(`proyecto_educativo/${fileName}`);

      if (urlData.publicUrl) {
        setDocumentUrl(urlData.publicUrl);
      } else {
        setError('No se pudo obtener la URL del documento');
      }
    } catch (err) {
      console.error('Error loading document:', err);
      setError('Error al cargar el documento');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Proyecto Educativo Institucional
            </h1>
            {documentUrl && (
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">Descargar PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Cargando documento...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md">
            <div className="flex items-start">
              <FileText className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Documento no disponible
                </h3>
                <p className="text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {documentUrl && !loading && (
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <iframe
              src={`${documentUrl}#toolbar=0`}
              className="w-full"
              style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}
              title="Proyecto Educativo"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProyectoEducativoDocumento;
