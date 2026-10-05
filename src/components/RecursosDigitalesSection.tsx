import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Download, ExternalLink, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RecursosDigitalesProps {
  onBack: () => void;
}

interface InstructivoClassroom {
  id: number;
  title: string;
  file_url: string;
  updated_at: string;
}

const RecursosDigitalesSection: React.FC<RecursosDigitalesProps> = ({ onBack }) => {
  const [instructivo, setInstructivo] = useState<InstructivoClassroom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructivo();
  }, []);

  const fetchInstructivo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('instructivo_classroom')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setInstructivo(data);
    } catch (error) {
      console.error('Error fetching instructivo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Botón Volver */}
        <button
          onClick={onBack}
          className="flex items-center text-purple-600 hover:text-purple-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </button>

        {/* Encabezado */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-16 h-16 text-purple-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Recursos Digitales
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Accede a nuestras plataformas educativas virtuales
          </p>
        </div>

        {/* Google Classroom */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl p-8 border-t-4 border-purple-500">
          <div className="flex items-start space-x-4 mb-6">
            <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ClassRoom CSFR
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Bienvenidos al entorno virtual Google ClassRoom!
              </p>

              {/* Instructivo */}
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                </div>
              ) : instructivo ? (
                <div className="bg-purple-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-purple-600" />
                      <div>
                        <h3 className="font-bold text-gray-900">{instructivo.title}</h3>
                        <p className="text-sm text-gray-600">Manual de acceso a ClassRoom</p>
                      </div>
                    </div>
                    <a
                      href={instructivo.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Descargar</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-500 text-sm">No hay instructivo disponible en este momento</p>
                </div>
              )}

              {/* Botón a ClassRoom */}
              <a
                href="https://classroom.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 space-x-3"
              >
                <BookOpen className="w-6 h-6" />
                <span>Acceder a Google ClassRoom</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* SchoolNet */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                SchoolNet Colegium
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Les compartimos este manual para acceder a sus asignaturas por curso.
              </p>

              {/* Información */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">¿Qué es SchoolNet?</h3>
                <p className="text-gray-700">
                  SchoolNet es la plataforma de gestión educativa donde podrás consultar:
                </p>
                <ul className="mt-3 space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Notas y calificaciones</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Asistencia y atrasos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Comunicados del colegio</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Información de cursos y asignaturas</span>
                  </li>
                </ul>
              </div>

              {/* Botón a SchoolNet */}
              <a
                href="https://schoolnet.colegium.com/webapp/es_CL/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 space-x-3"
              >
                <BookOpen className="w-6 h-6" />
                <span>Acceder a SchoolNet</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Información de ayuda */}
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border-l-4 border-purple-500">
          <h3 className="text-xl font-bold text-gray-900 mb-3">💡 ¿Necesitas ayuda?</h3>
          <p className="text-gray-700">
            Si tienes problemas para acceder a las plataformas o necesitas asistencia técnica, 
            por favor contacta a la administración del colegio o envía un correo a soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecursosDigitalesSection;
