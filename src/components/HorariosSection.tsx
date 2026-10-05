import React, { useState, useEffect } from 'react';
import { Clock, Download, FileText, Calendar, ArrowLeft } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';

interface DocumentoHorario {
  id: number;
  title: string;
  file_url: string;
  year: string;
  categoria: string;
}

interface HorariosSectionProps {
  onBack: () => void;
}

const HorariosSection: React.FC<HorariosSectionProps> = ({ onBack }) => {
  const [documentos, setDocumentos] = useState<DocumentoHorario[]>([]);
  const [loading, setLoading] = useState(true);

  // Categorías de horarios
  const categorias = [
    'Horarios Primer Ciclo',
    'Horarios Segundo Ciclo',
    'Horarios Enseñanza Media Menor',
    'Horarios Educación Media Superior',
    'Horarios ACLEs'
  ];

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    setLoading(true);
    try {
      // Intentar leer del servidor secundario (antiguo) primero
      let result = await supabase
        .from('horarios')
        .select('*')
        .order('year', { ascending: false });

      // Si falla o no hay datos, usar servidor principal
      if (result.error || !result.data || result.data.length === 0) {
        console.log('Fallback a servidor principal para horarios');
        result = await driveRoutesSupabase
          .from('horarios')
          .select('*')
          .order('year', { ascending: false });
      }

      if (result.error) throw result.error;
      if (result.data) setDocumentos(result.data);
    } catch (error) {
      console.error('Error fetching horarios:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Botón Volver */}
        <button
          onClick={onBack}
          className="flex items-center text-green-600 hover:text-green-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </button>

        {/* Encabezado */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Horarios Escolares
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Consulta los horarios de clases actualizados por ciclo educativo
          </p>
        </div>

        {/* Información General */}
        <div className="mb-12 bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
          <div className="flex items-start space-x-4 mb-6">
            <Calendar className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Información sobre Horarios
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  Los horarios escolares están diseñados para optimizar el aprendizaje de nuestros estudiantes, 
                  distribuyendo equilibradamente las asignaturas a lo largo de la semana. Cada ciclo educativo cuenta 
                  con un horario específico que incluye las horas de clases, recreos y actividades complementarias.
                </p>
                <p>
                  Es fundamental que los estudiantes y apoderados conozcan y respeten los horarios establecidos, 
                  ya que la puntualidad es un valor esencial en nuestra comunidad educativa.
                </p>
              </div>
            </div>
          </div>

          {/* Normativa de Horarios */}
          <div className="mt-8 bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-6 h-6 text-green-600 mr-2" />
              Consideraciones Importantes
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">•</span>
                <span>
                  <strong>Puntualidad:</strong> Los estudiantes deben llegar al establecimiento al menos 10 minutos 
                  antes del inicio de clases.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">•</span>
                <span>
                  <strong>Cambios de Horario:</strong> Cualquier modificación en el horario será comunicada con 
                  anticipación a través de la libreta de comunicaciones o plataforma digital.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">•</span>
                <span>
                  <strong>Horarios Diferenciados:</strong> Los niveles de Pre-Escolar tienen horarios especiales 
                  adaptados a las necesidades de los párvulos.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Lista de Horarios por Categoría */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Cargando horarios...</p>
          </div>
        ) : documentos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentos.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-green-500"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {doc.year}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="bg-teal-100 text-teal-800 px-3 py-2 rounded-lg text-center font-bold mb-3">
                      {doc.categoria}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {doc.title}
                    </h3>
                  </div>
                  
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center space-x-2 group shadow-md hover:shadow-lg"
                  >
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    <span className="font-semibold">Descargar Horario</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No hay horarios disponibles en este momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorariosSection;
