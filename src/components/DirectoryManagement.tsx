import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Upload } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';
import type { DirectoryMember } from '../lib/supabase';

interface DirectoryManagementProps {
  onBack: () => void;
}

const DirectoryManagement: React.FC<DirectoryManagementProps> = ({ onBack }) => {
  const [members, setMembers] = useState<DirectoryMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'directorio' | 'rectoria'>('directorio');
  const [editingMember, setEditingMember] = useState<Partial<DirectoryMember> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await driveRoutesSupabase
        .from('directory_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Error al cargar los miembros');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `directory/${fileName}`;

      const { error: uploadError } = await driveRoutesSupabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '2592000',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = driveRoutesSupabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir la imagen');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    const uploadedUrl = await handleFileUpload(file);
    if (uploadedUrl && editingMember) {
      setEditingMember({ ...editingMember, photo_url: uploadedUrl });
    }
  };

  const handleSave = async () => {
    if (!editingMember?.name || !editingMember?.position) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      if (isCreating) {
        const { error } = await driveRoutesSupabase
          .from('directory_members')
          .insert([{
            ...editingMember,
            category: activeTab,
            order_index: members.filter(m => m.category === activeTab).length
          }]);

        if (error) throw error;
      } else if (editingMember.id) {
        const { error } = await driveRoutesSupabase
          .from('directory_members')
          .upsert(editingMember)
          .eq('id', editingMember.id);

        if (error) throw error;
      }

      await fetchMembers();
      setEditingMember(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Error al guardar el miembro');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este miembro?')) return;

    try {
      const { error } = await driveRoutesSupabase
        .from('directory_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error al eliminar el miembro');
    }
  };

  const handleCreate = () => {
    setEditingMember({
      name: '',
      position: '',
      photo_url: '',
      category: activeTab
    });
    setIsCreating(true);
  };

  const filteredMembers = members.filter(m => m.category === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al Panel
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Directorio y Rectoría</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('directorio')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'directorio'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Directorio
          </button>
          <button
            onClick={() => setActiveTab('rectoria')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'rectoria'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Rectoría
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={handleCreate}
          className="mb-6 flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Miembro
        </button>

        {/* Member List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md p-6">
              {member.photo_url && (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {member.name}
              </h3>
              <p className="text-gray-600 text-center mb-4">{member.position}</p>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => {
                    setEditingMember(member);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit/Create Modal */}
        {editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {isCreating ? 'Agregar Miembro' : 'Editar Miembro'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={editingMember.name || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Juan Pérez García"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo *
                  </label>
                  <input
                    type="text"
                    value={editingMember.position || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Rector, Director, Vicerrector Académico"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto del miembro
                  </label>
                  
                  {/* File Upload */}
                  <div className="mb-4">
                    <label className="block w-full px-4 py-3 bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <div className="flex items-center justify-center space-x-2">
                        <Upload className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-600 font-medium">
                          {uploading ? 'Subiendo...' : 'Subir imagen desde tu dispositivo'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG o GIF. Máximo 5MB
                    </p>
                  </div>

                  {/* URL Input */}
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      O ingresa una URL de imagen
                    </label>
                    <input
                      type="text"
                      value={editingMember.photo_url || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, photo_url: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://ejemplo.com/foto.jpg"
                      disabled={uploading}
                    />
                  </div>
                  
                  {/* Image Preview */}
                  {editingMember.photo_url && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                      <img
                        src={editingMember.photo_url}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setEditingMember(null);
                    setIsCreating(false);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryManagement;
