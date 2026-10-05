import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';

interface RectoriaSectionProps {
  onBack?: () => void;
  cinematic?: boolean;
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

const ScrollTypedParagraph: React.FC<{ text: string; progress: number }> = ({ text, progress }) => {
  const displayedLength = Math.min(text.length, Math.floor(text.length * progress));
  const displayedText = text.slice(0, displayedLength);

  return (
    <p>
      {displayedText}
      {displayedLength < text.length && (
        <span className="ml-1 inline-block h-5 w-0.5 animate-pulse bg-[#f2c500]" />
      )}
    </p>
  );
};

const RectoriaSection: React.FC<RectoriaSectionProps> = ({ onBack, cinematic = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
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

  useEffect(() => {
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          if (cinematic) {
            const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
            const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
            setScrollProgress(progress);
            setParallaxOffset((progress - 0.5) * 120);
          } else {
            const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight));
            setParallaxOffset(progress * 72);
          }
        }
        frameId = 0;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [cinematic]);

  if (cinematic) {
    const paragraphProgress = (index: number) => Math.max(0, Math.min(1, (scrollProgress - 0.2 - index * 0.12) / 0.22));

    return (
      <section ref={sectionRef} className="relative overflow-clip bg-[#001d38]" style={{ height: '260vh' }}>
        <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
          <img
            src="https://i.postimg.cc/9fdTnFj1/Discurso-solemne-en-el-colegio.png"
            alt="Discurso solemne en el Colegio Capellán Pascal"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out"
            style={{ transform: `scale(1.08) translateY(${parallaxOffset}px)` }}
          />
          <div className="absolute inset-0 bg-[#001d38]/55" />
          <div
            className="absolute inset-0 bg-[#001d38]"
            style={{ opacity: Math.max(0, 0.42 - scrollProgress * 0.34) }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#003b71_0%,#003b71_33%,#f2c500_33%,#f2c500_66%,#003b71_66%,#003b71_100%)]" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div
              className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]"
              style={{
                transform: `translateY(${(1 - scrollProgress) * 55}px)`,
                opacity: Math.min(1, scrollProgress * 2.8),
              }}
            >
              <div className="text-white">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#f2c500]">
                  Les habla el rector
                </p>
                <h2 className="font-cinzel text-4xl font-bold leading-tight md:text-6xl">
                  Un mensaje para nuestra comunidad
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-white/80">
                  Desplázate para escuchar y leer el mensaje de Rectoría.
                </p>
                <div className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full origin-left bg-[#f2c500] transition-transform duration-150" style={{ transform: `scaleX(${scrollProgress})` }} />
                </div>
              </div>

              <div className="rounded-2xl border-t-4 border-t-[#f2c500] bg-white p-6 shadow-2xl md:p-10">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f2c500]">Mensaje de Rectoría</p>
                <h3 className="font-cinzel mb-8 text-3xl font-bold text-[#003b71] md:text-4xl">
                  Estimada comunidad<br />Colegio Capellán Pascal
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {rectorMessage.map((paragraph, index) => (
                    <ScrollTypedParagraph key={paragraph} text={paragraph} progress={paragraphProgress(index)} />
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
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#f8fafc]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#003b71_0%,#003b71_33%,#f2c500_33%,#f2c500_66%,#003b71_66%,#003b71_100%)]" />
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

      {/* Cinematic rector message with parallax portrait */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className={`relative overflow-hidden rounded-[2rem] bg-[#003b71] shadow-2xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,#f2c500_0,transparent_35%),radial-gradient(circle_at_80%_80%,#6f91ad_0,transparent_40%)]" />
          </div>
          <div className="relative grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="relative min-h-[34rem] overflow-hidden lg:min-h-[48rem]">
              <img
                src="https://i.postimg.cc/FFJCs0mq/Foto-Rector-CCP-2026-ajustada-IA-789x1024.png"
                alt="Ronald Baasch Barberis, rector del Colegio Capellán Pascal"
                className="absolute -inset-y-10 inset-x-0 h-[calc(100%+5rem)] w-full object-cover object-center transition-transform duration-300 ease-out"
                style={{ transform: `translateY(${parallaxOffset}px) scale(1.08)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003b71] via-[#003b71]/15 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white md:bottom-10 md:left-10">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#f2c500]">Les habla el rector</p>
                <p className="font-cinzel text-2xl font-bold md:text-3xl">Ronald Baasch Barberis</p>
                <p className="text-sm text-white/85">Colegio Capellán Pascal</p>
              </div>
            </div>

          <div className="flex items-center p-6 md:p-12 lg:p-16">
            {/* Rector's Message */}
            <div className="w-full rounded-2xl border border-white/15 border-t-4 border-t-[#f2c500] bg-white p-6 shadow-xl md:p-10">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f2c500]">Mensaje de Rectoría</p>
              <h2 className="font-cinzel mb-8 text-3xl font-bold text-[#003b71] md:text-4xl">Estimada comunidad<br />Colegio Capellán Pascal</h2>

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
    </section>
  );
};

export default RectoriaSection;
