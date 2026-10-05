import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Trash2, Plus, X, Edit2, MoveUp, MoveDown } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';

interface ConsejoDirectivoManagementProps {
  onBack: () => void;
}

interface ConsejoDirectivoData {
  description: string;
  names: string[];
  photoPath?: string;
}

interface MiembroEquipo {
  id: string;
  nombre: string;
  cargo: string | null;
  foto_url: string | null;
  curriculum: string | null;
  orden: number;
}

const ConsejoDirectivoManagement: React.FC<ConsejoDirectivoManagementProps> = ({ onBack }) => {
  const [description, setDescription] = useState('');
  const [names, setNames] = useState<string[]>(['']);
  const [currentPhotoPath, setCurrentPhotoPath] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados para gestión de equipo
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingMember, setUploadingMember] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    curriculum: '',
    foto_url: ''
  });

  useEffect(() => {
    loadCurrentData();
    fetchMiembros();
  }, []);

  const loadCurrentData = async () => {
    try {
      setLoading(true);

      // Cargar datos del JSON
      const { data: fileData, error: fileError } = await driveRoutesSupabase.storage
        .from('images')
        .download('consejo_directivo/data.json');

      if (!fileError && fileData) {
        const text = await fileData.text();
        const jsonData = JSON.parse(text) as ConsejoDirectivoData;
        
        setDescription(jsonData.description || '');
        setNames(jsonData.names && jsonData.names.length > 0 ? jsonData.names : ['']);
        setCurrentPhotoPath(jsonData.photoPath || '');

        // Cargar vista previa de la imagen actual
        if (jsonData.photoPath) {
          const { data: urlData } = driveRoutesSupabase.storage
            .from('images')
            .getPublicUrl(jsonData.photoPath);
          
          if (urlData.publicUrl) {
            setPhotoPreview(urlData.publicUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddName = () => {
    setNames([...names, '']);
  };

  const handleRemoveName = (index: number) => {
    const newNames = names.filter((_, i) => i !== index);
    setNames(newNames.length > 0 ? newNames : ['']);
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    setCurrentPhotoPath('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      let photoPath = currentPhotoPath;

      // Si hay una nueva foto, subirla
      if (photoFile) {
        // Eliminar foto anterior si existe
        if (currentPhotoPath) {
          await driveRoutesSupabase.storage
            .from('images')
            .remove([currentPhotoPath]);
        }

        // Subir nueva foto
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `consejo-${Date.now()}.${fileExt}`;
        photoPath = `consejo_directivo/${fileName}`;

        const { error: uploadError } = await driveRoutesSupabase.storage
          .from('images')
          .upload(photoPath, photoFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }
      }

      // Crear objeto de datos
      const data: ConsejoDirectivoData = {
        description,
        names: names.filter(name => name.trim() !== ''),
        photoPath: photoPath || undefined
      };

      // Guardar JSON
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      const { error: jsonError } = await driveRoutesSupabase.storage
        .from('images')
        .upload('consejo_directivo/data.json', jsonBlob, {
          cacheControl: '3600',
          upsert: true
        });

      if (jsonError) {
        throw jsonError;
      }

      setMessage({ type: 'success', text: 'Datos guardados exitosamente' });
      setCurrentPhotoPath(photoPath);
      setPhotoFile(null);

      // Recargar datos
      setTimeout(() => {
        loadCurrentData();
      }, 1000);

    } catch (error) {
      console.error('Error saving:', error);
      setMessage({ type: 'error', text: 'Error al guardar los datos' });
    } finally {
      setSaving(false);
    }
  };

  const fetchMiembros = async () => {
    try {
      const { data: membersData, error } = await driveRoutesSupabase
        .from('equipo_consejo_directivo')
        .select('*')
        .order('orden', { ascending: true });

      if (error) throw error;
      setMiembros(membersData || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleFileMember = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMember(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `consejo_directivo/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await driveRoutesSupabase.storage
        .from('images')
        .upload(fileName, file, { 
          upsert: true,
          cacheControl: '2592000'
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Error al subir: ${uploadError.message}`);
      }

      const { data: urlData } = driveRoutesSupabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, foto_url: urlData.publicUrl });
      alert('Foto subida correctamente');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(`Error al subir la foto: ${error.message || 'Error desconocido'}`);
    } finally {
      setUploadingMember(false);
    }
  };

  const handleAddMember = async () => {
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      const maxOrden = miembros.length > 0 
        ? Math.max(...miembros.map(m => m.orden))
        : 0;

      const { error } = await driveRoutesSupabase
        .from('equipo_consejo_directivo')
        .insert([{
          nombre: formData.nombre,
          cargo: formData.cargo || null,
          curriculum: formData.curriculum || null,
          foto_url: formData.foto_url || null,
          orden: maxOrden + 1
        }]);

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      alert('Miembro añadido correctamente');
      setShowAddForm(false);
      resetForm();
      fetchMiembros();
    } catch (error: any) {
      console.error('Error adding member:', error);
      alert(`Error al añadir el miembro: ${error.message || 'Error desconocido'}`);
    }
  };

  const handleEditMember = (miembro: MiembroEquipo) => {
    setEditingId(miembro.id);
    setFormData({
      nombre: miembro.nombre,
      cargo: miembro.cargo || '',
      curriculum: miembro.curriculum || '',
      foto_url: miembro.foto_url || ''
    });
  };

  const handleSaveMember = async (id: string) => {
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      const { error } = await driveRoutesSupabase
        .from('equipo_consejo_directivo')
        .upsert({
          nombre: formData.nombre,
          cargo: formData.cargo || null,
          curriculum: formData.curriculum || null,
          foto_url: formData.foto_url || null
        })
        .eq('id', id);

      if (error) throw error;

      alert('Cambios guardados correctamente');
      setEditingId(null);
      resetForm();
      fetchMiembros();
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Error al guardar los cambios');
    }
  };

  const handleDeleteMember = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${nombre}?`)) return;

    try {
      const { error } = await driveRoutesSupabase
        .from('equipo_consejo_directivo')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Miembro eliminado correctamente');
      fetchMiembros();
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error al eliminar el miembro');
    }
  };

  const handleMoveUp = async (id: string, currentOrden: number) => {
    const targetMiembro = miembros.find(m => m.orden < currentOrden);
    if (!targetMiembro) return;

    try {
      await driveRoutesSupabase
        .from('equipo_consejo_directivo')
        .update({ orden: currentOrden })
        .eq('id', targetMiembro.id);

      await driveRoutesSupabase
        .from('equipo_consejo_directivo')
        .update({ orden: targetMiembro.orden })
        .eq('id', id);

      fetchMiembros();
    } catch (error) {
      console.error('Error reordering:', error);
      alert('Error al reordenar');
    }
  };

  const handleMoveDown = async (id: string, currentOrden: number) => {
    const targetMiembro = miembros.find(m => m.orden > currentOrden);
    if (!targetMiembro) return;

    try {
      await driveRoutesSupabase
        .from('equipo_consejo_directivo')
        .update({ orden: currentOrden })
        .eq('id', targetMiembro.id);

      await driveRoutesSupabase
        .from('equipo_consejo_directivo')
        .update({ orden: targetMiembro.orden })
        .eq('id', id);

      fetchMiembros();
    } catch (error) {
      console.error('Error reordering:', error);
      alert('Error al reordenar');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      cargo: '',
      curriculum: '',
      foto_url: ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al Panel
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Gestión Consejo Directivo
          </h1>
          <p className="text-gray-600 mt-2">
            Edite la información del Consejo Directivo
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <span>{message.text}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            {/* Imagen */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Fotografía del Consejo Directivo
              </label>
              
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full max-w-2xl rounded-lg shadow-md"
                  />
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Haga clic para subir una imagen</p>
                  </label>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Escriba la descripción del Consejo Directivo..."
              />
            </div>

            {/* Nombres */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Nombres de los Miembros
                </label>
                <button
                  onClick={handleAddName}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-semibold">Agregar nombre</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {names.map((name, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Nombre ${index + 1}`}
                    />
                    {names.length > 1 && (
                      <button
                        onClick={() => handleRemoveName(index)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Botón Guardar */}
            <div className="flex justify-end pt-6 border-t">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span className="font-semibold">
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: Gestión de miembros del equipo */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Miembros del Equipo</h3>
              <p className="text-sm text-gray-600 mt-1">
                Añade perfiles individuales con foto y curriculum
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Añadir Miembro
            </button>
          </div>

            {/* Formulario para añadir nuevo miembro */}
            {showAddForm && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 border-blue-200">
                <h4 className="text-lg font-bold mb-4">Nuevo Miembro</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="Nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cargo</label>
                    <input
                      type="text"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="Ej: Presidente, Secretario..."
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Foto de perfil</label>
                  {formData.foto_url && (
                    <img src={formData.foto_url} alt="Preview" className="max-h-40 mb-2 rounded" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileMember}
                    disabled={uploadingMember}
                    className="w-full"
                  />
                  {uploadingMember && <p className="text-sm text-gray-500 mt-1">Subiendo...</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Curriculum</label>
                  <textarea
                    value={formData.curriculum}
                    onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                    rows={6}
                    className="w-full p-2 border rounded"
                    placeholder="Formación académica, experiencia profesional, logros..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAddMember}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Lista de miembros */}
            <div className="space-y-4">
              {miembros.map((miembro, index) => (
                <div key={miembro.id} className="bg-white border rounded-lg p-4">
                  {editingId === miembro.id ? (
                    // Modo edición
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nombre *</label>
                          <input
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Cargo</label>
                          <input
                            type="text"
                            value={formData.cargo}
                            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Foto</label>
                        {formData.foto_url && (
                          <img src={formData.foto_url} alt="Preview" className="max-h-40 mb-2 rounded" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileMember}
                          disabled={uploadingMember}
                          className="w-full"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Curriculum</label>
                        <textarea
                          value={formData.curriculum}
                          onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                          rows={6}
                          className="w-full p-2 border rounded"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveMember(miembro.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Guardar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 flex items-center"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo vista
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {miembro.foto_url ? (
                          <img
                            src={miembro.foto_url}
                            alt={miembro.nombre}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Sin foto</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-gray-900">{miembro.nombre}</h4>
                        {miembro.cargo && (
                          <p className="text-blue-600 font-medium">{miembro.cargo}</p>
                        )}
                        {miembro.curriculum && (
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                            {miembro.curriculum}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleMoveUp(miembro.id, miembro.orden)}
                            disabled={index === 0}
                            className={`p-2 rounded ${
                              index === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                            title="Mover arriba"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(miembro.id, miembro.orden)}
                            disabled={index === miembros.length - 1}
                            className={`p-2 rounded ${
                              index === miembros.length - 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                            title="Mover abajo"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleEditMember(miembro)}
                          className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteMember(miembro.id, miembro.nombre)}
                          className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {miembros.length === 0 && !showAddForm && (
                <div className="bg-gray-50 p-12 rounded-lg text-center border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 mb-4">
                    No hay miembros registrados.
                  </p>
                  <p className="text-sm text-gray-400">
                    Haz clic en "Añadir Miembro" para comenzar.
                  </p>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ConsejoDirectivoManagement;
