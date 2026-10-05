import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Eye, Heart, Star } from 'lucide-react';

interface VisionMisionProps {
  onBack: () => void;
}

const VisionMision: React.FC<VisionMisionProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const valores = [
    'Respeto',
    'Apertura al otro',
    'Integralidad',
    'Libertad',
    'Confianza',
    'Fortaleza',
    'Conciencia de misión',
    'Magnanimidad'
  ];

  const objetivos = [
    {
      numero: 1,
      titulo: 'Educar en la vivencia de la fe',
      descripcion: 'Para poder vivir en consecuencia con ella, como hijo de Dios y miembro de su familia, la Iglesia, integrando el mundo natural con el sobrenatural.'
    },
    {
      numero: 2,
      titulo: 'Educar a la persona para que llegue a ser plenamente ella misma',
      descripcion: 'Según el Plan de Dios, desde su modalidad femenina o masculina, a través de personas que presten un servicio desinteresado a la originalidad de cada alumno.'
    },
    {
      numero: 3,
      titulo: 'Educar en comunidad',
      descripcion: 'Sustentándose en vínculos sólidos a personas, ideas y lugares (curso, colegio, familia e Iglesia).'
    },
    {
      numero: 4,
      titulo: 'Educar para la excelencia',
      descripcion: 'De modo que cada alumno (a) desarrolle con el máximo esfuerzo todas sus potencialidades cognitivas, afectivas y valóricas, para asumir responsablemente su misión en la familia y en la sociedad.'
    },
    {
      numero: 5,
      titulo: 'Educar para servir en la sociedad',
      descripcion: 'Conociéndola desde su realidad social y ética, para que reconozcan en ella las necesidades, como posibilidad de respuesta personal y construcción de un nuevo orden social inspirado en valores cristianos y en la doctrina social de la Iglesia.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Misión y Visión
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            En el marco de la Misión Educadora de la Iglesia y de los Principios Pedagógicos del Padre José Kentenich, 
            el Colegio Sagrada Familia ha definido su visión y misión del siguiente modo:
          </p>
        </div>

        {/* Main Content Layout - Image Left, Content Right */}
        <div className={`grid lg:grid-cols-2 gap-12 mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Left Side - Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-md">
              <img
                src="https://colegiosagradafamilia.cl/www/wp-content/uploads/2018/08/foto-mision-vision.jpg"
                alt="Padre José Kentenich con niño"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            {/* Misión */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MISIÓN</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Educar a nuestros alumnos orgánicamente, desde su originalidad y en una atmósfera familiar, 
                para seguir a Cristo, servir y transformar el mundo.
              </p>
            </div>

            {/* Visión */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">VISIÓN</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                El colegio Sagrada Familia, a partir del carisma y espiritualidad del padre José Kentenich, 
                quiere ser una comunidad de aprendizaje que desarrolle al máximo la originalidad de sus alumnos 
                para que, movidos interiormente y arraigados en Cristo, se comprometan en la construcción y 
                transformación de una sociedad más justa, solidaria y sustentable, respondiendo a los desafíos de su tiempo.
              </p>
            </div>
          </div>
        </div>

        {/* Valores Institucionales Cards */}
        <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Valores Institucionales</h2>
            <p className="text-gray-600 text-lg">
              Son valores fundamentales en el Proyecto Educativo del Colegio Sagrada Familia los siguientes:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {valores.map((valor, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">{valor}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Objetivos Section */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Objetivos Propuestos por Nuestro Colegio</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Para el cumplimiento de su misión, el Colegio se propone cinco grandes objetivos que han de orientar sus acciones:
            </p>
          </div>

          <div className="space-y-8">
            {objetivos.map((objetivo, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-8 transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {objetivo.numero}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{objetivo.titulo}</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{objetivo.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMision;