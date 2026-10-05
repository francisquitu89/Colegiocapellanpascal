import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { driveRoutesSupabase } from '../lib/supabase';
import type { DepartmentHead, OrientationTeamMember, CycleCoordinator, PastoralTeamMember } from '../lib/supabase';

interface ProyectoEducativoManagementProps {
  onBack: () => void;
}

type Section = 'departmentHeads' | 'orientationTeam' | 'cycleCoordinators' | 'pastoralTeam';

const ProyectoEducativoManagement: React.FC<ProyectoEducativoManagementProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<Section>('departmentHeads');
  const [departmentHeads, setDepartmentHeads] = useState<DepartmentHead[]>([]);
  const [orientationTeam, setOrientationTeam] = useState<OrientationTeamMember[]>([]);
  const [cycleCoordinators, setCycleCoordinators] = useState<CycleCoordinator[]>([]);
  const [pastoralTeam, setPastoralTeam] = useState<PastoralTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [deptHeads, orientTeam, cycleCoords, pastTeam] = await Promise.all([
        supabase.from('department_heads').select('*').order('order_index', { ascending: true }),
        supabase.from('orientation_team').select('*').order('order_index', { ascending: true }),
        supabase.from('cycle_coordinators').select('*').order('order_index', { ascending: true }),
        supabase.from('pastoral_team').select('*').order('order_index', { ascending: true })
      ]);

      if (deptHeads.data) setDepartmentHeads(deptHeads.data);
      if (orientTeam.data) setOrientationTeam(orientTeam.data);
      if (cycleCoords.data) setCycleCoordinators(cycleCoords.data);
      if (pastTeam.data) setPastoralTeam(pastTeam.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (section: Section) => {
    setActiveSection(section);
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item: any, section: Section) => {
    setActiveSection(section);
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = async (id: string, section: Section) => {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;

    const tableMap = {
      departmentHeads: 'department_heads',
      orientationTeam: 'orientation_team',
      cycleCoordinators: 'cycle_coordinators',
      pastoralTeam: 'pastoral_team'
    };

    const { error } = await driveRoutesSupabase.from(tableMap[section]).delete().eq('id', id);

    if (error) {
      alert('Error al eliminar');
      console.error(error);
    } else {
      fetchAllData();
    }
  };

  const handleSave = async () => {
    const tableMap = {
      departmentHeads: 'department_heads',
      orientationTeam: 'orientation_team',
      cycleCoordinators: 'cycle_coordinators',
      pastoralTeam: 'pastoral_team'
    };

    const table = tableMap[activeSection];

    if (editingItem) {
      // Update
      const { error } = await driveRoutesSupabase
        .from(table)
        .upsert({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingItem.id);

      if (error) {
        alert('Error al actualizar');
        console.error(error);
        return;
      }
    } else {
      // Insert
      const { error } = await driveRoutesSupabase.from(table).insert([formData]);

      if (error) {
        alert('Error al crear');
        console.error(error);
        return;
      }
    }

    setShowModal(false);
    fetchAllData();
  };

  const renderForm = () => {
    switch (activeSection) {
      case 'departmentHeads':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Departamento</label>
              <input
                type="text"
                value={formData.department || ''}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Matemática"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Nombre del Jefe</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Orden</label>
              <input
                type="number"
                value={formData.order_index || 0}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        );

      case 'orientationTeam':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: María López"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Cargo</label>
              <input
                type="text"
                value={formData.position || ''}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Psicóloga"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Orden</label>
              <input
                type="number"
                value={formData.order_index || 0}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </>
        );

      case 'cycleCoordinators':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Nombre del Ciclo</label>
              <input
                type="text"
                value={formData.cycle_name || ''}
                onChange={(e) => setFormData({ ...formData, cycle_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Ciclo Inicial"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Rango de Grados</label>
              <input
                type="text"
                value={formData.grade_range || ''}
                onChange={(e) => setFormData({ ...formData, grade_range: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: 1º a 3º Básico"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Nombre del Coordinador</label>
              <input
                type="text"
                value={formData.coordinator_name || ''}
                onChange={(e) => setFormData({ ...formData, coordinator_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Ana García"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Orden</label>
              <input
                type="number"
                value={formData.order_index || 0}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </>
        );

      case 'pastoralTeam':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ej: Padre Juan Silva"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Orden</label>
              <input
                type="number"
                value={formData.order_index || 0}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </>
        );
    }
  };

  const renderSection = (
    title: string,
    data: any[],
    section: Section,
    renderItem: (item: any) => JSX.Element
  ) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <button
          onClick={() => handleAdd(section)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar</span>
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-4">Cargando...</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 py-4">No hay elementos registrados</p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">{renderItem(item)}</div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item, section)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, section)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al panel de administración
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Gestión de Proyecto Educativo</h1>

        {renderSection(
          'Jefes de Departamentos',
          departmentHeads,
          'departmentHeads',
          (item: DepartmentHead) => (
            <div>
              <span className="font-semibold">{item.department}:</span> {item.name}
            </div>
          )
        )}

        {renderSection(
          'Equipo de Orientación',
          orientationTeam,
          'orientationTeam',
          (item: OrientationTeamMember) => (
            <div>
              <span className="font-semibold">{item.name}</span>
              <span className="text-gray-600 text-sm ml-2">- {item.position}</span>
            </div>
          )
        )}

        {renderSection(
          'Coordinadores de Ciclo',
          cycleCoordinators,
          'cycleCoordinators',
          (item: CycleCoordinator) => (
            <div>
              <span className="font-semibold">{item.cycle_name}</span>
              <span className="text-gray-600 text-sm ml-2">({item.grade_range})</span>
              <span className="text-gray-700 ml-2">- {item.coordinator_name}</span>
            </div>
          )
        )}

        {renderSection(
          'Equipo Pastoral',
          pastoralTeam,
          'pastoralTeam',
          (item: PastoralTeamMember) => (
            <div>
              <span className="font-semibold">{item.name}</span>
            </div>
          )
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Editar' : 'Agregar'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {renderForm()}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProyectoEducativoManagement;
