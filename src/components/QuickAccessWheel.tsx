import React, { useRef, useState } from 'react';
import { ExternalLink, GripVertical, X } from 'lucide-react';

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
  const [position, setPosition] = useState(50);
  const dragStart = useRef<{ y: number; position: number } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragStart.current = { y: event.clientY, position };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStart.current) return;
    const delta = ((event.clientY - dragStart.current.y) / window.innerHeight) * 100;
    setPosition(Math.min(82, Math.max(18, dragStart.current.position + delta)));
  };

  const handlePointerUp = () => {
    dragStart.current = null;
  };

  return (
    <aside
      className="fixed right-0 z-40 -translate-y-1/2"
      style={{ top: `${position}%` }}
      aria-label="Accesos rápidos"
    >
      <div className={`relative flex items-center transition-transform duration-300 ${isOpen ? '-translate-x-2' : 'translate-x-[calc(100%-3.5rem)]'}`}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative z-10 flex h-14 w-14 shrink-0 cursor-grab items-center justify-center rounded-full border-4 border-white bg-[#003b71] text-white shadow-xl active:cursor-grabbing"
          aria-label={isOpen ? 'Cerrar accesos rápidos' : 'Abrir accesos rápidos'}
        >
          {isOpen ? <X className="h-6 w-6" /> : <GripVertical className="h-6 w-6" />}
          <span className="absolute -left-24 whitespace-nowrap rounded-full bg-[#f2c500] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#003b71] shadow-md">
            Accesos
          </span>
        </button>

        <div className="absolute right-7 flex h-72 w-72 items-center justify-center rounded-full border-4 border-[#f2c500]/80 bg-white/95 shadow-2xl backdrop-blur-sm">
          <div className="grid w-44 gap-1.5">
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
