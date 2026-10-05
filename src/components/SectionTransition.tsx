import React, { useEffect, useRef, useState } from 'react';

interface SectionTransitionProps {
  imageUrl: string;
  alt: string;
  eyebrow: string;
  title: string;
}

const SectionTransition: React.FC<SectionTransitionProps> = ({ imageUrl, alt, eyebrow, title }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (section) {
          const rect = section.getBoundingClientRect();
          const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight));
          setParallaxOffset(progress * 80);
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
  }, []);

  return (
    <section ref={sectionRef} className="relative z-20 h-screen w-full overflow-hidden bg-[#001d38]">
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0px)' }}>
        <img
          src={imageUrl}
          alt={alt}
          className="h-full w-full object-cover object-center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            transform: `scale(1.06) translateY(${parallaxOffset}px)`,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-[#001d38]/45" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#003b71_0%,#003b71_33%,#f2c500_33%,#f2c500_66%,#003b71_66%,#003b71_100%)]" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center text-white">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#f2c500]">{eyebrow}</p>
          <h2 className="font-cinzel text-4xl font-bold leading-tight drop-shadow-2xl md:text-6xl">{title}</h2>
          <div className="mx-auto mt-10 h-12 w-7 rounded-full border-2 border-white/70 p-1">
            <div className="h-2 w-full animate-bounce rounded-full bg-[#f2c500]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionTransition;
