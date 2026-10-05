import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Upload, FileText, Trash2 } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';
import { optimizeFile } from '../lib/fileOptimization';

interface CasinoManagementProps {
  onBack: () => void;
}

interface CasinoDocument {
  id?: number;
  title: string;
  file_url: string;
  file_type: string;
}

const CasinoManagement: React.FC<CasinoManagementProps> = ({ onBack }) => {
  const [documento, setDocumento] = useState<CasinoDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    fetchDocumento();
  }, []);

  const fetchDocumento = async () => {
    setLoading(true);
    try {
      const { data, error } = await driveRoutesSupabase
        .from('casino_menu')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setDocumento(data);
    } catch (error) {
      console.error('Error fetching documento:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<{ url: string; type: string }> => {
    // Optimizar archivo antes de subir
    const optimizedFile = await optimizeFile(file);
    console.log(`Archivo optimizado - Original: ${file.size} bytes, Optimizado: ${optimizedFile.size} bytes`);
    
    const fileExt = optimizedFile.name.split('.').pop()?.toLowerCase();
    const fileName = `casino/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await driveRoutesSupabase.storage
      .from('casino-files')
      .upload(fileName, optimizedFile, {
        cacheControl: '604800',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = driveRoutesSupabase.storage
      .from('casino-files')
      .getPublicUrl(fileName);

    const fileType = fileExt === 'pdf' ? 'pdf' : 'image';
    return { url: publicUrl, type: fileType };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setMessage('Solo se permiten archivos PDF, PNG o JPG');
      return;
    }

    setUploadingFile(true);
    try {
      const { url, type } = await uploadFile(file);
      setDocumento(prev => ({
        ...prev,
        title: prev?.title || 'Menú Casino',
        file_url: url,
        file_type: type
      }));
      setMessage('Archivo subido exitosamente');
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error al subir archivo');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSave = async () => {
    if (!documento || !documento.file_url) {
      setMessage('Por favor sube un archivo primero');
      return;
    }

    setLoading(true);
    try {
      // Delete old document if exists
      if (documento.id) {
        await driveRoutesSupabase.from('casino_menu').delete().neq('id', 0);
      } else {
        await driveRoutesSupabase.from('casino_menu').delete().neq('id', 0);
      }

      // Insert new document
      const { error } = await driveRoutesSupabase
        .from('casino_menu')
        .insert([{
          title: documento.title,
          file_url: documento.file_url,
          file_type: documento.file_type
        }]);

      if (error) throw error;
      setMessage('Menú actualizado exitosamente');
      fetchDocumento();
    } catch (error) {
      console.error('Error saving documento:', error);
      setMessage('Error al guardar menú');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar el menú actual?')) return;

    setLoading(true);
    try {
      await driveRoutesSupabase.from('casino_menu').delete().neq('id', 0);
      setDocumento(null);
      setMessage('Menú eliminado');
    } catch (error) {
      console.error('Error deleting documento:', error);
      setMessage('Error al eliminar menú');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al panel de administración
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Menú Casino</h1>
          <p className="text-gray-600">Sube el menú actual del casino (PDF o imagen)</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Menú Actual</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={documento?.title || 'Menú Casino'}
                onChange={(e) => setDocumento(prev => ({ ...prev!, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Ej: Menú Semanal Casino"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo del Menú (PDF, PNG o JPG)
              </label>
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-orange-500 transition-colors">
                  <div className="flex flex-col items-center justify-center space-y-3 text-gray-600">
                    <Upload className="w-12 h-12" />
                    <span className="text-lg">
                      {uploadingFile ? 'Subiendo...' : 'Haz clic para subir archivo'}
                    </span>
                    <span className="text-sm text-gray-500">
                      PDF, PNG o JPG (máx. 10MB)
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingFile}
                />
              </label>
            </div>

            {documento?.file_url && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">Archivo cargado</span>
                  </div>
                  <a
                    href={documento.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm underline"
                  >
                    Ver archivo
                  </a>
                </div>

                {documento.file_type === 'pdf' ? (
                  <iframe
                    src={documento.file_url}
                    className="w-full h-96 border border-gray-300 rounded"
                    title="Vista previa"
                  />
                ) : (
                  <img
                    src={documento.file_url}
                    alt="Vista previa"
                    className="w-full h-auto max-h-96 object-contain rounded"
                  />
                )}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                disabled={loading || uploadingFile || !documento?.file_url}
                className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Guardando...' : 'Guardar Menú'}</span>
              </button>
              
              {documento?.id && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoManagement;
