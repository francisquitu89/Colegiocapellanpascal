import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, Plus, X, Upload, FileText, Download, Edit, Clock } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';
import { optimizeFile } from '../lib/fileOptimization';

interface HorariosManagementProps {
  onBack: () => void;
}

interface DocumentoHorario {
  id?: number;
  title: string;
  file_url: string;
  year: string;
  categoria: string;
}

const HorariosManagement: React.FC<HorariosManagementProps> = ({ onBack }) => {
  const [documentos, setDocumentos] = useState<DocumentoHorario[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingDoc, setEditingDoc] = useState<DocumentoHorario | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const categorias = [
    'Horarios Primer Ciclo',
    'Horarios Segundo Ciclo',
    'Horarios Enseñanza Media Menor',
    'Horarios Educación Media Superior',
    'Horarios ACLEs'
  ];

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await driveRoutesSupabase
        .from('horarios')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      if (data) setDocumentos(data);
    } catch (error) {
      console.error('Error fetching documentos:', error);
      setMessage('Error al cargar documentos');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Optimizar archivo antes de subir
    const optimizedFile = await optimizeFile(file);
    console.log(`Archivo optimizado - Original: ${file.size} bytes, Optimizado: ${optimizedFile.size} bytes`);
    
    const fileExt = optimizedFile.name.split('.').pop();
    const fileName = `horarios/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await driveRoutesSupabase.storage
      .from('horarios-files')
      .upload(fileName, optimizedFile, {
        cacheControl: '31536000',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = driveRoutesSupabase.storage
      .from('horarios-files')
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
      if (editingDoc) {
        setEditingDoc({ ...editingDoc, file_url: fileUrl });
      }
      setMessage('Archivo subido exitosamente');
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error al subir archivo');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveDoc = async () => {
    if (!editingDoc) return;

    if (!editingDoc.title || !editingDoc.year || !editingDoc.categoria || !editingDoc.file_url) {
      setMessage('Por favor completa todos los campos y sube un archivo');
      return;
    }

    setLoading(true);
    try {
      if (editingDoc.id) {
        const { error } = await driveRoutesSupabase
          .from('horarios')
          .upsert({
            title: editingDoc.title,
            year: editingDoc.year,
            categoria: editingDoc.categoria,
            file_url: editingDoc.file_url
          })
          .eq('id', editingDoc.id);

        if (error) throw error;
        setMessage('Documento actualizado exitosamente');
      } else {
        const { error } = await driveRoutesSupabase
          .from('horarios')
          .insert([{
            title: editingDoc.title,
            year: editingDoc.year,
            categoria: editingDoc.categoria,
            file_url: editingDoc.file_url
          }]);

        if (error) throw error;
        setMessage('Documento creado exitosamente');
      }
      
      setEditingDoc(null);
      fetchDocumentos();
    } catch (error) {
      console.error('Error saving documento:', error);
      setMessage('Error al guardar documento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoc = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este documento?')) return;

    setLoading(true);
    try {
      const { error } = await driveRoutesSupabase
        .from('horarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage('Documento eliminado');
      fetchDocumentos();
    } catch (error) {
      console.error('Error deleting documento:', error);
      setMessage('Error al eliminar documento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al panel de administración
        </button>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="w-10 h-10 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Gestión de Horarios</h1>
          </div>
          <p className="text-gray-600">Administra los horarios escolares por ciclo educativo</p>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Documentos de Horarios</h2>
            <button
              onClick={() => setEditingDoc({
                title: '',
                file_url: '',
                year: new Date().getFullYear().toString(),
                categoria: 'Horarios Primer Ciclo'
              })}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Horario</span>
            </button>
          </div>

          {/* Formulario de Edición */}
          {editingDoc && (
            <div className="mb-6 p-6 bg-green-50 rounded-lg border-2 border-green-500">
              <h3 className="text-lg font-semibold mb-4">
                {editingDoc.id ? 'Editar Horario' : 'Nuevo Horario'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Documento
                  </label>
                  <input
                    type="text"
                    value={editingDoc.title}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: Horario 1° Básico - Primer Semestre 2025"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año
                    </label>
                    <input
                      type="text"
                      value={editingDoc.year}
                      onChange={(e) => setEditingDoc({ ...editingDoc, year: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="2025"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría de Horario
                    </label>
                    <select
                      value={editingDoc.categoria}
                      onChange={(e) => setEditingDoc({ ...editingDoc, categoria: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo PDF
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
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
                  {editingDoc.file_url && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                      <FileText className="w-4 h-4" />
                      <span>Archivo cargado correctamente</span>
                      <a
                        href={editingDoc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Ver archivo
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveDoc}
                    disabled={loading || uploadingFile}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Guardando...' : 'Guardar Horario'}</span>
                  </button>
                  <button
                    onClick={() => setEditingDoc(null)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Documentos */}
          <div className="space-y-4">
            {documentos.length > 0 ? (
              documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-lg text-gray-900">{doc.title}</h3>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                          {doc.categoria}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                          {doc.year}
                        </span>
                      </div>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <Download className="w-4 h-4" />
                        <span>Ver/Descargar PDF</span>
                      </a>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setEditingDoc(doc)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => doc.id && handleDeleteDoc(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No hay horarios registrados</p>
                <p className="text-sm mt-2">Haz clic en "Nuevo Horario" para agregar uno</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorariosManagement;
