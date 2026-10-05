import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, X, Upload, FileText, Download } from 'lucide-react';
import { driveRoutesSupabase } from '../lib/supabase';

interface RecursosDigitalesManagementProps {
  onBack: () => void;
}

interface InstructivoClassroom {
  id?: number;
  title: string;
  file_url: string;
}

const RecursosDigitalesManagement: React.FC<RecursosDigitalesManagementProps> = ({ onBack }) => {
  const [instructivo, setInstructivo] = useState<InstructivoClassroom>({ title: '', file_url: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    fetchInstructivo();
  }, []);

  const fetchInstructivo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('instructivo_classroom')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setInstructivo(data);
    } catch (error) {
      console.error('Error fetching instructivo:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `instructivos/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('recursos-digitales-files')
      .upload(fileName, file, {
        cacheControl: '2592000',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('recursos-digitales-files')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      setMessage('Solo se permiten archivos PDF');
      return;
    }

    setUploadingFile(true);
    try {
      const fileUrl = await uploadFile(file);
      setInstructivo({ ...instructivo, file_url: fileUrl });
      setMessage('Archivo subido exitosamente');
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error al subir archivo');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSave = async () => {
    if (!instructivo.title || !instructivo.file_url) {
      setMessage('Por favor completa todos los campos y sube un archivo');
      return;
    }

    setLoading(true);
    try {
      if (instructivo.id) {
        // Update existing
        const { error } = await driveRoutesSupabase
          .from('instructivo_classroom')
          .upsert({
            title: instructivo.title,
            file_url: instructivo.file_url
          })
          .eq('id', instructivo.id);

        if (error) throw error;
        setMessage('Instructivo actualizado exitosamente');
      } else {
        // Insert new
        const { error } = await driveRoutesSupabase
          .from('instructivo_classroom')
          .insert([{
            title: instructivo.title,
            file_url: instructivo.file_url
          }]);

        if (error) throw error;
        setMessage('Instructivo guardado exitosamente');
      }
      
      fetchInstructivo();
    } catch (error) {
      console.error('Error saving instructivo:', error);
      setMessage('Error al guardar instructivo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!instructivo.id) return;
    if (!confirm('¿Estás seguro de eliminar este instructivo?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('instructivo_classroom')
        .delete()
        .eq('id', instructivo.id);

      if (error) throw error;
      setMessage('Instructivo eliminado');
      setInstructivo({ title: '', file_url: '' });
    } catch (error) {
      console.error('Error deleting instructivo:', error);
      setMessage('Error al eliminar instructivo');
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Recursos Digitales</h1>
          <p className="text-gray-600">Administra el instructivo de Google ClassRoom</p>
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
          <h2 className="text-2xl font-bold mb-6">Instructivo de ClassRoom</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Instructivo
              </label>
              <input
                type="text"
                value={instructivo.title}
                onChange={(e) => setInstructivo({ ...instructivo, title: e.target.value })}
                placeholder="Ej: Manual de Acceso a Google ClassRoom 2025"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo PDF del Instructivo
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-500 transition-colors">
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <Upload className="w-5 h-5" />
                      <span>{uploadingFile ? 'Subiendo...' : 'Haz clic para subir PDF'}</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingFile}
                  />
                </label>
              </div>
              {instructivo.file_url && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                  <FileText className="w-4 h-4" />
                  <span>Archivo cargado correctamente</span>
                  <a
                    href={instructivo.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Ver archivo
                  </a>
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSave}
                disabled={loading || uploadingFile}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Guardando...' : 'Guardar Instructivo'}</span>
              </button>
              {instructivo.id && (
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vista Previa */}
        {instructivo.id && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Vista Previa</h3>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                  <div>
                    <h4 className="font-bold text-gray-900">{instructivo.title}</h4>
                    <p className="text-sm text-gray-600">Manual de acceso a ClassRoom</p>
                  </div>
                </div>
                <a
                  href={instructivo.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Descargar</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Información */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📋 Notas Importantes</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex items-start">
              <span className="text-yellow-600 font-bold mr-2">•</span>
              <span>Los enlaces a ClassRoom y SchoolNet están integrados en la sección y no requieren configuración</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 font-bold mr-2">•</span>
              <span>Solo puedes subir un instructivo a la vez (el nuevo reemplaza al anterior)</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 font-bold mr-2">•</span>
              <span>El archivo debe ser en formato PDF</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecursosDigitalesManagement;
