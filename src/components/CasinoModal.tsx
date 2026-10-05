import React, { useState, useEffect } from 'react';
import { X, Download, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { handleProtectedDownload } from '../lib/downloadRateLimit';

interface CasinoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CasinoDocument {
  id: number;
  title: string;
  file_url: string;
  file_type: string;
}

const CasinoModal: React.FC<CasinoModalProps> = ({ isOpen, onClose }) => {
  const [documento, setDocumento] = useState<CasinoDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchDocumento();
    }
  }, [isOpen]);

  const fetchDocumento = async () => {
    try {
      const { data, error } = await supabase
        .from('casino_menu')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      if (data) setDocumento(data);
    } catch (error) {
      console.error('Error fetching documento:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Menú Casino
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-600"></div>
              </div>
            ) : documento ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {documento.title}
                  </h3>
                  <button
                    onClick={handleProtectedDownload(documento.file_url, documento.title)}
                    className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Descargar</span>
                  </button>
                </div>

                {/* Render based on file type */}
                {documento.file_type === 'pdf' ? (
                  <iframe
                    src={documento.file_url}
                    className="w-full h-[70vh] border border-gray-300 rounded-lg"
                    title="Menú Casino"
                  />
                ) : (
                  <img
                    src={documento.file_url}
                    alt="Menú Casino"
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg border border-gray-300"
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-20">
                <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No hay menú disponible en este momento
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoModal;
