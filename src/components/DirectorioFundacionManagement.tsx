import React, { useEffect, useState } from 'react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';
import { Trash2, Edit2, Save, X, Plus, MoveUp, MoveDown } from 'lucide-react';

interface FundacionData {
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

const BUCKET = 'images';
const JSON_PATH = 'fundacion_directorio/data.json';

const DirectorioFundacionManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [data, setData] = useState<FundacionData>({ description: '', names: [], photoPath: undefined });
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [namesText, setNamesText] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => { fetchData(); fetchMiembros(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: file, error } = await driveRoutesSupabase.storage.from(BUCKET).download(JSON_PATH);
      if (!error && file) {
        const text = await file.text();
        const parsed = JSON.parse(text) as FundacionData;
        setData(parsed);
        setDescription(parsed.description || '');
        setNamesText((parsed.names || []).join(', '));
        if (parsed.photoPath) {
          const { data: urlData } = driveRoutesSupabase.storage.from(BUCKET).getPublicUrl(parsed.photoPath);
          setPhotoUrl(urlData.publicUrl);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMiembros = async () => {
    try {
      const { data: membersData, error } = await driveRoutesSupabase
        .from('equipo_fundacion')
        .select('*')
        .order('orden', { ascending: true });

      if (error) throw error;
      setMiembros(membersData || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const path = `fundacion_directorio/fundacion-${Date.now()}.${ext}`;
    try {
      setUploading(true);
      const { data: up, error } = await driveRoutesSupabase.storage.from(BUCKET).upload(path, file, { 
        upsert: true,
        cacheControl: '2592000'
      });
      if (error) throw error;
      const { data: urlData } = driveRoutesSupabase.storage.from(BUCKET).getPublicUrl(up.path);
      setPhotoUrl(urlData.publicUrl);
      setData((d) => ({ ...d, photoPath: up.path }));
    } catch (err) {
      console.error(err);
      alert('Error subiendo la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleFileMember = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMember(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `equipo_fundacion/${Date.now()}.${fileExt}`;

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
        .from('equipo_fundacion')
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
      alert(`Error al añadir el miembro: ${error.message || 'Error desconocido'}. Verifica que la tabla equipo_fundacion exista en Supabase.`);
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
        .from('equipo_fundacion')
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
        .from('equipo_fundacion')
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
        .from('equipo_fundacion')
        .update({ orden: currentOrden })
        .eq('id', targetMiembro.id);

      await driveRoutesSupabase
        .from('equipo_fundacion')
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
        .from('equipo_fundacion')
        .update({ orden: currentOrden })
        .eq('id', targetMiembro.id);

      await driveRoutesSupabase
        .from('equipo_fundacion')
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

  const save = async () => {
    const payload: FundacionData = { description, names: namesText.split(',').map(s => s.trim()).filter(Boolean), photoPath: data.photoPath };
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      await driveRoutesSupabase.storage.from(BUCKET).upload(JSON_PATH, blob, { 
        upsert: true,
        cacheControl: '2592000'
      });
      setData(payload);
      alert('Guardado correctamente');
    } catch (err) {
      console.error(err);
      alert('Error guardando');
    }
  };

  if (loading) return <div className="py-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <button 
          onClick={onBack} 
          className="mb-6 flex items-center text-red-600 hover:text-red-700 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al panel de administración
        </button>

        <h2 className="text-3xl font-bold mb-8 text-gray-900">Gestión Directorio Fundación</h2>

        {/* SECCIÓN 1: Foto y descripción principal */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Foto y Descripción Principal</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Foto principal del directorio</label>
            {photoUrl ? (
              <img src={photoUrl} className="max-h-72 my-2 rounded-lg" alt="foto" />
            ) : (
              <div className="h-40 bg-gray-100 my-2 flex items-center justify-center rounded-lg">
                <span className="text-gray-400">Sin foto</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFile}
              disabled={uploading}
              className="mt-2"
            />
            {uploading && <p className="text-sm text-gray-500 mt-1">Subiendo...</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Texto introductorio</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={5} 
              className="w-full p-3 border rounded-lg"
              placeholder="Descripción del directorio de fundación..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Nombres (separados por coma) - Opcional
            </label>
            <input 
              value={namesText} 
              onChange={(e) => setNamesText(e.target.value)} 
              className="w-full p-3 border rounded-lg"
              placeholder="Ej: María González, Juan Pérez, Ana Martínez"
            />
            <p className="text-xs text-gray-500 mt-1">
              Aparecerá como: "Izquierda a derecha: [nombres]"
            </p>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={save} 
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* SECCIÓN 2: Gestión de miembros del equipo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Miembros del Equipo</h3>
              <p className="text-sm text-gray-600 mt-1">
                Añade perfiles individuales con foto y curriculum
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Añadir Miembro
            </button>
          </div>

          {/* Formulario para añadir nuevo miembro */}
          {showAddForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 border-red-200">
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
                    placeholder="Ej: Director, Coordinador..."
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
                        <p className="text-red-600 font-medium">{miembro.cargo}</p>
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

export default DirectorioFundacionManagement;
