import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ValoresData {
  id: number;
  matricula_hermanos: {
    hijo2: { porcentaje: number; uf: number };
    hijo3: { porcentaje: number; uf: number };
    hijo4: { porcentaje: number; uf: number };
    hijo5_mas: { porcentaje: number; uf: number };
  };
  otros_cargos: {
    matricula_2026: { valor: number; unidad: string };
    seguro_vida_iv_medio: { valor: number; unidad: string; descripcion: string };
    seguro_vida_superior: { valor: number; unidad: string; descripcion: string };
    cuota_centro_padres: { valor: number; unidad: string };
    acciona: { valor: number; unidad: string; descripcion: string };
    cuota_centro_alumnos: { valor: number; unidad: string };
    aporte_exalumnos: { valor: string; unidad: string; descripcion: string };
  };
}

interface ValoresManagementProps {
  onBack: () => void;
}

const ValoresManagement: React.FC<ValoresManagementProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState<ValoresData>({
    id: 1,
    matricula_hermanos: {
      hijo2: { porcentaje: 75, uf: 56.25 },
      hijo3: { porcentaje: 50, uf: 37.5 },
      hijo4: { porcentaje: 25, uf: 18.75 },
      hijo5_mas: { porcentaje: 0, uf: 0 }
    },
    otros_cargos: {
      matricula_2026: { valor: 13, unidad: "por hijo" },
      seguro_vida_iv_medio: { 
        valor: 0.5994, 
        unidad: "por cada hijo/a", 
        descripcion: "Seguro de vida y escolaridad hasta IV Medio (sept. 2025 a feb. 2026, valor proporcional)" 
      },
      seguro_vida_superior: { 
        valor: 1.1247, 
        unidad: "por hijo/a", 
        descripcion: "Seguro de vida y escolaridad hasta Educación Superior" 
      },
      cuota_centro_padres: { valor: 1.9, unidad: "por Familia" },
      acciona: { valor: 0.6, unidad: "por Familia", descripcion: "ex Fundación de Ayuda Mutua" },
      cuota_centro_alumnos: { valor: 0.2, unidad: "por Familia" },
      aporte_exalumnos: { 
        valor: "Voluntario", 
        unidad: "", 
        descripcion: "Aporte voluntario Asociación de Exalumnos" 
      }
    }
  });

  useEffect(() => {
    fetchValores();
  }, []);

  const fetchValores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('valores_matricula')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching valores:', error);
        throw error;
      }
      
      if (data) {
        setFormData(data);
      }
      // Si no hay data, se mantienen los valores predeterminados
    } catch (error) {
      console.error('Error fetching valores:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error al cargar los datos. Se muestran valores predeterminados.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const dataToSave = {
        id: 1,
        matricula_hermanos: formData.matricula_hermanos,
        otros_cargos: formData.otros_cargos,
        updated_at: new Date().toISOString()
      };

      // Usar upsert que inserta o actualiza automáticamente
      const { data, error } = await supabase
        .from('valores_matricula')
        .upsert(dataToSave, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Datos guardados exitosamente:', data);
      setMessage({ type: 'success', text: 'Valores actualizados correctamente' });
      
      // Recargar datos después de un pequeño delay
      setTimeout(() => {
        fetchValores();
      }, 500);
    } catch (error: any) {
      console.error('Error saving valores:', error);
      setMessage({ 
        type: 'error', 
        text: `Error al guardar los cambios: ${error.message || 'Error desconocido'}` 
      });
    } finally {
      setSaving(false);
    }
  };

  const updateMatriculaHermanos = (hijo: 'hijo2' | 'hijo3' | 'hijo4' | 'hijo5_mas', field: 'porcentaje' | 'uf', value: string) => {
    setFormData({
      ...formData,
      matricula_hermanos: {
        ...formData.matricula_hermanos,
        [hijo]: {
          ...formData.matricula_hermanos[hijo],
          [field]: parseFloat(value) || 0
        }
      }
    });
  };

  const updateOtrosCargos = (cargo: string, field: 'valor' | 'unidad' | 'descripcion', value: string) => {
    const currentCargo = formData.otros_cargos[cargo as keyof typeof formData.otros_cargos];
    
    setFormData({
      ...formData,
      otros_cargos: {
        ...formData.otros_cargos,
        [cargo]: {
          ...currentCargo,
          [field]: field === 'valor' && cargo !== 'aporte_exalumnos' ? parseFloat(value) || 0 : value
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al Panel de Administración
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Valores de Matrícula</h1>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Forms */}
        <div className="space-y-8">
          {/* Matrícula de Incorporación para Hermanos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Porcentaje de pago de la matrícula de incorporación para hermanos
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Configure los porcentajes y valores en UF para cada número de hijo
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {/* 2º hijo */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">2º hijo</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Porcentaje (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.matricula_hermanos.hijo2.porcentaje}
                      onChange={(e) => updateMatriculaHermanos('hijo2', 'porcentaje', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UF</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.matricula_hermanos.hijo2.uf}
                      onChange={(e) => updateMatriculaHermanos('hijo2', 'uf', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 3º hijo */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">3º hijo</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Porcentaje (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.matricula_hermanos.hijo3.porcentaje}
                      onChange={(e) => updateMatriculaHermanos('hijo3', 'porcentaje', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UF</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.matricula_hermanos.hijo3.uf}
                      onChange={(e) => updateMatriculaHermanos('hijo3', 'uf', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 4º hijo */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">4º hijo</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Porcentaje (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.matricula_hermanos.hijo4.porcentaje}
                      onChange={(e) => updateMatriculaHermanos('hijo4', 'porcentaje', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UF</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.matricula_hermanos.hijo4.uf}
                      onChange={(e) => updateMatriculaHermanos('hijo4', 'uf', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 5º o más */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">5º o más</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Porcentaje (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.matricula_hermanos.hijo5_mas.porcentaje}
                      onChange={(e) => updateMatriculaHermanos('hijo5_mas', 'porcentaje', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UF</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.matricula_hermanos.hijo5_mas.uf}
                      onChange={(e) => updateMatriculaHermanos('hijo5_mas', 'uf', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Otros Cargos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Otros Cargos</h2>
            <div className="space-y-6">
              {/* Matrícula 2026 */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Matrícula 2026</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor (UF)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.otros_cargos.matricula_2026.valor}
                      onChange={(e) => updateOtrosCargos('matricula_2026', 'valor', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unidad</label>
                    <input
                      type="text"
                      value={formData.otros_cargos.matricula_2026.unidad}
                      onChange={(e) => updateOtrosCargos('matricula_2026', 'unidad', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Seguro de vida IV Medio */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Seguro de vida y escolaridad hasta IV Medio</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor (UF)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.otros_cargos.seguro_vida_iv_medio.valor}
                      onChange={(e) => updateOtrosCargos('seguro_vida_iv_medio', 'valor', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unidad</label>
                    <input
                      type="text"
                      value={formData.otros_cargos.seguro_vida_iv_medio.unidad}
                      onChange={(e) => updateOtrosCargos('seguro_vida_iv_medio', 'unidad', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={formData.otros_cargos.seguro_vida_iv_medio.descripcion}
                    onChange={(e) => updateOtrosCargos('seguro_vida_iv_medio', 'descripcion', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Seguro de vida Educación Superior */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Seguro de vida y escolaridad hasta Educación Superior</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor (UF)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.otros_cargos.seguro_vida_superior.valor}
                      onChange={(e) => updateOtrosCargos('seguro_vida_superior', 'valor', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unidad</label>
                    <input
                      type="text"
                      value={formData.otros_cargos.seguro_vida_superior.unidad}
                      onChange={(e) => updateOtrosCargos('seguro_vida_superior', 'unidad', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={formData.otros_cargos.seguro_vida_superior.descripcion}
                    onChange={(e) => updateOtrosCargos('seguro_vida_superior', 'descripcion', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Cuota Centro de Padres */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Cuota Centro de Padres</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor (UF)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.otros_cargos.cuota_centro_padres.valor}
                      onChange={(e) => updateOtrosCargos('cuota_centro_padres', 'valor', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unidad</label>
                    <input
                      type="text"
                      value={formData.otros_cargos.cuota_centro_padres.unidad}
                      onChange={(e) => updateOtrosCargos('cuota_centro_padres', 'unidad', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Acciona */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Acciona</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor (UF)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.otros_cargos.acciona.valor}
                      onChange={(e) => updateOtrosCargos('acciona', 'valor', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unidad</label>
                    <input
                      type="text"
                      value={formData.otros_cargos.acciona.unidad}
                      onChange={(e) => updateOtrosCargos('acciona', 'unidad', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <input
                    type="text"
                    value={formData.otros_cargos.acciona.descripcion}
                    onChange={(e) => updateOtrosCargos('acciona', 'descripcion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Cuota Centro de Alumnos */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Cuota Centro de Alumnos</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor (UF)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.otros_cargos.cuota_centro_alumnos.valor}
                      onChange={(e) => updateOtrosCargos('cuota_centro_alumnos', 'valor', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unidad</label>
                    <input
                      type="text"
                      value={formData.otros_cargos.cuota_centro_alumnos.unidad}
                      onChange={(e) => updateOtrosCargos('cuota_centro_alumnos', 'unidad', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Aporte Exalumnos */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Aporte Asociación de Exalumnos</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <input
                    type="text"
                    value={formData.otros_cargos.aporte_exalumnos.descripcion}
                    onChange={(e) => updateOtrosCargos('aporte_exalumnos', 'descripcion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValoresManagement;
