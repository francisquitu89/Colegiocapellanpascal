import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Users, ExternalLink } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';

interface ComunidadSectionProps {
  onBack: () => void;
}

interface Bloque {
  id: string;
  bloque_numero: number;
  titulo: string;
  descripcion: string;
  boton_texto: string;
  boton_url: string;
  mostrar_integrantes: boolean;
  activo: boolean;
  order_index: number;
}

interface Foto {
  id: string;
  bloque_id: string;
  photo_url: string;
  photo_name: string;
  caption: string;
  order_index: number;
}

interface Integrante {
  id: string;
  bloque_id: string;
  nombre: string;
  cargo: string;
  foto_url: string;
  email: string;
  telefono: string;
  descripcion: string;
  order_index: number;
}

const ComunidadSection: React.FC<ComunidadSectionProps> = ({ onBack }) => {
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [fotos, setFotos] = useState<{ [bloqueId: string]: Foto[] }>({});
  const [integrantes, setIntegrantes] = useState<{ [bloqueId: string]: Integrante[] }>({});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<{ [bloqueId: string]: number }>({});
  const [selectedBloque, setSelectedBloque] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Obtener bloques activos - intentar servidor secundario primero
      let bloquesResult = await supabase
        .from('comunidad_bloques')
        .select('*')
        .eq('activo', true)
        .order('order_index');

      if (bloquesResult.error || !bloquesResult.data || bloquesResult.data.length === 0) {
        console.log('Fallback a servidor principal para comunidad_bloques');
        bloquesResult = await driveRoutesSupabase
          .from('comunidad_bloques')
          .select('*')
          .eq('activo', true)
          .order('order_index');
      }

      if (bloquesResult.error) throw bloquesResult.error;
      const bloquesData = bloquesResult.data || [];
      setBloques(bloquesData);

      // Obtener fotos para cada bloque - intentar servidor secundario primero
      let fotosResult = await supabase
        .from('comunidad_fotos')
        .select('*')
        .order('order_index');

      if (fotosResult.error || !fotosResult.data) {
        console.log('Fallback a servidor principal para comunidad_fotos');
        fotosResult = await driveRoutesSupabase
          .from('comunidad_fotos')
          .select('*')
          .order('order_index');
      }

      if (fotosResult.error) throw fotosResult.error;
      const fotosData = fotosResult.data || [];

      // Organizar fotos por bloque
      const fotosPorBloque: { [bloqueId: string]: Foto[] } = {};
      const indices: { [bloqueId: string]: number } = {};
      
      fotosData?.forEach((foto) => {
        if (!fotosPorBloque[foto.bloque_id]) {
          fotosPorBloque[foto.bloque_id] = [];
          indices[foto.bloque_id] = 0;
        }
        fotosPorBloque[foto.bloque_id].push(foto);
      });

      setFotos(fotosPorBloque);
      setCurrentPhotoIndex(indices);

      // Obtener integrantes para cada bloque - intentar servidor secundario primero
      let integrantesResult = await supabase
        .from('comunidad_integrantes')
        .select('*')
        .order('order_index');

      if (integrantesResult.error || !integrantesResult.data) {
        console.log('Fallback a servidor principal para comunidad_integrantes');
        integrantesResult = await driveRoutesSupabase
          .from('comunidad_integrantes')
          .select('*')
          .order('order_index');
      }

      if (integrantesResult.error) throw integrantesResult.error;
      const integrantesData = integrantesResult.data || [];

      // Organizar integrantes por bloque
      const integrantesPorBloque: { [bloqueId: string]: Integrante[] } = {};
      integrantesData?.forEach((integrante) => {
        if (!integrantesPorBloque[integrante.bloque_id]) {
          integrantesPorBloque[integrante.bloque_id] = [];
        }
        integrantesPorBloque[integrante.bloque_id].push(integrante);
      });

      setIntegrantes(integrantesPorBloque);
    } catch (error) {
      console.error('Error fetching comunidad data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextPhoto = (bloqueId: string) => {
    const bloquefotos = fotos[bloqueId] || [];
    if (bloquefotos.length > 0) {
      setCurrentPhotoIndex((prev) => ({
        ...prev,
        [bloqueId]: ((prev[bloqueId] || 0) + 1) % bloquefotos.length,
      }));
    }
  };

  const prevPhoto = (bloqueId: string) => {
    const bloquefotos = fotos[bloqueId] || [];
    if (bloquefotos.length > 0) {
      setCurrentPhotoIndex((prev) => ({
        ...prev,
        [bloqueId]: ((prev[bloqueId] || 0) - 1 + bloquefotos.length) % bloquefotos.length,
      }));
    }
  };

  const handleBloqueClick = (bloqueId: string, url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      setSelectedBloque(selectedBloque === bloqueId ? null : bloqueId);
    }
  };

  const scrollToBloque = (bloqueId: string) => {
    const element = document.getElementById(`bloque-${bloqueId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando comunidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Volver
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Comunidad y Espiritualidad SS.CC.
            </h1>
          </div>

          {/* Accesos Rápidos a Secciones */}
          {bloques.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Accesos Rápidos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {bloques.map((bloque, index) => {
                  const iconColors = [
                    'text-yellow-600',
                    'text-blue-600',
                    'text-indigo-600',
                    'text-purple-600',
                    'text-green-600',
                    'text-red-600',
                    'text-pink-600',
                    'text-orange-600',
                  ];
                  const colorClass = iconColors[index % iconColors.length];
                  
                  return (
                    <button
                      key={bloque.id}
                      onClick={() => scrollToBloque(bloque.id)}
                      className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <Users className={`w-12 h-12 ${colorClass} mb-3 group-hover:scale-110 transition-transform`} />
                      <span className="text-base font-semibold text-gray-700 text-center">{bloque.titulo}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Texto descriptivo con imagen */}
          <div className="mb-12 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                  <p>
                    El Colegio Sagrados Corazones Manquehue es una comunidad educativa inspirada en la espiritualidad de los Sagrados Corazones de Jesús y de María, donde la fe, el encuentro y el compromiso con los demás son el corazón de nuestra identidad.
                  </p>
                  <p>
                    Creemos en una educación integral que forma personas conscientes, solidarias y fraternas, promoviendo relaciones basadas en el respeto, la cercanía y la corresponsabilidad entre estudiantes, familias, educadores y funcionarios. Nuestra comunidad se construye día a día en la confianza, el diálogo y el trabajo colaborativo.
                  </p>
                  <p>
                    La espiritualidad SS.CC. nos invita a vivir una fe encarnada, abierta y comprometida con la realidad, que se expresa en la oración, la vida sacramental, la reflexión comunitaria y el servicio. Buscamos que cada integrante de nuestra comunidad pueda encontrar espacios para crecer interiormente, descubrir su vocación y poner sus talentos al servicio de los demás.
                  </p>
                  <p>
                    Así, el Colegio SS.CC. Manquehue es un lugar donde la educación y la fe se unen para formar personas íntegras, con sentido trascendente y comprometidas con la construcción de una sociedad más justa y fraterna.
                  </p>
                </div>
              </div>
              <div className="relative h-full min-h-[400px]">
                <img
                  src="https://i.postimg.cc/BvKVbc3m/ddaad.jpg"
                  alt="Comunidad SS.CC. Manquehue"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bloques de Comunidad */}
        <div className="grid gap-8">
          {bloques.map((bloque, index) => {
            const bloqueFotos = fotos[bloque.id] || [];
            const bloqueIntegrantes = integrantes[bloque.id] || [];
            const currentIndex = currentPhotoIndex[bloque.id] || 0;
            const isExpanded = selectedBloque === bloque.id;

            return (
              <div
                key={bloque.id}
                id={`bloque-${bloque.id}`}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl scroll-mt-24 ${
                  isExpanded ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Carrusel de Fotos */}
                {bloqueFotos.length > 0 && (
                  <div className="relative h-96 md:h-[32rem] bg-white overflow-hidden">
                    <div className="relative h-full w-full flex items-center justify-center">
                      {bloqueFotos.map((foto, idx) => (
                        <div
                          key={foto.id}
                          className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center ${
                            idx === currentIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <img
                            src={foto.photo_url}
                            alt={foto.caption || `Foto ${idx + 1}`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                          {foto.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                              <p className="text-white text-sm font-medium">{foto.caption}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Controles del carrusel */}
                    {bloqueFotos.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevPhoto(bloque.id);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                        >
                          <ChevronLeft size={24} className="text-gray-800" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextPhoto(bloque.id);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                        >
                          <ChevronRight size={24} className="text-gray-800" />
                        </button>

                        {/* Indicadores */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {bloqueFotos.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentPhotoIndex((prev) => ({
                                  ...prev,
                                  [bloque.id]: idx,
                                }));
                              }}
                              className={`h-2 rounded-full transition-all ${
                                idx === currentIndex
                                  ? 'w-8 bg-white'
                                  : 'w-2 bg-white/50 hover:bg-white/75'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Contenido del Bloque */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        {bloque.titulo}
                      </h2>
                      {bloque.descripcion && (
                        <p className="text-gray-600 mb-4">{bloque.descripcion}</p>
                      )}
                    </div>
                    <div className="ml-4 bg-blue-100 p-3 rounded-full">
                      <Users className="text-blue-600" size={24} />
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <button
                    onClick={() => handleBloqueClick(bloque.id, bloque.boton_url)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {bloque.boton_texto || 'Ver más'}
                    {bloque.boton_url && <ExternalLink size={18} />}
                  </button>

                  {/* Integrantes (si los hay y está configurado para mostrarlos) */}
                  {bloque.mostrar_integrantes && bloqueIntegrantes.length > 0 && isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Users size={20} />
                        Integrantes
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bloqueIntegrantes.map((integrante) => (
                          <div
                            key={integrante.id}
                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                          >
                            {integrante.foto_url && (
                              <img
                                src={integrante.foto_url}
                                alt={integrante.nombre}
                                className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                              />
                            )}
                            <div className="text-center">
                              <h4 className="font-semibold text-gray-800">{integrante.nombre}</h4>
                              {integrante.cargo && (
                                <p className="text-sm text-blue-600">{integrante.cargo}</p>
                              )}
                              {integrante.descripcion && (
                                <p className="text-xs text-gray-600 mt-2">{integrante.descripcion}</p>
                              )}
                              {integrante.email && (
                                <a
                                  href={`mailto:${integrante.email}`}
                                  className="text-xs text-blue-500 hover:underline block mt-1"
                                >
                                  {integrante.email}
                                </a>
                              )}
                              {integrante.telefono && (
                                <p className="text-xs text-gray-500 mt-1">{integrante.telefono}</p>
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
          })}
        </div>

        {bloques.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay bloques de comunidad disponibles en este momento.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ComunidadSection;
