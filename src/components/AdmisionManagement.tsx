import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, Plus, X, Edit } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';

interface AdmisionManagementProps {
  onBack: () => void;
}

interface InfoSection {
  id?: number;
  title: string;
  content: string;
  icon_name: string;
  color: string;
  order_index: number;
}

interface Vacante {
  id?: number;
  curso: string;
  vacantes: number;
  order_index: number;
}

interface VacanteFecha {
  id?: number;
  fecha_actualizacion: string;
}

const AdmisionManagement: React.FC<AdmisionManagementProps> = ({ onBack }) => {
  const [infoSections, setInfoSections] = useState<InfoSection[]>([]);
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [fechaActualizacion, setFechaActualizacion] = useState('');
  const [fechaId, setFechaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'sections' | 'vacantes' | 'fecha'>('sections');
  const [editingSection, setEditingSection] = useState<InfoSection | null>(null);
  const [editingVacante, setEditingVacante] = useState<Vacante | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch info sections
      const { data: sectionsData } = await driveRoutesSupabase
        .from('admision_info_sections')
        .select('*')
        .order('order_index');
      if (sectionsData) setInfoSections(sectionsData);

      // Fetch vacantes
      const { data: vacantesData } = await driveRoutesSupabase
        .from('admision_vacantes')
        .select('*')
        .order('order_index');
      if (vacantesData) setVacantes(vacantesData);

      // Fetch fecha actualización
      const { data: fechaData } = await driveRoutesSupabase
        .from('admision_vacantes_fecha')
        .select('*')
        .single();
      if (fechaData) {
        setFechaActualizacion(fechaData.fecha_actualizacion);
        setFechaId(fechaData.id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };


  const handleSaveSection = async (section: InfoSection) => {
    setLoading(true);
    try {
      if (section.id) {
        await driveRoutesSupabase
          .from('admision_info_sections')
          .upsert({
            title: section.title,
            content: section.content,
            icon_name: section.icon_name,
            color: section.color,
            order_index: section.order_index
          })
          .eq('id', section.id);
      } else {
        await driveRoutesSupabase
          .from('admision_info_sections')
          .insert([section]);
      }
      setMessage('Sección guardada exitosamente');
      setEditingSection(null);
      fetchData();
    } catch (error) {
      console.error('Error saving section:', error);
      setMessage('Error al guardar sección');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta sección?')) return;
    
    setLoading(true);
    try {
      await driveRoutesSupabase
        .from('admision_info_sections')
        .delete()
        .eq('id', id);
      setMessage('Sección eliminada');
      fetchData();
    } catch (error) {
      console.error('Error deleting section:', error);
      setMessage('Error al eliminar sección');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVacante = async (vacante: Vacante) => {
    setLoading(true);
    try {
      if (vacante.id) {
        await driveRoutesSupabase
          .from('admision_vacantes')
          .update({
            curso: vacante.curso,
            vacantes: vacante.vacantes,
            order_index: vacante.order_index
          })
          .eq('id', vacante.id);
      } else {
        await driveRoutesSupabase
          .from('admision_vacantes')
          .insert([vacante]);
      }
      setMessage('Vacante guardada exitosamente');
      setEditingVacante(null);
      fetchData();
    } catch (error) {
      console.error('Error saving vacante:', error);
      setMessage('Error al guardar vacante');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVacante = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta vacante?')) return;
    
    setLoading(true);
    try {
      await driveRoutesSupabase
        .from('admision_vacantes')
        .delete()
        .eq('id', id);
      setMessage('Vacante eliminada');
      fetchData();
    } catch (error) {
      console.error('Error deleting vacante:', error);
      setMessage('Error al eliminar vacante');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFecha = async () => {
    setLoading(true);
    try {
      if (fechaId) {
        await driveRoutesSupabase
          .from('admision_vacantes_fecha')
          .update({ fecha_actualizacion: fechaActualizacion })
          .eq('id', fechaId);
      } else {
        const { data } = await driveRoutesSupabase
          .from('admision_vacantes_fecha')
          .insert([{ fecha_actualizacion: fechaActualizacion }])
          .select()
          .single();
        if (data) setFechaId(data.id);
      }
      setMessage('Fecha actualizada exitosamente');
      fetchData();
    } catch (error) {
      console.error('Error saving fecha:', error);
      setMessage('Error al actualizar fecha');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al panel de administración
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Admisión</h1>
          <p className="text-gray-600">Administra las secciones de información, vacantes disponibles y fecha de actualización</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('sections')}
              className={`pb-4 px-2 font-semibold transition-colors ${
                activeTab === 'sections'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Secciones de Información
            </button>
            <button
              onClick={() => setActiveTab('vacantes')}
              className={`pb-4 px-2 font-semibold transition-colors ${
                activeTab === 'vacantes'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tabla de Vacantes
            </button>
            <button
              onClick={() => setActiveTab('fecha')}
              className={`pb-4 px-2 font-semibold transition-colors ${
                activeTab === 'fecha'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Fecha de Actualización
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Secciones de Información</h2>
                <button
                  onClick={() => setEditingSection({
                    title: '',
                    content: '',
                    icon_name: 'FileText',
                    color: 'from-blue-600 to-blue-800',
                    order_index: infoSections.length + 1
                  })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nueva Sección</span>
                </button>
              </div>

              <div className="text-sm text-gray-600 mb-4 space-y-1">
                <p><strong>Iconos disponibles:</strong> FileText, Users, CheckCircle, Calendar, DollarSign, Award, BookOpen</p>
                <p><strong>Colores disponibles:</strong> from-blue-600 to-blue-800, from-green-600 to-green-800, from-purple-600 to-purple-800, from-red-600 to-red-800, from-orange-600 to-orange-800, from-teal-600 to-teal-800, from-indigo-600 to-indigo-800</p>
                <p><strong>Nota:</strong> Para mostrar la tabla de vacantes en una sección, incluye [TABLA_VACANTES] en el contenido</p>
              </div>

              {editingSection && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-blue-500">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingSection.id ? 'Editar Sección' : 'Nueva Sección'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                      <input
                        type="text"
                        value={editingSection.title}
                        onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Criterios Generales de Admisión"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
                      <textarea
                        value={editingSection.content}
                        onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                        rows={8}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Contenido de la sección... Usa \n para saltos de línea"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
                        <input
                          type="text"
                          value={editingSection.icon_name}
                          onChange={(e) => setEditingSection({ ...editingSection, icon_name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="FileText"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color (gradiente)</label>
                        <input
                          type="text"
                          value={editingSection.color}
                          onChange={(e) => setEditingSection({ ...editingSection, color: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="from-blue-600 to-blue-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Orden</label>
                      <input
                        type="number"
                        value={editingSection.order_index}
                        onChange={(e) => setEditingSection({ ...editingSection, order_index: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleSaveSection(editingSection)}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>{loading ? 'Guardando...' : 'Guardar'}</span>
                      </button>
                      <button
                        onClick={() => setEditingSection(null)}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {infoSections.map((section) => (
                  <div key={section.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{section.content}</p>
                        <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                          <span>Icono: {section.icon_name}</span>
                          <span>Color: {section.color}</span>
                          <span>Orden: {section.order_index}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingSection(section)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => section.id && handleDeleteSection(section.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vacantes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Tabla de Vacantes por Curso</h2>
                <button
                  onClick={() => setEditingVacante({
                    curso: '',
                    vacantes: 0,
                    order_index: vacantes.length + 1
                  })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nueva Vacante</span>
                </button>
              </div>

              {editingVacante && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-blue-500">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingVacante.id ? 'Editar Vacante' : 'Nueva Vacante'}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
                        <input
                          type="text"
                          value={editingVacante.curso}
                          onChange={(e) => setEditingVacante({ ...editingVacante, curso: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: 1° básico"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vacantes</label>
                        <input
                          type="number"
                          value={editingVacante.vacantes}
                          onChange={(e) => setEditingVacante({ ...editingVacante, vacantes: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Orden</label>
                      <input
                        type="number"
                        value={editingVacante.order_index}
                        onChange={(e) => setEditingVacante({ ...editingVacante, order_index: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleSaveVacante(editingVacante)}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>{loading ? 'Guardando...' : 'Guardar'}</span>
                      </button>
                      <button
                        onClick={() => setEditingVacante(null)}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Curso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vacantes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vacantes.map((vacante) => (
                      <tr key={vacante.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vacante.curso}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            vacante.vacantes > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {vacante.vacantes}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vacante.order_index}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingVacante(vacante)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => vacante.id && handleDeleteVacante(vacante.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fecha' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Fecha de Actualización de Vacantes</h2>
              <p className="text-gray-600 mb-6">
                Esta fecha se muestra en la sección de vacantes disponibles. Actualízala cada vez que modifiques las vacantes.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto de fecha de actualización
                  </label>
                  <input
                    type="text"
                    value={fechaActualizacion}
                    onChange={(e) => setFechaActualizacion(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Actualizadas al 15 de octubre"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Este texto aparecerá después de la tabla de vacantes
                  </p>
                </div>
                <button
                  onClick={handleSaveFecha}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Guardando...' : 'Guardar Fecha'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmisionManagement;
