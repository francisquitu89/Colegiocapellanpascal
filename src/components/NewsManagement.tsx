import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Eye, Calendar, Image, Video, ArrowLeft } from 'lucide-react';
import { driveRoutesSupabase, supabase, NewsItem } from '../lib/supabase';
import NewsEditor from './NewsEditor';

interface NewsManagementProps {
  onBack: () => void;
}

const NewsManagement: React.FC<NewsManagementProps> = ({ onBack }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const [secondaryResult, primaryResult] = await Promise.allSettled([
        driveRoutesSupabase
          .from('news')
          .select('*')
          .order('date', { ascending: false }),
        supabase
          .from('news')
          .select('*')
          .order('date', { ascending: false }),
      ]);

      const secondaryNews = secondaryResult.status === 'fulfilled' && !secondaryResult.value.error
        ? (secondaryResult.value.data || [])
        : [];
      const primaryNews = primaryResult.status === 'fulfilled' && !primaryResult.value.error
        ? (primaryResult.value.data || [])
        : [];

      const mergedById = new Map<string, NewsItem>();
      primaryNews.forEach((item) => mergedById.set(item.id, item as NewsItem));
      secondaryNews.forEach((item) => mergedById.set(item.id, item as NewsItem));

      const mergedNews = Array.from(mergedById.values()).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setNews(mergedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      return;
    }

    try {
      const { error } = await driveRoutesSupabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setNews(news.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Error al eliminar la noticia');
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingNews(null);
    fetchNews();
  };

  const handleSaveSuccess = () => {
    setShowEditor(false);
    setEditingNews(null);
    fetchNews();
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
          <p className="mt-4 text-gray-600">Cargando noticias...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Noticias</h1>
            <p className="text-gray-600 mt-2">Administra las noticias del colegio</p>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Noticia</span>
          </button>
        </div>

        {/* News List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {news.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay noticias</h3>
              <p className="text-gray-500 mb-6">Comienza creando tu primera noticia</p>
              <button
                onClick={() => setShowEditor(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Crear Primera Noticia</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {news.map((item) => {
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
        <NewsEditor
          onClose={() => {
            setShowEditor(false);
            setEditingNews(null);
          }}
          onSave={handleSaveSuccess}
          editingNews={editingNews}
        />
      )}
    </div>
  );
};

export default NewsManagement;