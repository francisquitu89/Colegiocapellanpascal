import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, Brain, Target } from 'lucide-react';

interface CulturaPensamientoSectionProps {
  onBack: () => void;
}

const CulturaPensamientoSection: React.FC<CulturaPensamientoSectionProps> = ({ onBack }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
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
            Cultura de Pensamiento
          </h1>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => scrollToSection('que-es')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-700 flex-shrink-0"
            >
              <Lightbulb className="w-5 h-5" />
              <span className="font-semibold">¿Qué es?</span>
            </button>
            <button
              onClick={() => scrollToSection('como-vivimos')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-700 flex-shrink-0"
            >
              <Brain className="w-5 h-5" />
              <span className="font-semibold">Cómo la vivimos</span>
            </button>
            <button
              onClick={() => scrollToSection('objetivo')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-600 flex-shrink-0"
            >
              <Target className="w-5 h-5" />
              <span className="font-semibold">Objetivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className={`relative h-[500px] overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src="https://i.postimg.cc/BbSpTR8R/ceremonia1sscc.jpg"
          alt="Cultura de Pensamiento - Colegio Sagrados Corazones Manquehue"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/40 flex items-center justify-center">
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* ¿Qué es? Section */}
        <div id="que-es" className={`bg-white rounded-lg shadow-lg overflow-hidden mb-12 transition-all duration-1000 delay-500 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">¿Qué es la Cultura de Pensamiento?</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg text-justify">
              <p>
                Una Cultura de Pensamiento es un enfoque educativo en el que el pensamiento crítico, creativo y reflexivo es valorado, promovido y visibilizado de manera intencionada en la vida cotidiana.
              </p>
              <p>
                Este enfoque busca transformar el aprendizaje, pasando de la memorización a la comprensión profunda, donde los estudiantes no solo adquieren conocimientos, sino que desarrollan la capacidad de pensar sobre lo que aprenden y cómo lo aprenden.
              </p>
              <p>
                Para ello, se utilizan herramientas, tales como, rutinas y llaves de pensamiento, organizadores gráficos, entre otras, que permiten hacer visible el pensamiento, evidenciando los procesos mentales, ideas y el razonamiento de los estudiantes.
              </p>
              <p>
                En este contexto, el aula se transforma en una comunidad de aprendizaje, donde se fomenta la reflexión, se cuestiona el conocimiento y se construyen significados de manera cooperativa. Se promueve el desarrollo de habilidades de pensamiento crítico, habilidades creativas y la metacognición (pensar sobre el propio pensamiento).
              </p>
              <p>
                Este enfoque, impulsado por investigadores del Proyecto Zero de Harvard como David Perkins y Ron Ritchhart, busca formar aprendices autónomos, capaces de aplicar el pensamiento de manera eficaz en distintos contextos.
              </p>
            </div>
          </div>
        </div>

        {/* Cómo la vivimos Section */}
        <div id="como-vivimos" className={`bg-white rounded-lg shadow-lg overflow-hidden mb-12 transition-all duration-1000 delay-600 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">Cómo la vivimos</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg text-justify">
                <p>
                  En nuestro Colegio vivimos la Cultura de Pensamiento a través de la implementación, desde hace más de 11 años, del Modelo VESS (Vida Equilibrada con Sentido y Sabiduría).
                </p>
                
                <p>
                  Este modelo integra neuroeducación, desarrollo emocional, de habilidades, competencias y hábitos de mente. Todo esto con el propósito de generar experiencias de aprendizaje significativas e innovadoras.
                </p>

                <p>
                  El modelo VESS responde a las necesidades de un mundo en constante cambio, promoviendo una formación integral, donde lo académico es fundamental, pero se complementa con el desarrollo de personas integrales y conscientes.
                </p>

                <p>
                  Formamos parte de la Red de Colegios VESS, una comunidad internacional de aprendizaje que colabora para sostener cambios profundos y duraderos en educación.
                </p>
              </div>
              <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://i.postimg.cc/fLZpfBbR/ninosjugando.jpg"
                  alt="Aprendizaje colaborativo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Objetivo Section */}
        <div id="objetivo" className={`bg-white rounded-lg shadow-lg overflow-hidden mb-12 transition-all duration-1000 delay-700 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">Nuestro Objetivo</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6 text-gray-700 leading-relaxed text-lg text-justify">
                  <p>
                    Nuestro principal objetivo es desarrollar al máximo el potencial de cada uno de nuestros estudiantes, que sean autónomos en su aprendizaje, reflexivos y conscientes de sus procesos, abiertos al cambio, comprometidos con su entorno.
                  </p>
                  <p>
                    Creemos que aprender no es solo adquirir contenidos, sino desarrollar la capacidad de pensar de manera profunda, creativa y colaborativa, para enfrentar los desafíos académicos y personales con sentido y responsabilidad.
                  </p>
                </div>
                <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src="https://i.postimg.cc/fWCBzWph/ceremonia2sscc.jpg"
                    alt="Estudiantes comprometidos"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Bibliografía Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 border-l-4 border-blue-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Bibliografía para profundizar</h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-3 text-blue-600 font-bold">●</span>
                    <a href="https://pz.harvard.edu/projects/cultures-of-thinking" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">PZ Harvard</a>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-blue-600 font-bold">●</span>
                    <a href="https://edu1stvess.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">Modelo VESS</a>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-blue-600 font-bold">●</span>
                    <a href="https://educaixa.org/es/-/entrevista-a-ron-ritchhart-la-cultura-de-pensamiento-y-como-fomentarla-en-las-aul-1" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">Entrevista a Ron Ritchhart</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CulturaPensamientoSection;
