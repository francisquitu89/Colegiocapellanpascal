import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Upload, Edit2, X, Users } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';
import { uploadNewsImage } from '../lib/newsImagesStorage';

interface DepartamentoOrientacionManagementProps {
  onBack: () => void;
}

interface OrientacionInfo {
  id: string;
  cover_image_url: string | null;
  intro_text: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  order_index: number;
}

export default function DepartamentoOrientacionManagement({ onBack }: DepartamentoOrientacionManagementProps) {
  const [info, setInfo] = useState<OrientacionInfo | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [introText, setIntroText] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({ name: '', position: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load info
      const { data: infoData, error: infoError } = await driveRoutesSupabase
        .from('departamento_orientacion')
        .select('*')
        .single();

      if (infoError) throw infoError;
      setInfo(infoData);
      setIntroText(infoData.intro_text || '');

      // Load team members
      const { data: teamData, error: teamError } = await driveRoutesSupabase
        .from('orientacion_team_members')
        .select('*')
        .order('order_index');

      if (teamError) throw teamError;
      setTeamMembers(teamData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error al cargar los datos');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !info) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `orientacion/cover-${Math.random()}.${fileExt}`;

      const { publicUrl } = await uploadNewsImage(fileName, file, {
        cacheControl: '2592000',
        upsert: false
      });

      const { error: updateError } = await driveRoutesSupabase
        .from('departamento_orientacion')
        .update({ cover_image_url: publicUrl })
        .eq('id', info.id);

      if (updateError) throw updateError;

      await loadData();
      alert('Imagen actualizada correctamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveIntro = async () => {
    if (!info) return;

    setSaving(true);
    try {
      const { error } = await driveRoutesSupabase
        .from('departamento_orientacion')
        .update({ intro_text: introText })
        .eq('id', info.id);

      if (error) throw error;
      alert('Texto actualizado correctamente');
      await loadData();
    } catch (error) {
      console.error('Error saving intro:', error);
      alert('Error al guardar el texto');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name.trim() || !newMember.position.trim()) {
      alert('Complete todos los campos');
      return;
    }

    try {
      const maxOrder = Math.max(...teamMembers.map(m => m.order_index), 0);
      
      const { error } = await driveRoutesSupabase
        .from('orientacion_team_members')
        .insert([{
          name: newMember.name.trim(),
          position: newMember.position.trim(),
          order_index: maxOrder + 1
        }]);

      if (error) throw error;

      setNewMember({ name: '', position: '' });
      setShowAddForm(false);
      await loadData();
      alert('Miembro agregado correctamente');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error al agregar miembro');
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    try {
      const { error } = await driveRoutesSupabase
        .from('orientacion_team_members')
        .upsert({
          name: editingMember.name,
          position: editingMember.position
        })
        .eq('id', editingMember.id);

      if (error) throw error;

      setEditingMember(null);
      await loadData();
      alert('Miembro actualizado correctamente');
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Error al actualizar miembro');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('¿Eliminar este miembro del equipo?')) return;

    try {
      const { error } = await supabase
        .from('orientacion_team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
      alert('Miembro eliminado correctamente');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error al eliminar miembro');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al Panel
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Gestionar Departamento de Orientación
          </h1>
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Imagen de Portada</h2>
          
          {info?.cover_image_url && (
            <div className="mb-4">
              <img
                src={info.cover_image_url}
                alt="Portada actual"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors w-fit">
            <Upload className="h-5 w-5 mr-2" />
            {uploadingImage ? 'Subiendo...' : 'Cambiar Imagen de Portada'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>
        </div>

        {/* Intro Text */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Texto Introductorio</h2>
          <textarea
            value={introText}
            onChange={(e) => setIntroText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Texto de introducción..."
          />
          <button
            onClick={handleSaveIntro}
            disabled={saving}
            className="mt-4 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Texto'}
          </button>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Equipo</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar Miembro
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Nuevo Miembro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Nombre completo"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newMember.position}
                  onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                  placeholder="Cargo o especialidad"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddMember}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewMember({ name: '', position: '' });
                  }}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                {editingMember?.id === member.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Nombre"
                    />
                    <input
                      type="text"
                      value={editingMember.position}
                      onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Cargo"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateMember}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingMember(null)}
                        className="flex items-center px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.position}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
