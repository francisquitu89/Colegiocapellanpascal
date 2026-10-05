import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Calendar, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UtilesEscolaresProps {
  onBack: () => void;
}

interface DocumentoUtiles {
  id: number;
  title: string;
  file_url: string;
  year: string;
  nivel: string;
  created_at: string;
}

const UtilesEscolaresSection: React.FC<UtilesEscolaresProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [documentos, setDocumentos] = useState<DocumentoUtiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNivel, setSelectedNivel] = useState<string>('Todos');

  const niveles = ['Todos', 'Pre-Escolar', 'Básica', 'Media'];

  useEffect(() => {
    setIsVisible(true);
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    try {
      const { data, error } = await supabase
        .from('utiles_escolares')
        .select('*')
        .order('year', { ascending: false })
        .order('nivel');

      if (error) throw error;
      if (data) setDocumentos(data);
    } catch (error) {
      console.error('Error fetching documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const documentosFiltrados = selectedNivel === 'Todos' 
    ? documentos 
    : documentos.filter(doc => doc.nivel === selectedNivel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Útiles Escolares
            </h1>
            <p className="text-lg text-gray-600">Lista de materiales y útiles por nivel</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Descripción */}
        <div className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white">Información General</h2>
              </div>
            </div>
            
            <div className="p-8 space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Encuentra aquí las listas de útiles escolares para cada nivel educativo. Estos documentos 
                contienen todos los materiales necesarios para el año escolar, organizados por curso y asignatura.
              </p>
              
              <p className="text-lg">
                Te recomendamos descargar la lista correspondiente al nivel de tu hijo/a y adquirir los materiales 
                con anticipación para estar preparados desde el primer día de clases.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 mt-6 border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Recomendaciones Importantes</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Revisa cuidadosamente la lista completa antes de comprar.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Marca todos los útiles con el nombre del alumno.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Las listas se actualizan anualmente según las necesidades pedagógicas.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Consulta con el profesor/a en caso de dudas sobre algún material.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-wrap gap-3 justify-center">
            {niveles.map((nivel) => (
              <button
                key={nivel}
                onClick={() => setSelectedNivel(nivel)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedNivel === nivel
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                {nivel}
              </button>
            ))}
          </div>
        </div>

        {/* Documentos */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-semibold text-[#2E3A87] mb-2">
              Listas de Útiles
            </h2>
            <div className="w-48 h-1 bg-[#8B5E3C] mx-auto rounded"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : documentosFiltrados.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentosFiltrados.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                          {doc.year}
                        </span>
                        <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                          {doc.nivel}
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
                      className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group-hover:shadow-lg"
                    >
                      <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                      <span className="font-semibold">Descargar Lista</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No hay documentos disponibles
              </h3>
              <p className="text-gray-500 text-lg">
                {selectedNivel === 'Todos' 
                  ? 'Aún no se han publicado listas de útiles escolares.'
                  : `No hay listas disponibles para ${selectedNivel}.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UtilesEscolaresSection;
