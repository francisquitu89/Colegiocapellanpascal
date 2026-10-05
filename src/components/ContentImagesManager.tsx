import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Edit2, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { NewsImage } from '../lib/supabase';

interface ContentImagesManagerProps {
  images: NewsImage[];
  onImagesChange: (images: NewsImage[]) => void;
  bucketName?: string;
  folderName?: string;
}

export default function ContentImagesManager({ 
  images, 
  onImagesChange,
  bucketName = 'news-images',
  folderName = 'content'
}: ContentImagesManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages: NewsImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${folderName}/${Math.random()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        newImages.push({
          url: publicUrl,
          caption: '',
          position: images.length + newImages.length
        });
      }

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error al subir las imágenes');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm('¿Eliminar esta imagen?')) return;

    const image = images[index];
    try {
      // Extract filename from URL
      const urlParts = image.url.split('/');
      const fileName = urlParts.slice(-2).join('/'); // folder/filename.ext

      await supabase.storage
        .from(bucketName)
        .remove([fileName]);
    } catch (error) {
      console.error('Error deleting image:', error);
    }

    const newImages = images.filter((_, i) => i !== index);
    // Reorder positions
    newImages.forEach((img, idx) => img.position = idx);
    onImagesChange(newImages);
  };

  const handleEditCaption = (index: number) => {
    setEditingIndex(index);
    setEditCaption(images[index].caption);
  };

  const handleSaveCaption = () => {
    if (editingIndex === null) return;

    const newImages = [...images];
    newImages[editingIndex].caption = editCaption;
    onImagesChange(newImages);
    setEditingIndex(null);
    setEditCaption('');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    newImages.forEach((img, idx) => img.position = idx);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Imágenes en el Contenido
        </label>
        <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
          <Upload className="h-4 w-4" />
          <span>Subir Imágenes</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <p className="text-sm text-gray-600">
        Las imágenes aparecerán distribuidas a lo largo del texto de la noticia/editorial
      </p>

      {uploading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay imágenes agregadas</p>
          <p className="text-sm text-gray-500 mt-1">Sube imágenes para ambientar tu contenido</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="relative aspect-video">
                <img
                  src={image.url}
                  alt={image.caption || `Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {index > 0 && (
                    <button
                      onClick={() => handleMove(index, 'up')}
                      className="p-1 bg-white rounded shadow hover:bg-gray-100"
                      title="Mover arriba"
                    >
                      <MoveUp className="h-4 w-4" />
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      onClick={() => handleMove(index, 'down')}
                      className="p-1 bg-white rounded shadow hover:bg-gray-100"
                      title="Mover abajo"
                    >
                      <MoveDown className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 space-y-2">
                {editingIndex === index ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      placeholder="Escribe un subtítulo..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveCaption}
                        className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="flex-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 italic min-h-[20px]">
                      {image.caption || 'Sin subtítulo'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCaption(index)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Editar subtítulo</span>
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Las imágenes se mostrarán intercaladas en el contenido. Usa los subtítulos para agregar contexto o descripciones.
        </p>
      </div>
    </div>
  );
}
