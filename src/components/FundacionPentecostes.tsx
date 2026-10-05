import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Target, BookOpen, Users, Award, ChevronRight, Sparkles } from 'lucide-react';

interface FundacionPentecostesProps {
  onBack: () => void;
}

const FundacionPentecostes: React.FC<FundacionPentecostesProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeArea, setActiveArea] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const areas = [
    {
      id: 1,
      title: 'Liderazgo',
      icon: <Target className="w-12 h-12" />,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Fortalecimiento de equipos directivos y desarrollo de capacidades de gestión institucional.',
      features: ['Gestión estratégica', 'Toma de decisiones', 'Trabajo en equipo', 'Visión institucional']
    },
    {
      id: 2,
      title: 'Gestión del Currículum',
      icon: <BookOpen className="w-12 h-12" />,
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Acompañamiento en el diseño, implementación y evaluación de procesos pedagógicos.',
      features: ['Planificación curricular', 'Estrategias didácticas', 'Evaluación formativa', 'Innovación pedagógica']
    },
    {
      id: 3,
      title: 'Convivencia Escolar',
      icon: <Users className="w-12 h-12" />,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Desarrollo de ambientes escolares seguros, inclusivos y formativos para toda la comunidad.',
      features: ['Clima organizacional', 'Resolución de conflictos', 'Participación democrática', 'Bienestar estudiantil']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
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
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Fundación Pentecostés
            </h1>
            <p className="text-lg text-gray-600">Excelencia académica y formación schoenstatiana</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with background image */}
        <div className={`relative mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(https://i.postimg.cc/g2xNjVJF/Diseno-sin-titulo-1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 via-orange-600/80 to-pink-600/80"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="relative px-8 py-16 md:px-12 md:py-20">
              {/* Logo Pentecostés */}
              <div className="flex items-center space-x-4 mb-8">
                <img 
                  src="https://www.pentecostes.cl/website/www.pentecostes.cl/website_logo.png" 
                  alt="Fundación Pentecostés"
                  className="h-16 md:h-20 w-auto object-contain bg-white/90 rounded-lg p-2"
                />
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                  <span className="text-white/90 text-lg font-medium">Red de Colegios Schoenstatt</span>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Excelencia académica y calidad formativa
              </h2>
              <p className="text-white/90 text-lg leading-relaxed max-w-3xl mb-8">
                La Fundación Pentecostés, con la convicción de que es importante la excelencia académica y la calidad en el ámbito formativo, 
                se preocupa por el funcionamiento administrativo y legal de los colegios de la red, generando instancias de asesoría, 
                acompañamiento y capacitación permanente a sus equipos directivos, docentes y comunidad educativa en general.
              </p>
              
              <a
                href="https://www.pentecostes.cl/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span>Visitar sitio web</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className={`bg-white rounded-2xl shadow-lg p-8 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Potenciar la gestión interna de cada unidad escolar y velar por su carácter schoenstatiano, 
                desarrollando planes de formación y acompañamiento integral.
              </p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="text-gray-700">
                  <span className="font-semibold text-orange-700">Alcance ampliado:</span> Hoy en día, este asesoramiento técnico 
                  se ha abierto a otros establecimientos educacionales que no son parte de la red, pero que han querido sumarse a nuestra línea de trabajo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Areas de Trabajo */}
        <div className={`mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Áreas de Formación y Acompañamiento</h2>
            <p className="text-gray-600 text-lg">Programas especializados para fortalecer la gestión educativa</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {areas.map((area, index) => (
              <div
                key={area.id}
                className={`relative transition-all duration-500 delay-${index * 100}`}
                onMouseEnter={() => setActiveArea(area.id)}
                onMouseLeave={() => setActiveArea(null)}
              >
                <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border-2 ${area.borderColor} ${activeArea === area.id ? 'ring-4 ring-offset-2 ring-opacity-50' : ''}`}>
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${area.color} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 opacity-20 transform translate-x-6 -translate-y-6">
                      <div className="w-32 h-32 rounded-full bg-white"></div>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        {area.icon}
                        <ChevronRight className={`w-6 h-6 transform transition-transform duration-300 ${activeArea === area.id ? 'translate-x-2' : ''}`} />
                      </div>
                      <h3 className="text-2xl font-bold">{area.title}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${area.bgColor} transition-all duration-300`}>
                    <p className="text-gray-700 leading-relaxed mb-6">{area.description}</p>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Enfoque en:</p>
                      {area.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center space-x-2 transform transition-all duration-300 ${activeArea === area.id ? 'translate-x-2' : ''}`}
                          style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${area.color}`}></div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 md:p-12 text-center shadow-2xl transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-3xl font-bold text-white mb-4">¿Quieres conocer más?</h3>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Descubre todos nuestros programas y servicios de acompañamiento educativo visitando nuestro sitio web oficial
          </p>
          <a
            href="https://www.pentecostes.cl/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-white text-red-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-2xl"
          >
            <span>Visitar Fundación Pentecostés</span>
            <ExternalLink className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FundacionPentecostes;
