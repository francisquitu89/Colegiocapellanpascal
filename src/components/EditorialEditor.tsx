import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Save,
  X
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { driveRoutesSupabase, EditorialItem } from '../lib/supabase';
import ImageUploader from './ImageUploader';
import AdvancedImageManager from './AdvancedImageManager';

interface EditorialEditorProps {
  onClose: () => void;
  onSave?: () => void;
  editingEditorial?: EditorialItem | null;
}

const EditorialEditor: React.FC<EditorialEditorProps> = ({ onClose, onSave, editingEditorial }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editingEditorial) {
      setTitle(editingEditorial.title);
      setDate(new Date(editingEditorial.date));
      setImages(Array.isArray(editingEditorial.images) ? editingEditorial.images : []);
      setVideoUrl(editingEditorial.video_url || '');
      editor?.commands.setContent(editingEditorial.content);
    } else {
      // Reset form for new editorial
      setTitle('');
      setDate(new Date());
      setImages([]);
      setVideoUrl('');
      editor?.commands.setContent('');
    }
  }, [editingEditorial, editor]);

  const handleSave = async () => {
    if (!title.trim() || !editor?.getHTML()) {
      alert('Por favor completa el título y el contenido');
      return;
    }

    setSaving(true);
    try {
      const editorialData = {
        title: title.trim(),
        content: editor.getHTML(),
        date: date.toISOString().split('T')[0],
        images: images,
        video_url: videoUrl.trim() || null,
      };

      console.log('Saving editorial data:', editorialData);
      if (editingEditorial) {
        const { error } = await driveRoutesSupabase
          .from('editorial')
          .upsert(editorialData)
          .eq('id', editingEditorial.id);
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Editorial updated successfully');
      } else {
        const { error } = await supabase
          .from('editorial')
          .insert([editorialData]);
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Editorial created successfully');
      }

      if (onSave) {
        onSave();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error saving editorial:', error);
      alert(`Error al guardar el editorial: ${error.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingEditorial ? 'Editar Editorial' : 'Nuevo Editorial'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ingresa el título del editorial"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de publicación *
            </label>
            <DatePicker
              selected={date}
              onChange={(date) => date && setDate(date)}
              dateFormat="dd/MM/yyyy"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imágenes Simples (Carrusel)
            </label>
            <ImageUploader
              images={images}
              onImagesChange={setImages}
            />
          </div>

          {/* Advanced Images - Only for existing editorials */}
          {editingEditorial && (
            <div>
              <AdvancedImageManager
                contentId={editingEditorial.id}
                contentType="editorial"
              />
            </div>
          )}

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video (YouTube/Vimeo URL - opcional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          {/* Editor Toolbar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido *
            </label>
            <div className="border border-gray-300 rounded-md">
              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('bold') ? 'bg-gray-200' : ''
                  }`}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('italic') ? 'bg-gray-200' : ''
                  }`}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('bulletList') ? 'bg-gray-200' : ''
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('orderedList') ? 'bg-gray-200' : ''
                  }`}
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorialEditor;