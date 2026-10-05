import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { optimizeFile, validateFile } from '../lib/fileOptimization';
import { getNewsImagePathFromUrl, removeNewsImages, uploadNewsImage } from '../lib/newsImagesStorage';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  images, 
  onImagesChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    // Optimizar archivo antes de subir
    const optimizedFile = await optimizeFile(file);
    
    const fileExt = optimizedFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `news/${fileName}`;

    console.log('Uploading file:', fileName, 'Original:', file.size, 'Optimized:', optimizedFile.size, 'bytes');

    const { publicUrl } = await uploadNewsImage(filePath, optimizedFile, {
      cacheControl: '3600',
      upsert: false
    });

    console.log('Upload successful:', filePath);
    console.log('Public URL:', publicUrl);
    return publicUrl;
  };

  const handleFileSelect = async (files: FileList) => {
    const filesToUpload = Array.from(files);

    // Validate file types and sizes using utility
    const validFiles = filesToUpload.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      const validation = validateFile(file, 10 * 1024 * 1024, validTypes); // 10MB max antes de optimizar

      if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = validFiles.map(uploadImage);
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const newImages = [...images, ...uploadedUrls];
      onImagesChange(newImages);
      
      console.log('All uploads completed:', uploadedUrls);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Error al subir imágenes: ${error.message || 'Error desconocido'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    // Try to delete from storage if it's a Supabase URL
    if (imageUrl.includes('supabase.co')) {
      try {
        const filePath = getNewsImagePathFromUrl(imageUrl);

        if (filePath) {
          await removeNewsImages([filePath]);
          console.log('Image deleted from storage:', filePath);
        }
      } catch (error) {
        console.error('Error deleting image from storage:', error);
      }
    }
    
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragOver 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        
        <label 
          htmlFor="image-upload" 
          className={`cursor-pointer ${uploading ? 'cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
            
            <div className="text-sm text-gray-600">
              {uploading ? (
                <span>Subiendo imágenes...</span>
              ) : (
                <>
                  <span className="font-medium text-red-600">Haz clic para subir</span>
                  <span> o arrastra y suelta</span>
                </>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              PNG, JPG, GIF, WebP, SVG hasta 5MB
            </div>
          </div>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Error loading image:', image);
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
              
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                title="Eliminar imagen"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* URL Input Fallback */}
      <div className="border-t pt-4">
        <details className="group">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-2">
            <ImageIcon className="w-4 h-4" />
            <span>O agregar imagen por URL</span>
          </summary>
          
          <div className="mt-3 flex space-x-2">
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  const url = input.value.trim();
                  if (url) {
                    onImagesChange([...images, url]);
                    input.value = '';
                  }
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                const url = input.value.trim();
                if (url) {
                  onImagesChange([...images, url]);
                  input.value = '';
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              Agregar
            </button>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ImageUploader;