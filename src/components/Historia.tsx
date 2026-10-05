import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, MapPin, Award } from 'lucide-react';
import DirectoryCarousel, { DirectoryItem } from './DirectoryCarousel';
import FlipCard from './FlipCard';
import { driveRoutesSupabase, supabase } from '../lib/supabase';
import type { DirectoryMember } from '../lib/supabase';

interface HistoriaProps {
  onBack: () => void;
}

const Historia: React.FC<HistoriaProps> = ({ onBack }) => {
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [directoryMembers, setDirectoryMembers] = useState<DirectoryItem[]>([]);
  const [rectoriaMembers, setRectoriaMembers] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchDirectoryMembers();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const fetchDirectoryMembers = async () => {
    try {
      // Intentar leer del servidor secundario (antiguo) primero
      let result = await supabase
        .from('directory_members')
        .select('*')
        .order('order_index', { ascending: true });

      // Si falla o no hay datos, usar servidor principal
      if (result.error || !result.data || result.data.length === 0) {
        console.log('Fallback a servidor principal para directory_members');
        result = await driveRoutesSupabase
          .from('directory_members')
          .select('*')
          .order('order_index', { ascending: true });
      }

      if (result.error) throw result.error;
      const data = result.data;

      const directorio = (data || [])
        .filter((m: DirectoryMember) => m.category === 'directorio')
        .map((m: DirectoryMember) => ({
          name: `${m.name} - ${m.position}`,
          photoUrl: m.photo_url || 'https://via.placeholder.com/150'
        }));

      const rectoria = (data || [])
        .filter((m: DirectoryMember) => m.category === 'rectoria')
        .map((m: DirectoryMember) => ({
          name: `${m.name} - ${m.position}`,
          photoUrl: m.photo_url || 'https://via.placeholder.com/150'
        }));

      setDirectoryMembers(directorio);
      setRectoriaMembers(rectoria);
    } catch (error) {
      console.error('Error fetching directory members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Historia de la Congregación
  const timelineEventsCongregacion = [
    {
      year: '1800',
      title: 'Fundación en Poitiers',
      description: 'La Congregación de los Sagrados Corazones fue fundada por Pierre Coudrin y Henriette Aymer de la Chevalerie en la ciudad francesa de Poitiers durante la Revolución francesa. Nació del ardor misionero de estos fundadores que, en medio de la persecución, concibieron una comunidad de religiosos y religiosas dedicada a propagar la devoción a los Sagrados Corazones de Jesús y María.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      year: '1800 (Navidad)',
      title: 'Primer Voto Perpetuo',
      description: 'En la Nochebuena de 1800, Pierre Coudrin realizó los primeros votos perpetuos, mientras que Henriette y cuatro compañeras también pronunciaron sus votos. Este evento marcó el inicio oficial de la Congregación en la ciudad de París, en la calle Picpus, que se convirtió en el centro espiritual de la nueva comunidad religiosa.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '1817',
      title: 'Aprobación Pontificia',
      description: 'El Papa Pío VII otorga la aprobación formal de la Congregación, reconociendo oficialmente su misión y su carisma. Con esta aprobación, la comunidad comienza su expansión internacional, estableciendo seminarios y colegios en diversas ciudades y regiones del mundo.',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      year: '1825',
      title: 'Expansión Misionera',
      description: 'La Santa Sede confía a la Congregación la evangelización de las islas Sandwich (Hawái). Un año después, el primer grupo de misioneros de los Sagrados Corazones parte hacia el Pacífico para llevar la fe cristiana a los isleños, iniciando así una presencia misionera que se extendería a múltiples continentes.',
      icon: <Users className="w-6 h-6" />
    },
    {
      year: '1837',
      title: 'Legado del Fundador',
      description: 'Con la muerte del Padre Pierre Coudrin, concluye una era de la historia de la Congregación. Sin embargo, su legado perdura: la comunidad ha crecido significativamente bajo su liderazgo espiritual y continúa expandiendo su misión evangelizadora. Hoy, la Congregación se extiende por más de 30 países en 5 continentes con más de 1,100 religiosos.',
      icon: <Award className="w-6 h-6" />
    }
  ];

  // Historia del Colegio (duplicada para edición independiente)
  const timelineEventsColegio = [
    {
      year: '1800',
      title: 'Fundación en Poitiers',
      description: 'La Congregación de los Sagrados Corazones fue fundada por Pierre Coudrin y Henriette Aymer de la Chevalerie en la ciudad francesa de Poitiers durante la Revolución francesa. Nació del ardor misionero de estos fundadores que, en medio de la persecución, concibieron una comunidad de religiosos y religiosas dedicada a propagar la devoción a los Sagrados Corazones de Jesús y María.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      year: '1800 (Navidad)',
      title: 'Primer Voto Perpetuo',
      description: 'En la Nochebuena de 1800, Pierre Coudrin realizó los primeros votos perpetuos, mientras que Henriette y cuatro compañeras también pronunciaron sus votos. Este evento marcó el inicio oficial de la Congregación en la ciudad de París, en la calle Picpus, que se convirtió en el centro espiritual de la nueva comunidad religiosa.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '1817',
      title: 'Aprobación Pontificia',
      description: 'El Papa Pío VII otorga la aprobación formal de la Congregación, reconociendo oficialmente su misión y su carisma. Con esta aprobación, la comunidad comienza su expansión internacional, estableciendo seminarios y colegios en diversas ciudades y regiones del mundo.',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      year: '1825',
      title: 'Expansión Misionera',
      description: 'La Santa Sede confía a la Congregación la evangelización de las islas Sandwich (Hawái). Un año después, el primer grupo de misioneros de los Sagrados Corazones parte hacia el Pacífico para llevar la fe cristiana a los isleños, iniciando así una presencia misionera que se extendería a múltiples continentes.',
      icon: <Users className="w-6 h-6" />
    },
    {
      year: '1837',
      title: 'Legado del Fundador',
      description: 'Con la muerte del Padre Pierre Coudrin, concluye una era de la historia de la Congregación. Sin embargo, su legado perdura: la comunidad ha crecido significativamente bajo su liderazgo espiritual y continúa expandiendo su misión evangelizadora. Hoy, la Congregación se extiende por más de 30 países en 5 continentes con más de 1,100 religiosos.',
      icon: <Award className="w-6 h-6" />
    }
  ];

  const [activeTimelineCongregacion, setActiveTimelineCongregacion] = useState(0);
  const [activeTimelineColegio, setActiveTimelineColegio] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-100">
      {/* Header with back button */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Historia de la Congregación
          </h1>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => scrollToSection('historia-congregacion')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-red-700 hover:bg-red-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-red-700 flex-shrink-0"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Historia Congregación</span>
            </button>
            
            <button
              onClick={() => scrollToSection('historia-colegio')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-700 flex-shrink-0"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Historia Colegio</span>
            </button>
            
            <button
              onClick={() => scrollToSection('vision-mision')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-rose-700 hover:bg-rose-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-rose-700 flex-shrink-0"
            >
              <Award className="w-5 h-5" />
              <span className="font-semibold">Visión & Misión</span>
            </button>
            
            <button
              onClick={() => scrollToSection('objetivos')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-red-600 flex-shrink-0"
            >
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">Carisma</span>
            </button>
            
            <button
              onClick={() => scrollToSection('directorio-rectoria')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-red-700 hover:bg-red-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-red-700 flex-shrink-0"
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold">Directorio & Rectoría</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className={`relative h-[500px] overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src="https://i.postimg.cc/PrthSw3c/foto.webp"
          alt="Historia de la Congregación Sagrados Corazones"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/40 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl inline-block">
              <img
                src="https://i.postimg.cc/R0wcCy7H/logo-version-Horizontal-FULL-COLOR.webp"
                alt="Logo Sagrados Corazones"
                className="h-20 md:h-28 w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Historia de la Congregación (timeline eliminado según solicitud) */}
      <div id="historia-congregacion" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className={`text-center mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Historia de la Congregación</h2>
          <p className="text-gray-600">Contenido simplificado. Se han removido los hitos cronológicos.</p>
        </div>
      </div>

      {/* Historia del Colegio Timeline */}
      <div id="historia-colegio" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24 bg-white/50 rounded-lg">
        <div className={`text-center mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Historia del Colegio</h2>
          <p className="text-gray-600">Descubre los momentos más importantes de nuestro colegio</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Timeline Navigation */}
          <div className="space-y-4">
            {timelineEventsColegio.map((event, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  activeTimelineColegio === index
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md'
                }`}
                onClick={() => setActiveTimelineColegio(index)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${activeTimelineColegio === index ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'}`}>
                    {event.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{event.year}</h3>
                    <p className="text-sm opacity-90">{event.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                {timelineEventsColegio[activeTimelineColegio].icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{timelineEventsColegio[activeTimelineColegio].year}</h3>
              <h4 className="text-xl text-blue-600 font-semibold">{timelineEventsColegio[activeTimelineColegio].title}</h4>
            </div>
            <p className="text-gray-700 leading-relaxed text-center">
              {timelineEventsColegio[activeTimelineColegio].description}
            </p>
          </div>
        </div>

        {/* Directorio y Rectoría (Supabase) */}
        <div id="directorio-rectoria" className={`bg-white rounded-lg shadow-lg overflow-hidden mt-4 transition-all duration-1000 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Directorio y Rectoría</h2>

            {/* Directorio Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Directorio</h3>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  La conducción superior del Colegio es realizada por un Directorio, cuyos miembros son nombrados
                  por el Superior Provincial de la Comunidad de los Padres de Schoenstatt.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Este Directorio tiene la responsabilidad de definir los lineamientos generales del Colegio y velar
                  por la fidelidad a los principios que inspiran el proyecto desde sus inicios, como así mismo su
                  financiamiento y desarrollo.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  El Directorio está compuesto por un grupo de laicos, que participan en la Obra Familiar del
                  Movimiento de Schoenstatt, y un sacerdote de la Comunidad de los Padres de Schoenstatt.
                </p>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Cargando miembros del directorio...</p>
                </div>
              ) : directoryMembers.length > 0 ? (
                <DirectoryCarousel items={directoryMembers} />
              ) : (
                <p className="text-center text-gray-600 py-4">No hay miembros del directorio registrados.</p>
              )}
            </div>

            {/* Rectoría Section */}
            <div>
              <h3 className="text-2xl font-bold text-red-900 mb-6">Espiritualidad de la Congregación</h3>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-lg mb-6 border-t-4 border-red-600">
                <p className="text-gray-700 leading-relaxed mb-4">
                  La Congregación de los Sagrados Corazones se fundamenta en la devoción profunda a los Sagrados Corazones de Jesús y María. Es una comunidad de religiosos y religiosas que comparten un carisma común: <strong>"Contemplar, Vivir y Anunciar al Mundo el Amor de Dios"</strong>.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  En su rama de hermanos, la comunidad busca contemplar el amor de Dios a través de una experiencia religiosa profunda centrada en la amistad con Jesús, especialmente mediante la celebración eucarística y la adoración contemplativa del Santísimo Sacramento.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Los religiosos viven su vocación en fraternidad intensa, con sencillez y espíritu de familia, abiertos a todos los pueblos. Y ejercen su misión evangelizadora y reparadora especialmente en medio de los marginados, los afligidos y aquellos que no conocen el Evangelio.
                </p>
                <p className="text-gray-700 leading-relaxed italic">
                  La Congregación es un instrumento de transformación social y construcción de un mundo más justo en solidaridad con los más pobres.
                </p>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Cargando equipo directivo...</p>
                </div>
              ) : rectoriaMembers.length > 0 ? (
                <DirectoryCarousel items={rectoriaMembers} />
              ) : (
                <p className="text-center text-gray-600 py-4">No hay miembros de rectoría registrados.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vision y Mision Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div id="vision-mision" className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 delay-700 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Visión & Misión</h2>
            
            {/* Vision y Mision Flip Cards with Image */}
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
              {/* Image */}
              <div className="relative order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="https://i.postimg.cc/vZxQnd2N/Ftos.png"
                    alt="Visión y Misión"
                    className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-200 rounded-full opacity-20 blur-2xl"></div>
              </div>

              {/* Flip Cards */}
              <div className="space-y-6 order-1 lg:order-2">
                <FlipCard
                  type="vision"
                  title="Visión"
                  content="Formar una comunidad educativa que contempla, vive y anuncia al mundo el amor de Dios encarnado en Jesús, desarrollando en nuestros estudiantes un profundo espíritu de fe, fraternidad cristiana y compromiso misionero para construir un mundo más justo en solidaridad con los más necesitados."
                />
                
                <FlipCard
                  type="mision"
                  title="Misión"
                  content="Educar en el carisma de los Sagrados Corazones, formando personas que vivan la experiencia religiosa profunda centrada en la amistad con Jesús, la devoción a los Sagrados Corazones de Jesús y María, y la adoración contemplativa del Santísimo Sacramento, para que sean agentes de transformación evangelizadora en medio de los marginados y afligidos."
                />
              </div>
            </div>

            {/* Instruction hint */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 italic flex items-center justify-center space-x-2">
                <span>💡</span>
                <span>Haz clic en las tarjetas para ver el contenido completo</span>
              </p>
            </div>

            {/* Información de la Congregación */}
            <div id="objetivos" className="mt-12 scroll-mt-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Información de la Congregación</h3>
              
              {/* Carisma Resumido */}
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg shadow-md p-6 mb-8 border-t-4 border-red-600">
                <h4 className="text-xl font-bold text-red-700 mb-4">Carisma: Contemplar, Vivir y Anunciar el Amor de Dios</h4>
                <p className="text-gray-700 leading-relaxed">
                  La Congregación vive una experiencia religiosa profunda centrada en la amistad con Jesús mediante la adoración eucarística y contemplativa. 
                  Desarrolla vínculos fraternos con espíritu de familia, centrados en los Sagrados Corazones de Jesús y María. 
                  Su misión evangelizadora se ejerce especialmente entre los marginados y afligidos, formando líderes servidores comprometidos con la construcción de un mundo más justo.
                </p>
              </div>

              {/* Fundadores y Presencia Global */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-600">
                  <h4 className="text-xl font-bold text-red-700 mb-3">Fundadores</h4>
                  <p className="text-gray-700">
                    <strong>Pierre Coudrin</strong> y <strong>Henriette Aymer de la Chevalerie</strong> fundaron la Congregación en 1800 en Poitiers, Francia, durante la Revolución francesa, 
                    para propagar la devoción a los Sagrados Corazones y mantener la Adoración Perpetua del Santísimo Sacramento.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-rose-600">
                  <h4 className="text-xl font-bold text-rose-700 mb-3">Presencia Global</h4>
                  <p className="text-gray-700">
                    Presente en más de <strong>30 países</strong> en <strong>5 continentes</strong>, con más de <strong>1,100 religiosos</strong> dedicados a la misión evangelizadora. 
                    Incluye hermanos, hermanas y laicos comprometidos.
                  </p>
                </div>
              </div>

              {/* Contacto */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-600">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Contacto de Casas Provinciales</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-bold text-red-600 mb-2">Casa Provincial de los Hermanos</h5>
                    <p className="text-gray-700 text-sm">Domingo Faustino Sarmiento 275, Ñuñoa – Santiago</p>
                    <p className="text-red-600 font-semibold mt-1">+562 2783 8400</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-red-600 mb-2">Casa Provincial de las Hermanas</h5>
                    <p className="text-gray-700 text-sm">Av. Diagonal Oriente 3371, Providencia – Santiago</p>
                    <p className="text-red-600 font-semibold mt-1">+562 2209 2383 – +562 2341 1157</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className={`grid md:grid-cols-3 gap-6 mt-12 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 text-white">
            <div className="text-3xl font-bold mb-2">225+</div>
            <div className="text-red-100">Años de Historia</div>
          </div>
          <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 text-white">
            <div className="text-3xl font-bold mb-2">1,100+</div>
            <div className="text-rose-100">Religiosos Activos</div>
          </div>
          <div className="bg-gradient-to-br from-red-700 to-red-800 rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 text-white">
            <div className="text-3xl font-bold mb-2">30+</div>
            <div className="text-red-100">Países de Presencia</div>
          </div>
        </div>

        {/* Directorio y Rectoría Section (movido para que sólo esté bajo Historia del Colegio) */}
      </div>
    </div>
  );
};

export default Historia;