import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';

interface Fecha {
  id?: number;
  fecha: string;
  hora: string;
  actividad: string;
  year: number;
}

interface FechasImportantesManagementProps {
  onBack: () => void;
}

export default function FechasImportantesManagement({ onBack }: FechasImportantesManagementProps) {
  const [fechas, setFechas] = useState<Fecha[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFecha, setEditingFecha] = useState<Fecha>({
    fecha: '',
    hora: '',
    actividad: '',
    year: new Date().getFullYear()
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    fetchFechas();
    fetchAvailableYears();
  }, [selectedYear]);

  const fetchAvailableYears = async () => {
    try {
      const { data, error } = await driveRoutesSupabase
        .from('fechas_importantes')
        .select('year');

      if (error) throw error;

      const years = [...new Set(data?.map((item: { year: number }) => item.year) || [])].sort((a, b) => b - a);
      setAvailableYears(years);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const fetchFechas = async () => {
    try {
      setLoading(true);
      const { data, error } = await driveRoutesSupabase
        .from('fechas_importantes')
        .select('*')
        .eq('year', selectedYear)
        .order('fecha', { ascending: true });

      if (error) throw error;
      setFechas(data || []);
    } catch (error) {
      console.error('Error fetching fechas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!editingFecha.fecha || !editingFecha.actividad) {
        alert('Por favor completa los campos obligatorios (Fecha y Actividad)');
        return;
      }

      if (editingFecha.id) {
        // Update existing
        const { error } = await driveRoutesSupabase
          .from('fechas_importantes')
          .upsert({
            fecha: editingFecha.fecha,
            hora: editingFecha.hora || null,
            actividad: editingFecha.actividad,
            year: editingFecha.year
          })
          .eq('id', editingFecha.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await driveRoutesSupabase
          .from('fechas_importantes')
          .insert({
            fecha: editingFecha.fecha,
            hora: editingFecha.hora || null,
            actividad: editingFecha.actividad,
            year: editingFecha.year
          });

        if (error) throw error;
      }

      setIsEditing(false);
      setEditingFecha({
        fecha: '',
        hora: '',
        actividad: '',
        year: selectedYear
      });
      fetchFechas();
      fetchAvailableYears();
      alert('Fecha guardada exitosamente');
    } catch (error) {
      console.error('Error saving fecha:', error);
      alert('Error al guardar la fecha');
    }
  };

  const handleEdit = (fecha: Fecha) => {
    setEditingFecha(fecha);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta fecha?')) return;

    try {
      const { error } = await driveRoutesSupabase
        .from('fechas_importantes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchFechas();
      fetchAvailableYears();
      alert('Fecha eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting fecha:', error);
      alert('Error al eliminar la fecha');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingFecha({
      fecha: '',
      hora: '',
      actividad: '',
      year: selectedYear
    });
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver al Panel</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Fechas Importantes</h1>
              <p className="text-gray-600">Administra el calendario de actividades</p>
            </div>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-4 mt-4">
            <label className="text-gray-700 font-medium">Ver año:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
              {!availableYears.includes(new Date().getFullYear()) && (
                <option value={new Date().getFullYear()}>
                  {new Date().getFullYear()}
                </option>
              )}
            </select>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {isEditing ? 'Editar Fecha' : 'Agregar Nueva Fecha'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año *
              </label>
              <input
                type="number"
                value={editingFecha.year}
                onChange={(e) => setEditingFecha({ ...editingFecha, year: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                min="2024"
                max="2030"
              />
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={editingFecha.fecha}
                onChange={(e) => setEditingFecha({ ...editingFecha, fecha: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora (opcional)
              </label>
              <input
                type="text"
                value={editingFecha.hora}
                onChange={(e) => setEditingFecha({ ...editingFecha, hora: e.target.value })}
                placeholder="Ej: 19:00 hrs"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actividad */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actividad *
            </label>
            <textarea
              value={editingFecha.actividad}
              onChange={(e) => setEditingFecha({ ...editingFecha, actividad: e.target.value })}
              placeholder="Descripción de la actividad o evento"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>{isEditing ? 'Actualizar' : 'Guardar'}</span>
            </button>
            {isEditing && (
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
                <span>Cancelar</span>
              </button>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-4">
            * Campos obligatorios
          </p>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Fechas de {selectedYear} ({fechas.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : fechas.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay fechas registradas para {selectedYear}</p>
              <p className="text-sm text-gray-500 mt-2">Agrega la primera fecha usando el formulario arriba</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hora</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actividad</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fechas.map((fecha) => (
                    <tr key={fecha.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {formatFecha(fecha.fecha)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {fecha.hora || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {fecha.actividad}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(fecha)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(fecha.id!)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">Instrucciones</h3>
          <ol className="text-amber-800 space-y-2 list-decimal list-inside">
            <li>Completa los campos del formulario (Año, Fecha y Actividad son obligatorios)</li>
            <li>La hora es opcional - déjala vacía si el evento es todo el día</li>
            <li>Para períodos (ej: "del 20 al 25"), inclúyelo en la descripción de la actividad</li>
            <li>Puedes editar o eliminar fechas existentes usando los botones en la tabla</li>
            <li>Las fechas se ordenan automáticamente por fecha en la vista pública</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
