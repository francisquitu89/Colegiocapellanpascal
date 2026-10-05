import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Handshake, Heart, Lightbulb } from 'lucide-react';
import aprendizajecooperativoLogo from '../assets/aprendizajecooperativo.jpeg';
import ninosImage from '../assets/niños.jpeg';
import decorativeImage from '../assets/image (5).png';
import objectiveImage from '../assets/image (6).png';

interface AprendizajeCooperativoSectionProps {
  onBack: () => void;
}

const AprendizajeCooperativoSection: React.FC<AprendizajeCooperativoSectionProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-100">
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
          <div className="bg-white px-5 py-4 flex items-center gap-4 max-w-fit">
            <img
              src={aprendizajecooperativoLogo}
              alt="Logo Aprendizaje Cooperativo"
              className="h-20 md:h-28 lg:h-32 w-auto shrink-0"
            />
            <h1 className={`text-3xl md:text-5xl font-bold text-gray-900 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Aprendizaje Cooperativo
            </h1>
          </div>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => scrollToSection('que-es')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-green-700 flex-shrink-0"
            >
              <Lightbulb className="w-5 h-5" />
              <span className="font-semibold">¿Qué es?</span>
            </button>
            <button
              onClick={() => scrollToSection('como-lo-vivimos')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-emerald-700 flex-shrink-0"
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold">¿Cómo lo vivimos?</span>
            </button>
            <button
              onClick={() => scrollToSection('objetivo')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-teal-700 hover:bg-teal-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-teal-700 flex-shrink-0"
            >
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Objetivo</span>
            </button>
            <button
              onClick={() => scrollToSection('ideas-fuerza')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-cyan-700 hover:bg-cyan-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-cyan-700 flex-shrink-0"
            >
              <Handshake className="w-5 h-5" />
              <span className="font-semibold">Ideas Fuerza</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className={`relative h-[500px] overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <img
          alt="Aprendizaje Cooperativo - Colegio Sagrados Corazones Manquehue"
          src={ninosImage}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/45 to-white/25" />
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* ¿Qué es? Section */}
        <div id="que-es" className={`bg-white rounded-lg shadow-lg overflow-hidden mb-12 transition-all duration-1000 delay-500 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">¿QUÉ ES EL APRENDIZAJE COOPERATIVO?</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p>
                  Es una estructura intencionada de aprendizaje, en la que el progreso de cada estudiante está vinculado al progreso de sus compañeros.
                </p>
                <p>
                  A través de la interacción social organizada, el diálogo y la responsabilidad compartida, el aprendizaje se construye de manera conjunta, poniendo la colaboración al servicio de la comprensión profunda y del desarrollo personal y social.
                </p>
              </div>
              <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={decorativeImage}
                  alt="Estudiantes en aprendizaje cooperativo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ¿Cómo lo vivimos? Section */}
        <div id="como-lo-vivimos" className={`bg-white rounded-lg shadow-lg overflow-hidden mb-12 transition-all duration-1000 delay-600 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">¿CÓMO LO VIVIMOS?</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg order-last lg:order-first">
                <img
                  alt="Vivencia del aprendizaje cooperativo"
                  src={ninosImage}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p>
                  Creemos que aprender en equipo no consiste solo en trabajar juntos, sino en construir conocimiento mediante la interacción, la responsabilidad compartida y la ayuda mutua. Por ello, implementamos estructuras cooperativas que organizan la participación equitativa, fomentan la interdependencia positiva y promueven el compromiso individual dentro del grupo.
                </p>
                <p>
                  El Aprendizaje Cooperativo se vive diariamente a través de dinámicas que favorecen el diálogo, la escucha activa, la toma de acuerdos y la valoración de la diversidad de ideas. De este modo, los estudiantes desarrollan habilidades de comunicación, empatía y colaboración, mientras profundizan sus aprendizajes académicos de manera significativa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Objetivo Section */}
        <div id="objetivo" className={`bg-white rounded-lg shadow-lg overflow-hidden mb-12 transition-all duration-1000 delay-700 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">NUESTRO OBJETIVO</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p>
                  Buscamos formar estudiantes capaces de aprender con otros y de otros, reconociendo que el conocimiento se construye colectivamente. Así, promovemos personas solidarias, responsables y participativas, preparadas para contribuir positivamente a sus comunidades y enfrentar los desafíos del mundo actual desde la cooperación y el respeto mutuo.
                </p>
              </div>
              <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={objectiveImage}
                  alt="Objetivo del aprendizaje cooperativo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ideas Fuerza Section */}
        <div id="ideas-fuerza" className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 delay-800 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Handshake className="w-8 h-8 text-cyan-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">IDEAS FUERZA</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-green-700 mb-3">Inclusión</h3>
                <p className="text-gray-700 leading-relaxed">
                  Valoramos la diversidad como una oportunidad para aprender de otros.
                </p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-lg border-l-4 border-teal-600">
                <h3 className="text-xl font-bold text-teal-700 mb-3">Participación equitativa</h3>
                <p className="text-gray-700 leading-relaxed">
                  Todos los estudiantes participan y aportan activamente en el aprendizaje común.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-blue-700 mb-3">Habilidades para la vida</h3>
                <p className="text-gray-700 leading-relaxed">
                  Desarrollamos colaboración, comunicación asertiva y responsabilidad para la vida en comunidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AprendizajeCooperativoSection;
