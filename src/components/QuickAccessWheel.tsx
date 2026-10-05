import React, { useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

const quickLinks = [
  { label: 'SchoolNet', href: 'https://schoolnet.colegium.com/webapp/es_CL/login' },
  { label: 'Pago en línea', href: 'https://www.webpay.cl/company/26718' },
  { label: 'Tour Virtual', href: 'https://tours.tourify.cl/tours/F6HDltY9V' },
  { label: 'Catálogo Biblioteca', href: 'https://capellanpascal.colegium.com/mt' },
  { label: 'Admisión 2027', href: 'https://colegiocapellanpascal.cl/admision-2027/' },
  { label: 'P. I. Estudiantil 2027', href: 'https://colegiocapellanpascal.cl/area-academica/programa-de-intercambio-estudiantil-2027/' },
  { label: 'Certificación Cambridge', href: 'https://colegiocapellanpascal.cl/departamento-de-ingles-formacion-para-un-mundo-global/' },
];

const QuickAccessWheel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(56);
  const dragStart = useRef<{ y: number; position: number } | null>(null);
  const wasDragged = useRef(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragStart.current = { y: event.clientY, position };
    wasDragged.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStart.current) return;
    if (Math.abs(event.clientY - dragStart.current.y) > 4) {
      wasDragged.current = true;
    }
    const delta = ((event.clientY - dragStart.current.y) / window.innerHeight) * 100;
    setPosition(Math.min(86, Math.max(14, dragStart.current.position + delta)));
  };

  const handlePointerUp = () => {
    dragStart.current = null;
  };

  const togglePanel = () => {
    if (wasDragged.current) {
      wasDragged.current = false;
      return;
    }
    setIsOpen((open) => !open);
  };

  return (
    <aside
      className="fixed right-4 sm:right-8 z-40 -translate-y-1/2"
      style={{ top: `${position}%` }}
      aria-label="Accesos rápidos"
    >
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={togglePanel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative z-10 flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 cursor-grab items-center justify-center overflow-visible rounded-full border-4 border-white bg-[#f2c500] text-[#003b71] shadow-[0_8px_30px_rgba(0,59,113,0.35)] transition-transform duration-200 hover:scale-105 active:cursor-grabbing"
          aria-label={isOpen ? 'Cerrar accesos rápidos' : 'Abrir accesos rápidos'}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <span className="relative block h-14 w-14 rounded-full border-2 border-[#003b71] bg-white">
              <span className="absolute left-3 top-3 h-3 w-3 rounded-full bg-[#003b71]" />
              <span className="absolute right-3 top-3 h-3 w-3 rounded-full bg-[#003b71]" />
              <span className="absolute bottom-3 left-1/2 h-3 w-6 -translate-x-1/2 rounded-b-full border-b-2 border-[#003b71]" />
            </span>
          )}
          {!isOpen && (
            <span className="absolute right-[calc(100%+0.75rem)] top-1/2 w-56 -translate-y-1/2 rounded-2xl rounded-br-sm bg-white px-5 py-3 text-center text-sm font-bold text-[#003b71] shadow-[0_8px_24px_rgba(0,59,113,0.22)] ring-2 ring-[#f2c500] after:absolute after:right-[-9px] after:top-1/2 after:-translate-y-1/2 after:border-y-[9px] after:border-l-[9px] after:border-y-transparent after:border-l-white">
              ¿En qué te puedo ayudar?
            </span>
          )}
        </button>

        <div className={`absolute right-0 top-28 w-80 rounded-3xl border-2 border-[#f2c500] bg-white/95 p-5 shadow-2xl backdrop-blur-sm transition-all duration-300 ${
          isOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-4 opacity-0'
        }`}>
          <div className="mb-3 flex items-center justify-between border-b border-[#003b71]/10 pb-2">
            <span className="text-sm font-bold text-[#003b71]">Accesos rápidos</span>
            <span className="text-[10px] text-slate-500">Elige una opción</span>
          </div>
          <div className="grid gap-1.5">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg bg-[#003b71] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#f2c500] hover:text-[#003b71]"
              >
                {link.label}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default QuickAccessWheel;
