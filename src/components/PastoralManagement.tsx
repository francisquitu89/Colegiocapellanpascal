import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Upload, Trash2, Edit2, Loader2, AlertCircle } from 'lucide-react';
import { driveRoutesSupabase } from '../lib/supabase';

interface PastoralManagementProps {
  onBack: () => void;
}

const PastoralManagement: React.FC<PastoralManagementProps> = ({ onBack }) => {
  const [coreMembers, setCoreMembers] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingCore, setEditingCore] = useState<any>(null);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [newCore, setNewCore] = useState({ name: '', order_index: 0, year: 2025 });
  const [newTeacher, setNewTeacher] = useState({ name: '', order_index: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coreRes, teachersRes, photosRes] = await Promise.all([
        driveRoutesSupabase.from('pastoral_core_members').select('*').order('order_index'),
        driveRoutesSupabase.from('pastoral_teachers').select('*').order('order_index'),
        driveRoutesSupabase.from('pastoral_photos').select('*').order('order_index')
      ]);
      setCoreMembers(coreRes.data || []);
      setTeachers(teachersRes.data || []);
      setPhotos(photosRes.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCore = async () => {
    setSaving(true);
    try {
      if (editingCore) {
        await driveRoutesSupabase.from('pastoral_core_members').upsert(editingCore).eq('id', editingCore.id);
        setSuccess('Miembro actualizado');
      } else {
        await driveRoutesSupabase.from('pastoral_core_members').insert([newCore]);
        setSuccess('Miembro agregado');
        setNewCore({ name: '', order_index: 0, year: 2025 });
      }
      setEditingCore(null);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTeacher = async () => {
    setSaving(true);
    try {
      if (editingTeacher) {
        await driveRoutesSupabase.from('pastoral_teachers').upsert(editingTeacher).eq('id', editingTeacher.id);
        setSuccess('Profesor actualizado');
      } else {
        await driveRoutesSupabase.from('pastoral_teachers').insert([newTeacher]);
        setSuccess('Profesor agregado');
        setNewTeacher({ name: '', order_index: 0 });
      }
      setEditingTeacher(null);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCore = async (id: string) => {
    if (!confirm('¿Eliminar miembro?')) return;
    try {
      await driveRoutesSupabase.from('pastoral_core_members').delete().eq('id', id);
      fetchData();
      setSuccess('Miembro eliminado');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm('¿Eliminar profesor?')) return;
    try {
      await driveRoutesSupabase.from('pastoral_teachers').delete().eq('id', id);
      fetchData();
      setSuccess('Profesor eliminado');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setSaving(true);
    try {
      const file = e.target.files[0];
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await driveRoutesSupabase.storage.from('pastoral-photos').upload(fileName, file, {
        cacheControl: '2592000',
        upsert: false
      });
      if (uploadError) throw uploadError;
      
      const { data } = driveRoutesSupabase.storage.from('pastoral-photos').getPublicUrl(fileName);
      await driveRoutesSupabase.from('pastoral_photos').insert([{ photo_url: data.publicUrl, photo_name: fileName, order_index: photos.length }]);
      fetchData();
      setSuccess('Foto subida');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async (id: string, fileName: string) => {
    if (!confirm('¿Eliminar foto?')) return;
    try {
      await driveRoutesSupabase.storage.from('pastoral-photos').remove([fileName]);
      await driveRoutesSupabase.from('pastoral_photos').delete().eq('id', id);
      fetchData();
      setSuccess('Foto eliminada');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button onClick={onBack} className="flex items-center text-red-600 hover:text-red-700 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />Volver
          </button>
          <h1 className="text-4xl font-bold">Gestión Pastoral Juvenil</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {error && <div className="bg-red-50 border border-red-200 p-4 rounded flex items-center"><AlertCircle className="w-5 h-5 text-red-600 mr-2"/>{error}<button onClick={() => setError(null)} className="ml-auto"><X className="w-5 h-5"/></button></div>}
        {success && <div className="bg-green-50 border border-green-200 p-4 rounded flex items-center">{success}<button onClick={() => setSuccess(null)} className="ml-auto"><X className="w-5 h-5"/></button></div>}

        {/* Photos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Fotos del Carrusel</h2>
          <label className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700 w-fit">
            <Upload className="w-5 h-5"/><span>Subir Foto</span>
            <input type="file" onChange={handleUploadPhoto} className="hidden" accept="image/*"/>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {photos.map(p => (
              <div key={p.id} className="relative group">
                <img src={p.photo_url} alt="" className="w-full h-40 object-cover rounded"/>
                <button onClick={() => handleDeletePhoto(p.id, p.photo_name)} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Core Members */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Núcleo Pastoral</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input value={editingCore?.name || newCore.name} onChange={(e) => editingCore ? setEditingCore({...editingCore, name: e.target.value}) : setNewCore({...newCore, name: e.target.value})} placeholder="Nombre completo" className="px-4 py-2 border rounded"/>
            <input type="number" value={editingCore?.order_index ?? newCore.order_index} onChange={(e) => editingCore ? setEditingCore({...editingCore, order_index: +e.target.value}) : setNewCore({...newCore, order_index: +e.target.value})} placeholder="Orden" className="px-4 py-2 border rounded"/>
            <button onClick={handleSaveCore} disabled={saving} className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}<span>{editingCore ? 'Actualizar' : 'Agregar'}</span>
            </button>
          </div>
          {editingCore && <button onClick={() => setEditingCore(null)} className="text-gray-600 mb-4">Cancelar</button>}
          <div className="space-y-2">
            {coreMembers.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>{m.name}</span>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingCore(m)} className="text-purple-600"><Edit2 className="w-5 h-5"/></button>
                  <button onClick={() => handleDeleteCore(m.id)} className="text-red-600"><Trash2 className="w-5 h-5"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Profesores</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input value={editingTeacher?.name || newTeacher.name} onChange={(e) => editingTeacher ? setEditingTeacher({...editingTeacher, name: e.target.value}) : setNewTeacher({...newTeacher, name: e.target.value})} placeholder="Nombre completo" className="px-4 py-2 border rounded"/>
            <input type="number" value={editingTeacher?.order_index ?? newTeacher.order_index} onChange={(e) => editingTeacher ? setEditingTeacher({...editingTeacher, order_index: +e.target.value}) : setNewTeacher({...newTeacher, order_index: +e.target.value})} placeholder="Orden" className="px-4 py-2 border rounded"/>
            <button onClick={handleSaveTeacher} disabled={saving} className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}<span>{editingTeacher ? 'Actualizar' : 'Agregar'}</span>
            </button>
          </div>
          {editingTeacher && <button onClick={() => setEditingTeacher(null)} className="text-gray-600 mb-4">Cancelar</button>}
          <div className="space-y-2">
            {teachers.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>{t.name}</span>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingTeacher(t)} className="text-purple-600"><Edit2 className="w-5 h-5"/></button>
                  <button onClick={() => handleDeleteTeacher(t.id)} className="text-red-600"><Trash2 className="w-5 h-5"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastoralManagement;
