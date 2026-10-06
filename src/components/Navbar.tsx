import React, { useEffect, useState } from 'react';
import { Instagram, Mail, Menu, Phone, X } from 'lucide-react';
import { getSiteLogoUrl } from '../lib/siteLogo';

interface NavbarProps {
  onPageChange: (page: string) => void;
}

type NavigationItem = {
  label: string;
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

const NAVIGATION_SECTIONS: Array<{ label: string; groups: NavigationGroup[] }> = [
  {
    label: 'Nuestro colegio',
    groups: [
      {
        label: 'El colegio',
        items: [
          { label: 'Saludo del Rector' },
          { label: 'Misión y Visión' },
          { label: 'Valores' },
          { label: 'Historia' },
          { label: 'Organigrama' },
          { label: 'Equipo' },
          { label: 'Infraestructura' },
        ],
      },
      {
        label: 'Documentación',
        items: [
          { label: 'PEI' },
          { label: 'RIE' },
          { label: 'Reglamento de Evaluación y Promoción' },
          { label: 'Plan integral de seguridad' },
          { label: 'Seguros' },
          { label: 'Bus Escolar' },
          { label: 'Informe Pantallas que Atrapan' },
        ],
      },
    ],
  },
  {
    label: 'Área de Formación',
    groups: [
      {
        label: 'Formación y convivencia escolar',
        items: [
          { label: 'Equipos' },
          { label: 'Pastoral' },
          { label: 'Psicorientación' },
          { label: 'Jefatura de Curso' },
        ],
      },
      {
        label: 'Documentación',
        items: [
          { label: 'Plan de Formación' },
          { label: 'Hitos Formativos' },
          { label: 'Plan de Convivencia Escolar' },
          { label: 'Plan de Formación Ciudadana' },
        ],
      },
    ],
  },
  {
    label: 'Área Académica',
    groups: [
      {
        label: 'Área Académica',
        items: [
          { label: 'Equipo' },
          { label: 'Innovación Pedagógica' },
          { label: 'ACLE' },
          { label: 'Biblioteca' },
          { label: 'Calendario de Evaluaciones' },
          { label: 'Programa de Intercambio Estudiantil 2027' },
        ],
      },
    ],
  },
  {
    label: 'Comunidad Educativa',
    groups: [
      {
        label: 'Comunidad Educativa',
        items: [
          { label: 'CEAL' },
          { label: 'CGPA' },
          { label: 'Exalumnos' },
          { label: 'Circulares' },
          { label: 'Uniforme' },
          { label: 'Lista de útiles' },
          { label: 'Casino' },
        ],
      },
      {
        label: 'Admisión',
        items: [
          { label: 'Admisión 2027' },
        ],
      },
    ],
  },
];

const Navbar: React.FC<NavbarProps> = ({ onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const url = await getSiteLogoUrl();
      if (url) setLogoUrl(url);
    })();
  }, []);

  const handleNavigation = (page: string) => {
    onPageChange(page);
    setIsMenuOpen(false);
    setMobileOpenSection(null);
    setOpenSection(null);
  };

  const renderNavigationItem = (item: NavigationItem, mobile = false) => {
    const className = mobile
      ? 'block rounded px-3 py-2 text-sm font-medium text-gray-700'
      : 'block rounded px-3 py-2 text-xs text-white';

    return (
      <span key={item.label} className={className}>
        {item.label}
      </span>
    );
  };

  const renderDesktopSection = (section: (typeof NAVIGATION_SECTIONS)[number]) => (
    <div
      key={section.label}
      className="relative"
      onMouseEnter={() => setOpenSection(section.label)}
      onMouseLeave={() => setOpenSection(null)}
    >
      <button
        type="button"
        aria-expanded={openSection === section.label}
        onClick={() => setOpenSection(section.label)}
        className="text-xs 2xl:text-sm text-[#003b71] uppercase whitespace-nowrap font-semibold transition-colors hover:text-[#f2c500]"
      >
        {section.label}
      </button>
      <div
        className={`absolute right-0 top-full z-[9999] w-[min(48rem,calc(100vw-2rem))] rounded-lg border border-[#f2c500] bg-[#003b71] p-4 shadow-lg transition-all duration-150 ${
          openSection === section.label ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${section.groups.length}, minmax(0, 1fr))` }}>
          {section.groups.map((group) => (
            <div key={group.label}>
              <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wide text-[#f2c500]">{group.label}</h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.label}>{renderNavigationItem(item)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full shadow-md">
      <div className="relative z-20 w-full border-b-2 border-[#f2c500] bg-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 lg:pl-48">
          <div className="flex h-12 items-center justify-between overflow-x-auto text-sm text-[#003b71]">
            <div className="flex shrink-0 items-center space-x-2 sm:space-x-4 lg:space-x-6">
              <div className="hidden items-center space-x-2 md:flex">
                <Phone className="h-4 w-4 text-[#003b71]" />
                <span className="text-xs">+56 32 2546520</span>
              </div>
              <div className="hidden items-center space-x-2 sm:flex">
                <Mail className="h-4 w-4 text-[#003b71]" />
                <span className="hidden text-xs lg:inline">contactoweb@capellanpascal.cl</span>
                <span className="text-xs lg:hidden">Email</span>
              </div>
              <a
                href="https://www.instagram.com/colegiocapellanpascal/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 transition-colors hover:text-[#f2c500] sm:space-x-2"
              >
                <Instagram className="h-4 w-4 text-[#003b71]" />
                <span className="text-xs">@colegiocapellanpascal</span>
              </a>
              <a href="tel:+56322546520" className="flex items-center space-x-1 hover:text-[#f2c500] md:hidden">
                <Phone className="h-4 w-4 text-[#003b71]" />
                <span className="text-xs">Llamar</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <nav className="relative w-full overflow-visible border-b-4 border-[#003b71] bg-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#003b71_0%,#003b71_33%,#f2c500_33%,#f2c500_66%,#003b71_66%,#003b71_100%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-2 sm:px-4 lg:px-5 xl:max-w-none xl:px-[clamp(3rem,calc(30vw_-_336px),6rem)]">
          <div className="relative flex h-20 items-center justify-between overflow-visible">
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => handleNavigation('home')}
                aria-label="Inicio"
                className="relative z-30 mt-4 flex items-center gap-1 text-left sm:gap-2"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Colegio Capellán Pascal logo"
                    className="h-24 w-24 shrink-0 object-contain drop-shadow-lg sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-56 lg:w-56 2xl:h-72 2xl:w-72"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="h-24 w-24 shrink-0 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-56 lg:w-56 2xl:h-72 2xl:w-72" aria-hidden="true" />
                )}
                <span className="relative -translate-x-4 shrink-0 whitespace-nowrap font-cinzel text-[10px] font-bold uppercase leading-tight tracking-[0.04em] text-[#003b71] sm:text-xl md:text-2xl lg:text-2xl xl:-top-2 2xl:text-3xl">
                  Colegio Capellán Pascal
                </span>
              </button>
            </div>

            <div className="ml-auto hidden shrink-0 items-center gap-3 pl-4 xl:flex 2xl:gap-5 2xl:pl-6">
              {NAVIGATION_SECTIONS.map(renderDesktopSection)}
            </div>

            <div className="flex items-center space-x-3 xl:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-md p-2 text-[#003b71] hover:bg-white/70"
                aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t-4 border-[#f2c500] bg-white/95 backdrop-blur-sm xl:hidden">
            <div className="mx-auto max-h-[70vh] max-w-7xl space-y-2 overflow-y-auto px-4 pb-6 pt-4">
              {NAVIGATION_SECTIONS.map((section) => {
                const isOpen = mobileOpenSection === section.label;
                return (
                  <section key={section.label} className="border-b border-gray-200 pb-2">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setMobileOpenSection(isOpen ? null : section.label)}
                      className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                      {section.label}
                      <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="space-y-3 border-l pl-3">
                        {section.groups.map((group) => (
                          <div key={group.label}>
                            <h3 className="px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#003b71]">
                              {group.label}
                            </h3>
                            <ul>
                              {group.items.map((item) => (
                                <li key={item.label}>{renderNavigationItem(item, true)}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
              <div className="flex items-center justify-between gap-3 pt-2 text-sm text-gray-700">
                <div>
                  <div className="text-xs text-gray-600">Teléfono</div>
                  <a href="tel:+56322546520">+56 32 2546520</a>
                </div>
                <div className="min-w-0 text-right">
                  <div className="text-xs text-gray-600">Email</div>
                  <a
                    href="mailto:contactoweb@capellanpascal.cl"
                    className="block max-w-36 break-all text-[10px] leading-tight sm:max-w-none sm:text-xs"
                  >
                    contactoweb@capellanpascal.cl
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
