import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Calendar, Image, Video, ArrowLeft } from 'lucide-react';
import { supabase, EditorialItem } from '../lib/supabase';
import EditorialEditor from './EditorialEditor';

interface EditorialManagementProps {
  onBack: () => void;
}

const EditorialManagement: React.FC<EditorialManagementProps> = ({ onBack }) => {
  const [editorial, setEditorial] = useState<EditorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEditorial, setEditingEditorial] = useState<EditorialItem | null>(null);

  useEffect(() => {
    fetchEditorial();
  }, []);

  const fetchEditorial = async () => {
    try {
      const { data, error } = await supabase
        .from('editorial')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setEditorial(data || []);
    } catch (error) {
      console.error('Error fetching editorial:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (editorialItem: EditorialItem) => {
    setEditingEditorial(editorialItem);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este editorial?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('editorial')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEditorial(editorial.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting editorial:', error);
      alert('Error al eliminar el editorial');
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingEditorial(null);
    fetchEditorial();
  };

  const handleSaveSuccess = () => {
    setShowEditor(false);
    setEditingEditorial(null);
    fetchEditorial();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando editorial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al panel de administración
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Editorial</h1>
            <p className="text-gray-600 mt-2">Administra el contenido editorial del colegio</p>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Editorial</span>
          </button>
        </div>

        {/* Editorial List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {editorial.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay editorial</h3>
              <p className="text-gray-500 mb-6">Comienza creando tu primer editorial</p>
              <button
                onClick={() => setShowEditor(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Crear Primer Editorial</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {editorial.map((item) => {
                const images = Array.isArray(item.images) ? item.images : [];
                
                return (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(item.date)}</span>
                          </div>
                        </div>
                        
                        <div 
                          className="text-gray-600 text-sm line-clamp-2 mb-3"
                          dangerouslySetInnerHTML={{ 
                            __html: item.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' 
                          }}
                        />
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {images.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Image className="w-4 h-4" />
                              <span>{images.length} imagen{images.length !== 1 ? 'es' : ''}</span>
                            </div>
                          )}
                          {item.video_url && (
                            <div className="flex items-center space-x-1">
                              <Video className="w-4 h-4" />
                              <span>Video</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <EditorialEditor
          onClose={() => {
            setShowEditor(false);
            setEditingEditorial(null);
          }}
          onSave={handleSaveSuccess}
          editingEditorial={editingEditorial}
        />
      )}
    </div>
  );
};

export default EditorialManagement;