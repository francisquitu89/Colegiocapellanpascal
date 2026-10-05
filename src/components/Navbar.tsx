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
  };

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 shadow-md">
      {/* TOP THIN BAR - Dark background with contact info */}
      <div className="w-full bg-[#0b2540] border-b border-[#08304a] relative z-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 lg:pl-48">
          <div className="flex items-center justify-between h-12 text-sm text-white overflow-x-auto">
            
            {/* Left: Contact Information */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 flex-shrink-0">
              <div className="hidden md:flex items-center space-x-2">
                <Phone className="w-4 h-4 text-white" />
                <span className="text-xs">(+56 2) 2719 4300</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <Mail className="w-4 h-4 text-white" />
                <span className="text-xs hidden lg:inline">colegio@ssccmanquehue.cl</span>
                <span className="text-xs lg:hidden">Email</span>
              </div>
              <a 
                href="https://www.instagram.com/colegiossccmanquehue/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 sm:space-x-2 hover:text-blue-300 transition-colors"
              >
                <Instagram className="w-4 h-4 text-white" />
                <span className="text-xs hidden xl:inline">@colegiossccmanquehue</span>
                <span className="text-xs xl:hidden">Instagram</span>
              </a>
              <a 
                href="tel:+56227194300"
                className="flex md:hidden items-center space-x-1 hover:text-blue-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-white" />
                <span className="text-xs">Llamar</span>
              </a>
            </div>

            {/* Right: Quick Links */}
            <div className="hidden lg:flex items-center space-x-6">
              <button 
                onClick={() => handleNavigation('comunidad')}
                className="text-xs text-white hover:underline"
              >
                Comunidad
              </button>
              <a 
                href="https://schoolnet.colegium.com/webapp/es_CL/login"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white hover:underline"
              >
                Portal SchoolNet
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN THICK BAR - White background with logo and navigation */}
      <nav className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 relative">

            {/* LEFT: LOGO AND SCHOOL NAME */}
            <div className="flex items-center">
              <button type="button" onClick={() => handleNavigation('home')} aria-label="Inicio" className="flex items-center mt-4 relative z-30 text-left">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Colegio Manquehue SSCC logo"
                    className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-44 lg:w-44 object-contain"
                    onError={(e) => {
                      // If logo fails to load, hide it
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-44 lg:w-44"
                    aria-hidden="true"
                  />
                )}

                <div className="ml-2 sm:ml-4 md:ml-6 leading-tight -mt-4 sm:-mt-6">
                  <div className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-900 uppercase font-sans">
                    <span className="font-normal">COLEGIO </span>
                    <span className="font-extrabold">SSCC</span>
                    <span className="font-normal"> MANQUEHUE</span>
                  </div>
                </div>
              </button>
            </div>

            {/* CENTER: DESKTOP MAIN MENU */}
            <div className="hidden xl:flex items-center space-x-8 max-w-3xl flex-1 justify-center">
              
              {/* NUESTRO COLEGIO - Dropdown */}
              <div className="relative group">
                <button
                  className="text-sm text-gray-800 uppercase whitespace-nowrap hover:text-blue-700 font-medium transition-colors"
                  onMouseEnter={() => setIsOurOpen(true)}
                  onMouseLeave={() => setIsOurOpen(false)}
                >
                  Nuestro Colegio
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute left-0 top-full w-64 bg-[#0b2540] border border-[#08304a] rounded-lg shadow-lg py-2 z-[9999] transition-all duration-150 ${
                    isOurOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                  onMouseEnter={() => setIsOurOpen(true)}
                  onMouseLeave={() => setIsOurOpen(false)}
                >
                  <ul className="space-y-1 px-2">
                    <li>
                      <button onClick={() => handleNavigation('historia-congregacion')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Historia Congregación
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('historia-colegio')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Historia del Colegio
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('directorio-fundacion')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Directorio Fundación
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('documentos-institucionales')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Documentos Oficiales
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('rectoria')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Rectoría
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('proyecto-educativo')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Proyecto Educativo
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('consejo-directivo')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Consejo Directivo
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('valores')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Matrícula y colegiaturas 2026
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

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
                className="text-sm text-gray-800 uppercase whitespace-nowrap hover:text-blue-700 font-medium transition-colors"
              >
                Tour Virtual
              </button>
              {/* ADMISION - Dropdown */}
              <div className="relative group">
                <button
                  className="text-sm text-gray-800 uppercase whitespace-nowrap hover:text-blue-700 font-medium transition-colors"
                  onMouseEnter={() => setIsAdmisionOpen(true)}
                  onMouseLeave={() => setIsAdmisionOpen(false)}
                >
                  Admisión
                </button>
                {/* Dropdown Menu */}
                <div
                  className={`absolute left-0 top-full w-64 bg-[#0b2540] border border-[#08304a] rounded-lg shadow-lg py-2 z-[9999] transition-all duration-150 ${isAdmisionOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                  onMouseEnter={() => setIsAdmisionOpen(true)}
                  onMouseLeave={() => setIsAdmisionOpen(false)}
                >
                  <ul className="space-y-1 px-2">
                    <li>
                      <button onClick={() => handleNavigation('admision-prekinder')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Admisión Pre Kínder
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigation('admision-kinder-ii')} className="w-full text-left px-3 py-2 text-xs text-white rounded hover:bg-blue-700 transition-colors">
                        Admisión Kínder a I medio
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {/* CALENDARIOS - Dropdown */}
              <div className="relative group">
                <button
                  className="text-sm text-gray-800 uppercase whitespace-nowrap hover:text-blue-700 font-medium transition-colors"
                  onMouseEnter={() => setCalendarsOpen(true)}
                  onMouseLeave={() => setCalendarsOpen(false)}
                >
                  Calendarios
                </button>
                <div
                  className={`absolute left-0 top-full w-64 bg-[#0b2540] border border-[#08304a] rounded-lg shadow-lg py-2 z-[9999] transition-all duration-150 ${
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
                  className="p-2 rounded-md text-gray-800 hover:bg-gray-100"
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
          <div className="xl:hidden bg-white border-t">
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