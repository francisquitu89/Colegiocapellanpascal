import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Users, FileText, Loader } from 'lucide-react';
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
  updated_at: string;
}

interface ValoresSectionProps {
  onBack: () => void;
}

const ValoresSection: React.FC<ValoresSectionProps> = ({ onBack }) => {
  const [valoresData, setValoresData] = useState<ValoresData | null>(null);
  const [loading, setLoading] = useState(true);

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
        setValoresData(data);
      } else {
        // Si no hay datos en la BD, usar valores predeterminados
        setValoresData({
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
          },
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error fetching valores:', error);
      // Set default values if database query fails
      setValoresData({
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
        },
        updated_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Botón Volver */}
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </button>

        {/* Encabezado */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <DollarSign className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Matrícula y Colegiaturas 2026
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Información detallada sobre los costos y aranceles del colegio
          </p>
        </div>

        {/* Contenido Principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Cargando información...</p>
          </div>
        ) : valoresData ? (
          <div className="space-y-8">
            {/* Tabla de porcentaje de pago de matrícula de incorporación para hermanos */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Porcentaje de pago de la matrícula de incorporación para los hermanos y hermanas:
                </h2>
              </div>
              
              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border border-gray-300 px-6 py-3 text-left font-semibold">Número de hijo</th>
                      <th className="border border-gray-300 px-6 py-3 text-center font-semibold">2º</th>
                      <th className="border border-gray-300 px-6 py-3 text-center font-semibold">3º</th>
                      <th className="border border-gray-300 px-6 py-3 text-center font-semibold">4º</th>
                      <th className="border border-gray-300 px-6 py-3 text-center font-semibold">5º o más</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-6 py-3 font-semibold text-gray-700">% de pago</td>
                      <td className="border border-gray-300 px-6 py-3 text-center text-lg font-bold text-blue-600">
                        {valoresData.matricula_hermanos.hijo2.porcentaje}%
                      </td>
                      <td className="border border-gray-300 px-6 py-3 text-center text-lg font-bold text-blue-600">
                        {valoresData.matricula_hermanos.hijo3.porcentaje}%
                      </td>
                      <td className="border border-gray-300 px-6 py-3 text-center text-lg font-bold text-blue-600">
                        {valoresData.matricula_hermanos.hijo4.porcentaje}%
                      </td>
                      <td className="border border-gray-300 px-6 py-3 text-center text-lg font-bold text-blue-600">
                        {valoresData.matricula_hermanos.hijo5_mas.porcentaje}%
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-6 py-3 font-semibold text-gray-700">UF</td>
                      <td className="border border-gray-300 px-6 py-3 text-center text-lg font-bold text-blue-600">
                        {valoresData.matricula_hermanos.hijo2.uf}
                      </td>
                      <td className="border border-gray-300 px-6 py-3 text-center text-lg font-bold text-blue-600">
                        {valoresData.matricula_hermanos.hijo3.uf}
                      </td>
                      <td className="border border-gray-300 px-6 py-3 text-center text-lg font-bold text-blue-600">
                        {valoresData.matricula_hermanos.hijo4.uf}
                      </td>
                      <td className="border border-gray-300 px-6 py-3 text-center text-lg font-bold text-blue-600">
                        {valoresData.matricula_hermanos.hijo5_mas.uf > 0 ? valoresData.matricula_hermanos.hijo5_mas.uf : ''}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Otros Cargos */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-indigo-500">
              <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Otros Cargos
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-800 text-lg">•</span>
                  <span className="ml-3 text-gray-700">
                    <span className="font-semibold">Matrícula 2026:</span> UF {valoresData.otros_cargos.matricula_2026.valor} {valoresData.otros_cargos.matricula_2026.unidad}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-800 text-lg mt-1">•</span>
                  <span className="ml-3 text-gray-700">
                    {valoresData.otros_cargos.seguro_vida_iv_medio.descripcion}: UF {valoresData.otros_cargos.seguro_vida_iv_medio.valor} {valoresData.otros_cargos.seguro_vida_iv_medio.unidad}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-800 text-lg mt-1">•</span>
                  <span className="ml-3 text-gray-700">
                    {valoresData.otros_cargos.seguro_vida_superior.descripcion}: UF {valoresData.otros_cargos.seguro_vida_superior.valor} x {valoresData.otros_cargos.seguro_vida_superior.unidad}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-800 text-lg">•</span>
                  <span className="ml-3 text-gray-700">
                    <span className="font-semibold">Cuota Centro de Padres:</span> UF {valoresData.otros_cargos.cuota_centro_padres.valor} {valoresData.otros_cargos.cuota_centro_padres.unidad}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-800 text-lg mt-1">•</span>
                  <span className="ml-3 text-gray-700">
                    <span className="font-semibold">Acciona</span> ({valoresData.otros_cargos.acciona.descripcion}): UF {valoresData.otros_cargos.acciona.valor} {valoresData.otros_cargos.acciona.unidad}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-800 text-lg">•</span>
                  <span className="ml-3 text-gray-700">
                    <span className="font-semibold">Cuota Centro de Alumnos:</span> UF {valoresData.otros_cargos.cuota_centro_alumnos.valor} {valoresData.otros_cargos.cuota_centro_alumnos.unidad}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-800 text-lg">•</span>
                  <span className="ml-3 text-gray-700">
                    {valoresData.otros_cargos.aporte_exalumnos.descripcion}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              La información de valores no está disponible en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValoresSection;
