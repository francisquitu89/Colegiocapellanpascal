import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ConsejoDirectivoProps {
  onBack: () => void;
}

interface ConsejoDirectivoData {
  description: string;
  names: string[];
  photoPath?: string;
}

interface MiembroEquipo {
  id: string;
  nombre: string;
  cargo: string | null;
  foto_url: string | null;
  curriculum: string | null;
  orden: number;
}

const ConsejoDirectivo: React.FC<ConsejoDirectivoProps> = ({ onBack }) => {
  const [data, setData] = useState<ConsejoDirectivoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([]);

  useEffect(() => {
    fetchData();
    fetchMiembros();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Cargar el JSON desde Supabase Storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from('images')
        .download('consejo_directivo/data.json');

      if (fileError) {
        console.error('Error loading data:', fileError);
        setLoading(false);
        return;
      }

      const text = await fileData.text();
      const jsonData = JSON.parse(text) as ConsejoDirectivoData;
      setData(jsonData);

      // Si hay una imagen, obtener su URL
      if (jsonData.photoPath) {
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(jsonData.photoPath);

        if (urlData.publicUrl) {
          setImageUrl(urlData.publicUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMiembros = async () => {
    try {
      const { data: membersData, error } = await supabase
        .from('equipo_consejo_directivo')
        .select('*')
        .order('orden', { ascending: true });

      if (error) throw error;
      setMiembros(membersData || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header con botón de regreso */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Consejo Directivo
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : data ? (
          <div className="space-y-8">
            {/* Imagen centrada */}
            {imageUrl && (
              <div className="relative w-full max-w-3xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={imageUrl}
                    alt="Consejo Directivo"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}

            {/* Cuadro de descripción con diseño elegante */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-blue-600">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {data.description}
              </p>
            </div>

            {/* Nombres como caption debajo */}
            {data.names && data.names.length > 0 && (
              <div className="text-center">
                <p className="text-gray-600 text-sm italic">
                  {data.names.join(' • ')}
                </p>
              </div>
            )}

            {/* Sección de Perfiles del Equipo */}
            {miembros.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                  Nuestro Equipo
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {miembros.map((miembro) => (
                    <div
                      key={miembro.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                    >
                      {/* Foto de perfil */}
                      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100">
                        {miembro.foto_url ? (
                          <img
                            src={miembro.foto_url}
                            alt={miembro.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                              <svg
                                className="w-16 h-16 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Información del perfil */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {miembro.nombre}
                        </h3>
                        
                        {miembro.cargo && (
                          <p className="text-blue-600 font-semibold mb-3">
                            {miembro.cargo}
                          </p>
                        )}

                        {miembro.curriculum && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                              {miembro.curriculum}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              No hay información disponible en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsejoDirectivo;
