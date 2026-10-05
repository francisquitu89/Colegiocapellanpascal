import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface FundacionData {
  description: string;
  names: string[];
  photoPath?: string; // storage path inside bucket
}

interface MiembroEquipo {
  id: string;
  nombre: string;
  cargo: string | null;
  foto_url: string | null;
  curriculum: string | null;
  orden: number;
}

const BUCKET = 'images';
const JSON_PATH = 'fundacion_directorio/data.json';
const PHOTO_FOLDER = 'fundacion_directorio';

const DirectorioFundacion: React.FC = () => {
  const [data, setData] = useState<FundacionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([]);

  useEffect(() => {
    fetchData();
    fetchMiembros();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Try to download JSON file from storage
      const { data: file, error } = await supabase.storage.from(BUCKET).download(JSON_PATH);
      if (error) {
        // If not found, initialize empty
        console.warn('No JSON found for fundacion directorio:', error.message);
        setData({ description: '', names: [], photoPath: undefined });
      } else {
        const text = await file.text();
        const parsed = JSON.parse(text) as FundacionData;
        setData(parsed);
        if (parsed.photoPath) {
          const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(parsed.photoPath);
          setPhotoUrl(urlData.publicUrl);
        }
      }
    } catch (err) {
      console.error('Error fetching fundacion data', err);
      setData({ description: '', names: [], photoPath: undefined });
    } finally {
      setLoading(false);
    }
  };

  const fetchMiembros = async () => {
    try {
      const { data: membersData, error } = await supabase
        .from('equipo_fundacion')
        .select('*')
        .order('orden', { ascending: true });

      if (error) throw error;
      setMiembros(membersData || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };



  if (loading || !data) {
    return <div className="py-8 text-center text-gray-600">Cargando Directorio Fundación...</div>;
  }

  return (
    <div className="overflow-hidden">
      <div className="p-8 md:p-12">
        {/* Image Section */}
        <div className="mb-12">
          <div className="relative">
            {photoUrl ? (
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={photoUrl}
                  alt="Directorio Fundación"
                  className="w-full h-auto max-h-[600px] object-contain mx-auto"
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                <p className="text-gray-400 text-lg">No hay foto cargada</p>
              </div>
            )}
            
            {/* Names directly below image */}
            {data.names && data.names.length > 0 && (
              <div className="text-center mt-3">
                <p className="text-gray-700 text-sm italic">
                  Izquierda a derecha: {data.names.join(', ')}
                </p>
              </div>
            )}
            
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-200 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>

        {/* Description Section */}
        {data.description && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg shadow-md p-6 mb-8 border-t-4 border-red-600">
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
              {data.description}
            </p>
          </div>
        )}

        {/* Sección de Perfiles del Equipo */}
        {miembros.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Nuestro Equipo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {miembros.map((miembro) => (
                <div
                  key={miembro.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  {/* Foto de perfil */}
                  <div className="relative h-64 bg-gradient-to-br from-red-50 to-rose-100">
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
                      <p className="text-red-600 font-semibold mb-3">
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
    </div>
  );
};

export default DirectorioFundacion;
