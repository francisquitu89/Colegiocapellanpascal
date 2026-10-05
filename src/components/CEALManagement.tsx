import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Upload, Trash2, Edit2, Plus, Loader2, AlertCircle } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';
import { optimizeFile } from '../lib/fileOptimization';

interface CEALManagementProps {
  onBack: () => void;
}

const CEALManagement: React.FC<CEALManagementProps> = ({ onBack }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [newMember, setNewMember] = useState({ position: '', name: '', order_index: 0, year: 2025 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, photosRes] = await Promise.all([
        driveRoutesSupabase.from('ceal_members').select('*').order('order_index'),
        driveRoutesSupabase.from('ceal_photos').select('*').order('order_index')
      ]);
      setMembers(membersRes.data || []);
      setPhotos(photosRes.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMember = async () => {
    setSaving(true);
    try {
      if (editingMember) {
        await driveRoutesSupabase.from('ceal_members').upsert(editingMember).eq('id', editingMember.id);
        setSuccess('Miembro actualizado');
      } else {
        await driveRoutesSupabase.from('ceal_members').insert([newMember]);
        setSuccess('Miembro agregado');
        setNewMember({ position: '', name: '', order_index: 0, year: 2025 });
      }
      setEditingMember(null);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('¿Eliminar miembro?')) return;
    try {
      await driveRoutesSupabase.from('ceal_members').delete().eq('id', id);
      fetchData();
      setSuccess('Miembro eliminado');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setSaving(true);
    try {
      const file = e.target.files[0];
      
      // Optimizar imagen antes de subir
      const optimizedFile = await optimizeFile(file);
      console.log(`Foto optimizada - Original: ${file.size} bytes, Optimizado: ${optimizedFile.size} bytes`);
      
      const fileName = `${Date.now()}-${optimizedFile.name}`;
      const { error: uploadError } = await driveRoutesSupabase.storage.from('ceal-photos').upload(fileName, optimizedFile, {
        cacheControl: '2592000',
        upsert: false
      });
      if (uploadError) throw uploadError;
      
      const { data } = driveRoutesSupabase.storage.from('ceal-photos').getPublicUrl(fileName);
      await driveRoutesSupabase.from('ceal_photos').insert([{ photo_url: data.publicUrl, photo_name: fileName, order_index: photos.length }]);
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
      await driveRoutesSupabase.storage.from('ceal-photos').remove([fileName]);
      await driveRoutesSupabase.from('ceal_photos').delete().eq('id', id);
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
          <h1 className="text-4xl font-bold">Gestión CEAL</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {error && <div className="bg-red-50 border border-red-200 p-4 rounded flex items-center"><AlertCircle className="w-5 h-5 text-red-600 mr-2"/>{error}<button onClick={() => setError(null)} className="ml-auto"><X className="w-5 h-5"/></button></div>}
        {success && <div className="bg-green-50 border border-green-200 p-4 rounded flex items-center">{success}<button onClick={() => setSuccess(null)} className="ml-auto"><X className="w-5 h-5"/></button></div>}

        {/* Photos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Fotos del Carrusel</h2>
          <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 w-fit">
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

        {/* Members */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Miembros</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input value={editingMember?.position || newMember.position} onChange={(e) => editingMember ? setEditingMember({...editingMember, position: e.target.value}) : setNewMember({...newMember, position: e.target.value})} placeholder="Cargo" className="px-4 py-2 border rounded"/>
            <input value={editingMember?.name || newMember.name} onChange={(e) => editingMember ? setEditingMember({...editingMember, name: e.target.value}) : setNewMember({...newMember, name: e.target.value})} placeholder="Nombre" className="px-4 py-2 border rounded"/>
            <input type="number" value={editingMember?.order_index ?? newMember.order_index} onChange={(e) => editingMember ? setEditingMember({...editingMember, order_index: +e.target.value}) : setNewMember({...newMember, order_index: +e.target.value})} placeholder="Orden" className="px-4 py-2 border rounded"/>
            <button onClick={handleSaveMember} disabled={saving} className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}<span>{editingMember ? 'Actualizar' : 'Agregar'}</span>
            </button>
          </div>
          {editingMember && <button onClick={() => setEditingMember(null)} className="text-gray-600 mb-4">Cancelar edición</button>}
          <div className="space-y-2">
            {members.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div><span className="font-bold">{m.position}:</span> {m.name}</div>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingMember(m)} className="text-blue-600"><Edit2 className="w-5 h-5"/></button>
                  <button onClick={() => handleDeleteMember(m.id)} className="text-red-600"><Trash2 className="w-5 h-5"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CEALManagement;
