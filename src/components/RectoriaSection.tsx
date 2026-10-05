import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';

interface RectoriaSectionProps {
  onBack?: () => void;
}

const TypedParagraph: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const { displayedText, isComplete } = useTypewriter({ text, speed: 10, delay });

  return (
    <p>
      {displayedText}
      {!isComplete && <span className="ml-1 inline-block h-5 w-0.5 animate-pulse bg-[#f2c500]" />}
    </p>
  );
};

const RectoriaSection: React.FC<RectoriaSectionProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const rectorMessage = [
    "Habiendo transcurrido gran parte del presente año 2026 y posterior a celebrar los 34 años de existencia como colegio, tenemos la mirada puesta en el cierre del presente año para comenzar con más energía y alegría el próximo 2027.",
    "Nuestros alumnos ya se preparan en todas las áreas para dar término a este año académico, preparando sus cierres de notas, desarrollando las actividades sociales, artísticas, deportivas y de evaluación integral en los instrumentos SIMCE, PAES e Impulso Lector 2026.",
    "No tenemos dudas que todas estas evaluaciones les servirán a ellos para sentirse mejor preparados, como asimismo también servirán al colegio y a ustedes como apoderados, para revisar aquellas áreas donde es necesario reforzar a nuestros estudiantes.",
    "Seguimos trabajando en los proyectos de infraestructura deportiva, especialmente en la licitación para la transformación de nuestra cancha de fútbol a pasto sintético y esperamos contar con estos nuevos espacios a contar del inicio del año escolar 2027.",
    "Hemos iniciado el proceso de admisión 2027 y desde ya les damos la bienvenida a aquellas familias que han decidido considerar a nuestro CCP como la alternativa escolar para sus hijos e hijas.",
    "Un afectuoso saludo,"
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header with back button */}
      {onBack && <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <h1 className={`font-cinzel text-4xl md:text-5xl font-bold text-[#003b71] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Rectoría
          </h1>
        </div>
      </div>}

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className={`bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="relative min-h-[28rem] lg:min-h-full">
              <img
                src="https://i.postimg.cc/FFJCs0mq/Foto-Rector-CCP-2026-ajustada-IA-789x1024.png"
                alt="Ronald Baasch Barberis, rector del Colegio Capellán Pascal"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003b71]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-cinzel text-xl font-bold">Ronald Baasch Barberis</p>
                <p className="text-sm text-white/85">Rector</p>
              </div>
            </div>

          <div className="p-8 md:p-12">
            {/* Rector's Message */}
            <div className="rounded-2xl border-t-4 border-[#f2c500] bg-[#f8fafc] p-6 md:p-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f2c500]">Mensaje de Rectoría</p>
              <h2 className="font-cinzel text-3xl font-bold text-[#003b71] mb-8">Estimada comunidad<br />Colegio Capellán Pascal</h2>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                {rectorMessage.map((paragraph, index) => (
                  <TypedParagraph key={paragraph} text={paragraph} delay={index * 900} />
                ))}

                <div className="pt-5 mt-6 border-t border-[#003b71]/15">
                  <p className="text-xl font-bold text-[#003b71]">Ronald Baasch Barberis</p>
                  <p className="text-gray-600 italic">Rector</p>
                  <p className="text-gray-700">Colegio Capellán Pascal</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RectoriaSection;
