import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Instagram } from 'lucide-react';
import { getSiteLogoUrl } from '../lib/siteLogo';

interface NavbarProps {
  onPageChange: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOurOpen, setIsOurOpen] = useState(false);
  const [isAdmisionOpen, setIsAdmisionOpen] = useState(false);
  const [calendarsOpen, setCalendarsOpen] = useState(false);
  const [mobileNuestroColegioOpen, setMobileNuestroColegioOpen] = useState(false);
  const [mobileAdmisionOpen, setMobileAdmisionOpen] = useState(false);
  const [mobileCalendariosOpen, setMobileCalendariosOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const logoUrl = await getSiteLogoUrl();
      if (logoUrl) {
        setLogoUrl(logoUrl);
      }
    })();
  }, []);

  const handleNavigation = (page: string) => {
    onPageChange(page);
    setIsMenuOpen(false);
    setIsOurOpen(false);
    setIsAdmisionOpen(false);
    setOpenSection(null);
  };

  const renderDesktopSection = (label: string, items: Array<{ label: string; page: string }>) => (
    <div
      className="relative"
      onMouseEnter={() => setOpenSection(label)}
      onMouseLeave={() => setOpenSection(null)}
    >
      <button className="text-xs 2xl:text-sm text-[#003b71] uppercase whitespace-nowrap hover:text-[#f2c500] font-semibold transition-colors">
        {label}
      </button>
      <div className={`absolute left-0 top-full w-64 bg-[#003b71] border border-[#f2c500] rounded-lg shadow-lg py-2 z-[9999] transition-all duration-150 ${openSection === label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
        <ul className="space-y-1 px-2">
          {items.map((item) => (
            <li key={item.label}>
              <button onClick={() => handleNavigation(item.page)} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-[#f2c500] hover:text-[#003b71] transition-colors">
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 shadow-md">
      {/* TOP THIN BAR - Dark background with contact info */}
      <div className="w-full bg-white border-b-2 border-[#f2c500] relative z-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 lg:pl-48">
          <div className="flex items-center justify-between h-12 text-sm text-[#003b71] overflow-x-auto">
            
            {/* Left: Contact Information */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 flex-shrink-0">
              <div className="hidden md:flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#003b71]" />
                <span className="text-xs">+56 32 2546520</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#003b71]" />
                <span className="text-xs hidden lg:inline">contactoweb@capellanpascal.cl</span>
                <span className="text-xs lg:hidden">Email</span>
              </div>
              <a 
                href="https://www.instagram.com/colegiocapellanpascal/"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 sm:space-x-2 hover:text-[#f2c500] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#003b71]" />
                <span className="text-xs">@colegiocapellanpascal</span>
              </a>
              <a 
                href="tel:+56322546520"
                className="flex md:hidden items-center space-x-1 hover:text-[#f2c500] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#003b71]" />
                <span className="text-xs">Llamar</span>
              </a>
            </div>

            {/* Right: Quick Links */}
            <div className="hidden lg:flex items-center space-x-6">
              <button 
                onClick={() => handleNavigation('comunidad')}
                className="text-xs text-[#003b71] hover:text-[#f2c500] hover:underline"
              >
                Comunidad
              </button>
              <a 
                href="https://schoolnet.colegium.com/webapp/es_CL/login"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#003b71] hover:text-[#f2c500] hover:underline"
              >
                Portal SchoolNet
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN THICK BAR - Institutional vertical bands with logo and navigation */}
      <nav className="relative w-full overflow-visible border-b-4 border-[#003b71] bg-white">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#003b71_0%,#003b71_33%,#f2c500_33%,#f2c500_66%,#003b71_66%,#003b71_100%)] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 relative overflow-visible">

            {/* LEFT: LOGO */}
            <div className="flex items-center shrink-0">
              <button type="button" onClick={() => handleNavigation('home')} aria-label="Inicio" className="flex items-center gap-1 sm:gap-2 mt-4 relative z-30 text-left">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Colegio Capellán Pascal logo"
                    className="h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-56 lg:w-56 2xl:h-72 2xl:w-72 shrink-0 object-contain drop-shadow-lg"
                    onError={(e) => {
                      // If logo fails to load, hide it
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    className="h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-56 lg:w-56 2xl:h-72 2xl:w-72 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span className="font-cinzel shrink-0 whitespace-nowrap text-sm sm:text-xl md:text-2xl lg:text-2xl 2xl:text-3xl font-bold uppercase tracking-[0.04em] leading-tight text-[#003b71]">
                  Colegio Capellán Pascal
                </span>
              </button>
            </div>

            {/* CENTER: DESKTOP MAIN MENU */}
            <div className="hidden xl:flex shrink-0 items-center space-x-5 2xl:space-x-7 ml-auto pl-6 2xl:pl-10">
              <button onClick={() => handleNavigation('home')} className="text-xs 2xl:text-sm text-[#003b71] uppercase whitespace-nowrap hover:text-[#f2c500] font-semibold transition-colors">
                Inicio
              </button>
              
              {/* NUESTRO COLEGIO - Dropdown */}
              <div className="relative group">
                <button
                  className="text-xs 2xl:text-sm text-[#003b71] uppercase whitespace-nowrap hover:text-[#f2c500] font-semibold transition-colors"
                  onMouseEnter={() => setIsOurOpen(true)}
                  onMouseLeave={() => setIsOurOpen(false)}
                >
                  Nuestro Colegio
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute left-0 top-full w-64 bg-[#003b71] border border-[#f2c500] rounded-lg shadow-lg py-2 z-[9999] transition-all duration-150 ${
                    isOurOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                  onMouseEnter={() => setIsOurOpen(true)}
                  onMouseLeave={() => setIsOurOpen(false)}
                >
                  <ul className="space-y-1 px-2">
                    <li>
                      <button onClick={() => handleNavigation('historia-congregacion')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-[#f2c500] hover:text-[#003b71] transition-colors">
                        Historia Congregación
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('historia-colegio')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-[#f2c500] hover:text-[#003b71] transition-colors">
                        Historia del Colegio
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('directorio-fundacion')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-[#f2c500] hover:text-[#003b71] transition-colors">
                        Directorio Fundación
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('documentos-institucionales')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-[#f2c500] hover:text-[#003b71] transition-colors">
                        Documentos Oficiales
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('rectoria')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-[#f2c500] hover:text-[#003b71] transition-colors">
                        Rectoría
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('proyecto-educativo')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-[#f2c500] hover:text-[#003b71] transition-colors">
                        Proyecto Educativo
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('consejo-directivo')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-[#f2c500] hover:text-[#003b71] transition-colors">
                        Consejo Directivo
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('valores')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-[#f2c500] hover:text-[#003b71] transition-colors">
                        Matrícula y colegiaturas 2026
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

                {renderDesktopSection('Área de Formación', [
                  { label: 'Equipos de Formación', page: 'vicerrectoria-formacion' },
                  { label: 'Pastoral Juvenil', page: 'pastoral-juvenil' },
                  { label: 'Psicorientación', page: 'departamento-orientacion' },
                  { label: 'Convivencia Escolar', page: 'comunidad' },
                ])}

                {renderDesktopSection('Área Académica', [
                  { label: 'Equipo Académico', page: 'cultura-pensamiento' },
                  { label: 'Innovación Pedagógica', page: 'cultura-pensamiento' },
                  { label: 'ACLE', page: 'acles' },
                  { label: 'Biblioteca', page: 'biblioteca' },
                  { label: 'Calendario de Evaluaciones', page: 'calendario-primer-ciclo' },
                  { label: 'Programa de Intercambio Estudiantil 2027', page: 'recursos-digitales' },
                ])}

                {renderDesktopSection('Comunidad Educativa', [
                  { label: 'CEAL', page: 'ceal' },
                  { label: 'Pastoral Juvenil', page: 'pastoral-juvenil' },
                  { label: 'Uniforme', page: 'uniformes-escolares' },
                  { label: 'Lista de útiles', page: 'utiles-escolares' },
                  { label: 'Casino', page: 'casino-management' },
                ])}

                {renderDesktopSection('Documentación', [
                  { label: 'Proyecto Educativo Institucional', page: 'proyecto-educativo' },
                  { label: 'Documentos Oficiales', page: 'documentos-institucionales' },
                  { label: 'Plan Lector', page: 'plan-lector' },
                  { label: 'Reglamentos', page: 'institutional-documents' },
                ])}

              {/* Other Main Menu Items */}
              <button 
                onClick={() => {
                  const element = document.getElementById('tour-virtual-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    handleNavigation('tour-virtual');
                  }
                  setIsMenuOpen(false);
                }}
                className="hidden text-xs 2xl:text-sm text-[#003b71] uppercase whitespace-nowrap hover:text-[#f2c500] font-semibold transition-colors"
              >
                Tour Virtual
              </button>
              {/* ADMISION - Dropdown */}
              <div className="relative group">
                <button
                  className="text-xs 2xl:text-sm text-[#003b71] uppercase whitespace-nowrap hover:text-[#f2c500] font-semibold transition-colors"
                  onMouseEnter={() => setIsAdmisionOpen(true)}
                  onMouseLeave={() => setIsAdmisionOpen(false)}
                >
                  Admisión
                </button>
                {/* Dropdown Menu */}
                <div
                  className={`absolute left-0 top-full w-64 bg-[#003b71] border border-[#f2c500] rounded-lg shadow-lg py-2 z-[9999] transition-all duration-150 ${isAdmisionOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                  onMouseEnter={() => setIsAdmisionOpen(true)}
                  onMouseLeave={() => setIsAdmisionOpen(false)}
                >
                  <ul className="space-y-1 px-2">
                    <li>
                      <button onClick={() => handleNavigation('admision-prekinder')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-[#f2c500] hover:text-[#003b71] transition-colors">
                        Admisión Pre Kínder
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('admision-kinder-ii')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-[#f2c500] hover:text-[#003b71] transition-colors">
                        Admisión Kínder a I medio
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {renderDesktopSection('Servicios', [
                { label: 'Tour Virtual', page: 'tour-virtual' },
                { label: 'Calendario Primer Ciclo', page: 'calendario-primer-ciclo' },
                { label: 'Calendario Segundo Ciclo', page: 'calendario-segundo-ciclo' },
                { label: 'Calendario Tercer Ciclo', page: 'calendario-tercer-ciclo' },
                { label: 'Blog', page: 'news-management' },
                { label: 'Galería', page: 'comunidad' },
                { label: 'Contacto', page: 'comunidad' },
              ])}
              {/* CALENDARIOS - Dropdown */}
              <div className="relative group hidden">
                <button
                  className="text-xs 2xl:text-sm text-[#003b71] uppercase whitespace-nowrap hover:text-[#f2c500] font-semibold transition-colors"
                  onMouseEnter={() => setCalendarsOpen(true)}
                  onMouseLeave={() => setCalendarsOpen(false)}
                >
                  Calendarios
                </button>
                <div
                  className={`absolute left-0 top-full w-64 bg-[#003b71] border border-[#f2c500] rounded-lg shadow-lg py-2 z-[9999] transition-all duration-150 ${
                    calendarsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                  onMouseEnter={() => setCalendarsOpen(true)}
                  onMouseLeave={() => setCalendarsOpen(false)}
                >
                  <ul className="space-y-1 px-2">
                    <li>
                      <button onClick={() => handleNavigation('calendario-primer-ciclo')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Primer Ciclo
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('calendario-segundo-ciclo')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Segundo Ciclo
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('calendario-tercer-ciclo')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Tercer Ciclo
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT: MOBILE MENU TOGGLE */}
            <div className="flex items-center space-x-3">
              <div className="xl:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-[#003b71] hover:bg-white/70"
                  aria-label="Abrir menú"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE/TABLET MENU */}
        {isMenuOpen && (
          <div className="xl:hidden bg-white/95 backdrop-blur-sm border-t-4 border-[#f2c500]">
            <div className="px-4 pt-4 pb-6 space-y-2">
              
              {/* Nuestro Colegio - Mobile Dropdown */}
              <div className="block w-full">
                <button
                  onClick={() => setMobileNuestroColegioOpen(!mobileNuestroColegioOpen)}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm font-medium text-gray-800"
                >
                  Nuestro Colegio
                </button>
                {mobileNuestroColegioOpen && (
                  <div className="pl-4 border-l ml-2">
                    <button onClick={() => handleNavigation('historia-congregacion')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Historia Congregación
                    </button>
                    <button onClick={() => handleNavigation('historia-colegio')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Historia del Colegio
                    </button>
                    <button onClick={() => handleNavigation('directorio-fundacion')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Directorio Fundación
                    </button>
                    <button onClick={() => handleNavigation('documentos-institucionales')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Documentos Oficiales
                    </button>
                    <button onClick={() => handleNavigation('rectoria')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Rectoría
                    </button>
                    <button onClick={() => handleNavigation('proyecto-educativo')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Proyecto Educativo
                    </button>
                    <button onClick={() => handleNavigation('consejo-directivo')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Consejo Directivo
                    </button>
                    <button onClick={() => handleNavigation('valores')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Matrícula y colegiaturas 2026
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t pt-2">
                <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#003b71]">Áreas del colegio</p>
                {[
                  ['Área de Formación', 'vicerrectoria-formacion'],
                  ['Área Académica', 'cultura-pensamiento'],
                  ['Comunidad Educativa', 'comunidad'],
                  ['Documentación', 'documentos-institucionales'],
                ].map(([label, page]) => (
                  <button key={label} onClick={() => handleNavigation(page)} className="block w-full rounded px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-blue-50">
                    {label}
                  </button>
                ))}
                <a href="https://colegiocapellanpascal.cl/blog/" target="_blank" rel="noopener noreferrer" className="block rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50">Blog</a>
                <a href="https://colegiocapellanpascal.cl/galeria/" target="_blank" rel="noopener noreferrer" className="block rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50">Galería</a>
                <a href="https://colegiocapellanpascal.cl/contacto/" target="_blank" rel="noopener noreferrer" className="block rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50">Contacto</a>
              </div>

              {/* Tour Virtual */}
              <button onClick={() => handleNavigation('tour-virtual')} className="block w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm font-medium text-gray-800">
                Tour Virtual
              </button>

              {/* Admisión - Mobile Dropdown */}
              <div className="block w-full">
                <button
                  onClick={() => setMobileAdmisionOpen(!mobileAdmisionOpen)}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm font-medium text-gray-800"
                >
                  Admisión
                </button>
                {mobileAdmisionOpen && (
                  <div className="pl-4 border-l ml-2">
                    <button onClick={() => handleNavigation('admision-prekinder')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Admisión Pre Kínder
                    </button>
                    <button onClick={() => handleNavigation('admision-kinder-ii')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Admisión Kínder a I medio
                    </button>
                  </div>
                )}
              </div>

              {/* Calendarios - Mobile Dropdown */}
              <div className="block w-full">
                <button
                  onClick={() => setMobileCalendariosOpen(!mobileCalendariosOpen)}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm font-medium text-gray-800"
                >
                  Calendarios
                </button>
                {mobileCalendariosOpen && (
                  <div className="pl-4 border-l ml-2">
                    <button onClick={() => handleNavigation('calendario-primer-ciclo')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Primer Ciclo
                    </button>
                    <button onClick={() => handleNavigation('calendario-segundo-ciclo')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Segundo Ciclo
                    </button>
                    <button onClick={() => handleNavigation('calendario-tercer-ciclo')} className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700">
                      Tercer Ciclo
                    </button>
                  </div>
                )}
              </div>

              {/* Contact Info Section */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-600">Teléfono</div>
                    <div className="text-sm">(+56 2) 2719 4300</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Email</div>
                    <div className="text-sm">colegio@ssccmanquehue.cl</div>
                  </div>
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