import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Calendar, Shirt } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UniformesEscolaresProps {
  onBack: () => void;
}

interface DocumentoUniformes {
  id: number;
  title: string;
  file_url: string;
  year: string;
  tipo: string;
  created_at: string;
}

const UniformesEscolaresSection: React.FC<UniformesEscolaresProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [documentos, setDocumentos] = useState<DocumentoUniformes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTipo, setSelectedTipo] = useState<string>('Todos');

  const tipos = ['Todos', 'Diario', 'Educación Física', 'Formal'];

  useEffect(() => {
    setIsVisible(true);
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    try {
      const { data, error } = await supabase
        .from('uniformes_escolares')
        .select('*')
        .order('year', { ascending: false })
        .order('tipo');

      if (error) throw error;
      if (data) setDocumentos(data);
    } catch (error) {
      console.error('Error fetching documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const documentosFiltrados = selectedTipo === 'Todos' 
    ? documentos 
    : documentos.filter(doc => doc.tipo === selectedTipo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-indigo-600 hover:text-indigo-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Uniformes Escolares
            </h1>
            <p className="text-lg text-gray-600">Información sobre los uniformes del colegio</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Descripción */}
        <div className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <Shirt className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white">Información General</h2>
              </div>
            </div>
            
            <div className="p-8 space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                El uniforme escolar es parte fundamental de nuestra identidad institucional y promueve 
                valores de igualdad, pertenencia y respeto en nuestra comunidad educativa.
              </p>
              
              <p className="text-lg">
                Encuentra aquí toda la información necesaria sobre los uniformes requeridos para cada 
                actividad escolar, incluyendo especificaciones, proveedores autorizados y normativas de uso.
              </p>

              <div className="bg-indigo-50 rounded-xl p-6 mt-6 border-l-4 border-indigo-600">
                <h3 className="text-xl font-bold text-indigo-900 mb-3">Normativa de Uso</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    <span>El uniforme debe presentarse en perfectas condiciones de limpieza y presentación.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    <span>Todas las prendas deben estar marcadas con el nombre del estudiante.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    <span>El uso del uniforme completo es obligatorio según calendario escolar.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    <span>El uniforme de Educación Física debe usarse solo los días con clase de la asignatura.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-wrap gap-3 justify-center">
            {tipos.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setSelectedTipo(tipo)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedTipo === tipo
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        {/* Documentos */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-semibold text-[#2E3A87] mb-2">
              Especificaciones de Uniformes
            </h2>
            <div className="w-48 h-1 bg-[#8B5E3C] mx-auto rounded"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : documentosFiltrados.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentosFiltrados.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                          {doc.year}
                        </span>
                        <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                          {doc.tipo}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold line-clamp-2">
                      {doc.title}
                    </h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Publicado: {new Date(doc.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
                    
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg"
                    >
                      <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                      <span className="font-semibold">Descargar Info</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <Shirt className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No hay documentos disponibles
              </h3>
              <p className="text-gray-500 text-lg">
                {selectedTipo === 'Todos' 
                  ? 'Aún no se han publicado documentos sobre uniformes escolares.'
                  : `No hay documentos disponibles para ${selectedTipo}.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniformesEscolaresSection;
