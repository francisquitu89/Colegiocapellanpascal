import React, { useState } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import ACLESCard from './ACLESCard';

interface ACLESSectionProps {
  onBack: () => void;
}

const ACLESSection: React.FC<ACLESSectionProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const deportivas = [
    'Fútbol',
    'Hockey',
    'Rugby',
    'Voleibol',
    'Cheerleader'
  ];

  const artisticas = [
    'Taller de arte',
    'Taller de Electroacústica'
  ];

  const cientificas = [
    'Ecología',
    'Robótica',
    'Ajedrez'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
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
            Deportes y Actividades Coprogramáticas
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Descripción */}
        <div className={`bg-white rounded-lg shadow-lg p-8 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                En el Colegio Sagrados Corazones Manquehue entendemos el deporte y las actividades coprogramáticas como un pilar fundamental de la formación integral de nuestros estudiantes, contribuyendo a su desarrollo físico, social, emocional y valórico.
              </p>
              <p>
                Nuestra propuesta se inspira en el <strong>Modelo Islandés de prevención</strong>, que promueve la participación activa de niños, niñas y jóvenes en actividades deportivas, artísticas y recreativas como una herramienta clave para su bienestar, el desarrollo de hábitos de vida saludable y la prevención de conductas de riesgo. Desde esta mirada, fomentamos entornos seguros, protectores y formativos, donde el acompañamiento de la familia y la comunidad educativa es esencial.
              </p>
              <p>
                A través de una amplia y diversa oferta deportiva y coprogramática, promovemos el trabajo en equipo, la perseverancia, la disciplina, el respeto y el sentido de pertenencia, permitiendo que cada estudiante descubra y potencie sus talentos, fortalezca su autoestima y aprenda a relacionarse positivamente con los demás.
              </p>
              <p>
                El deporte escolar y las actividades coprogramáticas son también una instancia privilegiada para vivir los valores del colegio, tanto en la participación recreativa como competitiva, a nivel escolar, nacional e internacional, reforzando la sana convivencia y el compromiso con la comunidad.
              </p>
              <p>
                De este modo, el Colegio SS.CC. Manquehue ofrece experiencias formativas que trascienden el aula, aportando al desarrollo equilibrado de personas íntegras, activas y comprometidas con su bienestar y el de los demás.
              </p>
            </div>
          </div>
        </div>

        {/* Título de actividades */}
        <div className={`text-center mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Actividades</h2>
          <p className="text-gray-600">Descubre las ACLES disponibles para nuestros alumnos</p>
        </div>

        {/* Tarjetas ACLES */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ACLESCard
              type="deportiva"
              title="Actividades Deportivas"
              items={deportivas}
              imageUrl="https://i.postimg.cc/fbZjyFLC/futbol.png"
            />
          </div> */}

          {/* <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ACLESCard
              type="artistica"
              title="Actividades Artísticas"
              items={artisticas}
              imageUrl="https://i.postimg.cc/1R6G0sqL/Ss-CC.png"
            />
          </div> */}

          {/* <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ACLESCard
              type="cientifica"
              title="Actividades Científicas"
              items={cientificas}
              imageUrl="https://i.postimg.cc/85L7vk0P/cientifico.png"
            />
          </div> */}
        </div>

        {/* Instruction hint */}
        <div className={`text-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-sm text-gray-500 italic flex items-center justify-center space-x-2">
            <span>💡</span>
            <span>Haz clic en las tarjetas para ver las actividades disponibles</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ACLESSection;
