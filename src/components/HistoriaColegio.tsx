import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import DirectoryCarousel, { DirectoryItem } from './DirectoryCarousel';
import FlipCard from './FlipCard';
import { supabase } from '../lib/supabase';
import type { DirectoryMember } from '../lib/supabase';
import { getSiteLogoUrl } from '../lib/siteLogo';

interface HistoriaColegioProps {
  onBack: () => void;
}

interface HistoriaColegioPropsExtended extends HistoriaColegioProps {
  // no change to caller; we will check global window.__scrollTo instead
}

const HistoriaColegio: React.FC<HistoriaColegioProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTimelineColegio, setActiveTimelineColegio] = useState(0);
  const [directoryMembers, setDirectoryMembers] = useState<DirectoryItem[]>([]);
  const [rectoriaMembers, setRectoriaMembers] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string>('');

  useEffect(() => {
    setIsVisible(true);
    fetchDirectoryMembers();
    fetchLogo();
    // If navigation requested a scroll target, perform it after mount
    setTimeout(() => {
      try {
        const target = (window as any).__scrollTo;
        if (target) {
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          delete (window as any).__scrollTo;
        }
      } catch (e) {
        // ignore
      }
    }, 300);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const fetchDirectoryMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('directory_members')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;

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

  const fetchLogo = async () => {
    try {
      const logoUrl = await getSiteLogoUrl();

      if (logoUrl) {
        setLogoUrl(logoUrl);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  const timelineEventsColegio = [
    {
      year: '1946',
      title: 'Orígenes y adquisición del terreno',
      description:
        'Los orígenes del Colegio Sagrados Corazones de Manquehue se remontan al año 1946, con la adquisición, por parte de la Congregación de los SS.CC., de un terreno de 95 mil metros cuadrados en la ribera sur del río Mapocho. Los vendedores, Manuel y Narciso Coycoolea, donaron otra franja de tierra —172 mil metros cuadrados— con la condición de que el espacio fuera destinado a la construcción de un colegio.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      year: '1955',
      title: 'Inicio de clases',
      description:
        'Después de medio siglo, la urbanización de Santiago se ha extendido y el otrora aire bucólico del sector ha cedido, pero el paisaje aún es coronado por el imponente cerro Manquehue, silencioso testigo del desarrollo de una institución que comenzó a impartir clases en marzo de 1955 con un grupo de 58 alumnos.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      year: '1994',
      title: 'Colegio coeducacional',
      description:
        'Cuatro décadas después, en 1994, se concretaría el anhelo de un Colegio Manquehue coeducacional, que permitió el ingreso de mujeres a sus aulas. De este modo se consolidó un espíritu de familia al interior de la comunidad Manquehuina.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      year: '2001',
      title: 'Remodelación e infraestructura',
      description:
        'El espacio físico comprende ocho hectáreas con 20 mil metros cuadrados construidos, la mayoría fruto de la remodelación inaugurada el año 2001, aunque algunos pabellones y el edificio de administración aún se erigen como recuerdos del pasado, activos e insertos en la nueva arquitectura.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      year: 'Actualidad',
      title: 'Comunidad y crecimiento',
      description:
        'Hoy el Colegio congrega alrededor de 2.000 estudiantes y 250 funcionarios, entre profesores, administrativos y auxiliares, consolidando su proyecto educativo y su compromiso con la comunidad.',
      icon: <Users className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-100">
      {/* Header with back button */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Historia del Colegio
          </h1>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => scrollToSection('historia-colegio')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-700 flex-shrink-0"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Historia Colegio</span>
            </button>
            <button
              onClick={() => scrollToSection('vision-mision')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-700 flex-shrink-0"
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold">Visión y Misión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className={`relative h-[500px] overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src="https://i.postimg.cc/BvKVbc3m/ddaad.jpg"
          alt="Colegio Sagrados Corazones de Manquehue"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/40 flex items-center justify-center">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo Colegio Manquehue SSCC"
              className="h-32 md:h-40 w-auto object-contain"
            />
          ) : (
            <div className="h-32 md:h-40 w-48" aria-hidden="true"></div>
          )}
        </div>
      </div>

      {/* Historia del Colegio Timeline */}
      <div id="historia-colegio" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24 bg-white/50 rounded-lg">
        <div className={`text-center mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Historia del Colegio</h2>
          <p className="text-gray-600">Descubre los momentos más importantes de nuestro colegio</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
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
      </div>

      {/* Visión y Misión Section */}
      <div id="vision-mision" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Visión y Misión</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Image Section */}
            <div className="relative group order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <div className="relative">
                  <img
                    src="https://i.postimg.cc/vH3y23Z4/fotodecomida.jpg"
                    alt="Visión y Misión"
                    className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-200 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>

            {/* Flip Cards */}
            <div className="space-y-6 order-1 lg:order-2">
              <FlipCard
                type="vision"
                title="Visión"
                content="Ser una comunidad educativa que, desde el Evangelio y el carisma SS.CC., forma personas comprometidas con su vocación, capaces de transformar el mundo con sentido de justicia, inclusión, solidaridad y cuidado del entorno."
                customImage="https://i.postimg.cc/zGZCMS2D/foto.png"
              />
              
              <FlipCard
                type="mision"
                title="Misión"
                content="Formamos personas íntegras, inspiradas en la espiritualidad de los Sagrados Corazones, promoviendo el desarrollo de sus talentos y una vida basada en la fraternidad, el respeto y el servicio. En alianza con las familias, educamos para construir una sociedad más justa y solidaria."
                customImage="https://i.postimg.cc/mDJjrxj7/foto.jpg"
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
        </div>
      </div>
    </div>
  );
};

export default HistoriaColegio;
