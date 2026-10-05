import React from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

const QuienesSomosSection: React.FC = () => {

  const paragraph1 = "Somos el Colegio Sagrados Corazones Manquehue, una comunidad educativa católica perteneciente a la Congregación de los Sagrados Corazones, que forma personas íntegras desde una educación de excelencia, inspirada en el Evangelio y en la espiritualidad de los Sagrados Corazones de Jesús y de María.";
  const paragraph2 = "Educamos en comunidad, poniendo a la persona en el centro del proceso formativo y promoviendo el desarrollo académico, humano, espiritual, social y físico de nuestros estudiantes. Creemos en una educación que acoge la diversidad, fomenta el pensamiento crítico y acompaña a cada estudiante en su crecimiento personal y vocacional.";
  const paragraph3 = "Nuestro proyecto educativo se sustenta en valores como la fraternidad, el respeto, la solidaridad y el compromiso con los demás, formando hombres y mujeres conscientes, competentes y comprometidos con la construcción de una sociedad más justa y fraterna.";
  const paragraph4 = "El Colegio SS.CC. Manquehue es un espacio de encuentro, aprendizaje y vida, donde la educación y la fe se integran para dar sentido a la formación de cada estudiante.";

  const { displayedText: text1, isComplete: complete1 } = useTypewriter({ 
    text: paragraph1, 
    speed: 15,
    delay: 500 
  });

  const { displayedText: text2, isComplete: complete2 } = useTypewriter({ 
    text: paragraph2, 
    speed: 15,
    delay: complete1 ? 300 : 999999 
  });

  const { displayedText: text3, isComplete: complete3 } = useTypewriter({ 
    text: paragraph3, 
    speed: 15,
    delay: complete2 ? 300 : 999999 
  });

  const { displayedText: text4 } = useTypewriter({ 
    text: paragraph4, 
    speed: 15,
    delay: complete3 ? 300 : 999999 
  });

  return (
    <section id="quienes-somos-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 font-medium" style={{color: '#2563EB'}}>
              <div className="w-8 h-0.5" style={{backgroundColor: '#2563EB'}}></div>
              <span>Quiénes Somos</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 leading-tight">
              ¿Quiénes somos?
            </h2>
            
            {/* Typewriter Effect Paragraphs */}
            <div className="space-y-4">
              <p className="text-gray-700 text-base leading-relaxed">
                {text1}
                {!complete1 && <span className="inline-block w-0.5 h-5 bg-blue-600 ml-1 animate-pulse"></span>}
              </p>
              
              {complete1 && (
                <p className="text-gray-700 text-base leading-relaxed">
                  {text2}
                  {!complete2 && <span className="inline-block w-0.5 h-5 bg-blue-600 ml-1 animate-pulse"></span>}
                </p>
              )}
              
              {complete2 && (
                <p className="text-gray-700 text-base leading-relaxed">
                  {text3}
                  {!complete3 && <span className="inline-block w-0.5 h-5 bg-blue-600 ml-1 animate-pulse"></span>}
                </p>
              )}
              
              {complete3 && (
                <p className="text-gray-700 text-base leading-relaxed">
                  {text4}
                  <span className="inline-block w-0.5 h-5 bg-blue-600 ml-1 animate-pulse"></span>
                </p>
              )}
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative">
              {/* Decorative blue square background */}
              <div className="absolute -top-6 -right-6 w-96 h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg opacity-20"></div>
              {/* Main image with square shape */}
              <div className="relative w-96 h-96 mx-auto rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://i.postimg.cc/vH3y23Z4/fotodecomida2.jpg"
                  alt="Colegio Sagrados Corazones de Manquehue"
                  className="w-full h-full object-cover object-center scale-110"
                />
              </div>
              {/* Additional decorative elements */}
              <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-lg opacity-30 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuienesSomosSection;
