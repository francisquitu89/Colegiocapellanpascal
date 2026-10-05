import { useState, useEffect } from 'react'
import { Upload, Trash2, Star, StarOff, AlignLeft, AlignCenter, AlignRight, MoveUp, MoveDown, Edit2, Save, X } from 'lucide-react'
import type { ContentImage } from '../lib/contentImages'
import { getNewsImagePathFromUrl, removeNewsImages, uploadNewsImage } from '../lib/newsImagesStorage'
import { 
  fetchContentImages, 
  saveContentImage, 
  updateContentImage, 
  deleteContentImage,
  setPrimaryImage 
} from '../lib/contentImages'

interface AdvancedImageManagerProps {
  contentId: string
  contentType: 'news' | 'editorial'
  onImagesChange?: () => void
}

export default function AdvancedImageManager({
  contentId,
  contentType,
  onImagesChange
}: AdvancedImageManagerProps) {
  const [images, setImages] = useState<ContentImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({
    alt_text: '',
    alignment: 'center' as 'left' | 'right' | 'center',
    position_in_content: 1
  })

  useEffect(() => {
    if (contentId) {
      loadImages()
    }
  }, [contentId])

  const loadImages = async () => {
    const fetchedImages = await fetchContentImages(contentId)
    setImages(fetchedImages)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `content/${contentType}/${Math.random()}.${fileExt}`

        const { publicUrl } = await uploadNewsImage(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

        // Save to content_images table
        await saveContentImage({
          content_id: contentId,
          content_type: contentType,
          url: publicUrl,
          alt_text: '',
          position_in_content: images.length + i + 1,
          alignment: 'center',
          is_primary: images.length === 0 && i === 0 // First image is primary
        })
      }

      await loadImages()
      if (onImagesChange) onImagesChange()
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Error al subir las imágenes')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (image: ContentImage) => {
    if (!confirm('¿Eliminar esta imagen?')) return

    try {
      // Delete from storage
      const fileName = getNewsImagePathFromUrl(image.url)

      if (fileName) {
        await removeNewsImages([fileName])
      }

      // Delete from database
      await deleteContentImage(image.id)
      await loadImages()
      if (onImagesChange) onImagesChange()
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error al eliminar la imagen')
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    const success = await setPrimaryImage(contentId, imageId)
    if (success) {
      await loadImages()
      if (onImagesChange) onImagesChange()
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return

    const currentImage = images[index]
    const previousImage = images[index - 1]

    await updateContentImage(currentImage.id, { position_in_content: index })
    await updateContentImage(previousImage.id, { position_in_content: index + 1 })
    
    await loadImages()
    if (onImagesChange) onImagesChange()
  }

  const handleMoveDown = async (index: number) => {
    if (index === images.length - 1) return

    const currentImage = images[index]
    const nextImage = images[index + 1]

    await updateContentImage(currentImage.id, { position_in_content: index + 2 })
    await updateContentImage(nextImage.id, { position_in_content: index + 1 })
    
    await loadImages()
    if (onImagesChange) onImagesChange()
  }

  const startEdit = (image: ContentImage) => {
    setEditingId(image.id)
    setEditData({
      alt_text: image.alt_text || '',
      alignment: image.alignment,
      position_in_content: image.position_in_content
    })
  }

  const saveEdit = async () => {
    if (!editingId) return

    await updateContentImage(editingId, editData)
    setEditingId(null)
    await loadImages()
    if (onImagesChange) onImagesChange()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({ alt_text: '', alignment: 'center', position_in_content: 1 })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Imágenes Avanzadas
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
        Gestiona imágenes con posicionamiento, alineación y texto alternativo
      </p>

      {uploading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600">No hay imágenes configuradas</p>
          <p className="text-sm text-gray-500 mt-1">Sube imágenes para empezar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={image.id} className="border border-gray-300 rounded-lg p-4 bg-white">
              <div className="flex gap-4">
                {/* Image Preview */}
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.alt_text || 'Preview'}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Image Details */}
                <div className="flex-1 space-y-3">
                  {editingId === image.id ? (
                    <>
                      {/* Edit Mode */}
                      <div>
                        <label className="text-xs text-gray-600">Texto Alternativo / Pie de foto</label>
                        <input
                          type="text"
                          value={editData.alt_text}
                          onChange={(e) => setEditData({ ...editData, alt_text: e.target.value })}
                          placeholder="Descripción de la imagen..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-600">Alineación</label>
                          <select
                            value={editData.alignment}
                            onChange={(e) => setEditData({ ...editData, alignment: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="left">Izquierda</option>
                            <option value="center">Centro</option>
                            <option value="right">Derecha</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-gray-600">Posición en texto</label>
                          <input
                            type="number"
                            min="1"
                            value={editData.position_in_content}
                            onChange={(e) => setEditData({ ...editData, position_in_content: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          <Save className="h-3 w-3" />
                          Guardar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                        >
                          <X className="h-3 w-3" />
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* View Mode */}
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {image.alt_text || 'Sin descripción'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Posición: {image.position_in_content} | Alineación: {
                            image.alignment === 'left' ? 'Izquierda' :
                            image.alignment === 'right' ? 'Derecha' : 'Centro'
                          }
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleSetPrimary(image.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                            image.is_primary
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          title={image.is_primary ? 'Imagen principal' : 'Marcar como principal'}
                        >
                          {image.is_primary ? <Star className="h-3 w-3 fill-current" /> : <StarOff className="h-3 w-3" />}
                          {image.is_primary ? 'Principal' : 'Marcar principal'}
                        </button>

                        <button
                          onClick={() => startEdit(image)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                        >
                          <Edit2 className="h-3 w-3" />
                          Editar
                        </button>

                        {index > 0 && (
                          <button
                            onClick={() => handleMoveUp(index)}
                            className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                          >
                            <MoveUp className="h-3 w-3" />
                          </button>
                        )}

                        {index < images.length - 1 && (
                          <button
                            onClick={() => handleMoveDown(index)}
                            className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                          >
                            <MoveDown className="h-3 w-3" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(image)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                        >
                          <Trash2 className="h-3 w-3" />
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Funcionalidades:</strong> Posición en texto (después de qué párrafo), alineación (izquierda/centro/derecha), 
          texto alternativo como pie de foto, imagen principal para portadas
        </p>
      </div>
    </div>
  )
}
