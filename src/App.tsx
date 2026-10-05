import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminLogin from './components/AdminLogin';
import Historia from './components/Historia';
import HistoriaCongregacion from './components/HistoriaCongregacion';
import HistoriaColegio from './components/HistoriaColegio';
import VisionMision from './components/VisionMision';
import NewsSection from './components/NewsSection';
import NewsManagement from './components/NewsManagement';
import DirectoryManagement from './components/DirectoryManagement';
import ProyectoEducativo from './components/ProyectoEducativo';
import StudentWithdrawalControl from './components/StudentWithdrawalControl';
import AdminDashboard from './components/AdminDashboard';
import Tour360Section from './components/Tour360Section';
import ACLESSection from './components/ACLESSection';
import DepartamentoOrientacionSection from './components/DepartamentoOrientacionSection';
import DepartamentoOrientacionManagement from './components/DepartamentoOrientacionManagement';
import VicerretoriaFormacionSection from './components/VicerretoriaFormacionSection';
import InstitutionalDocuments from './components/InstitutionalDocuments';
import InstitutionalDocumentsManagement from './components/InstitutionalDocumentsManagement';
import CEALSection from './components/CEALSection';
import PastoralJuvenilSection from './components/PastoralJuvenilSection';
import CEALManagement from './components/CEALManagement';
import PastoralManagement from './components/PastoralManagement';
import ComunidadSection from './components/ComunidadSection';
import ComunidadManagement from './components/ComunidadManagement';
import CulturaPensamientoSection from './components/CulturaPensamientoSection';
import FundacionPentecostes from './components/FundacionPentecostes';
import DirectorioFundacion from './components/DirectorioFundacion';
import AdmisionSection from './components/AdmisionSection';
import AdmisionManagement from './components/AdmisionManagement';
import BibliotecaSection from './components/BibliotecaSection';
import BibliotecaManagement from './components/BibliotecaManagement';
import UtilesEscolaresSection from './components/UtilesEscolaresSection';
import UtilesEscolaresManagement from './components/UtilesEscolaresManagement';
import CasinoModal from './components/CasinoModal';
import CasinoManagement from './components/CasinoManagement';
import UniformesEscolaresSection from './components/UniformesEscolaresSection';
import UniformesEscolaresManagement from './components/UniformesEscolaresManagement';
import HorariosSection from './components/HorariosSection';
import HorariosManagement from './components/HorariosManagement';
import PagosSection from './components/PagosSection';
import PagosManagement from './components/PagosManagement';
import RecursosDigitalesSection from './components/RecursosDigitalesSection';
import RecursosDigitalesManagement from './components/RecursosDigitalesManagement';
import FechasImportantesSection from './components/FechasImportantesSection';
import FechasImportantesManagement from './components/FechasImportantesManagement';
import AnnouncementPopup from './components/AnnouncementPopup';
import AnnouncementInfoSection from './components/AnnouncementInfoSection';
import AnnouncementManagement from './components/AnnouncementManagement';
import LogoManagement from './components/LogoManagement';
import StorageOptimizer from './components/StorageOptimizer';
import MapSection from './components/MapSection';
import Footer from './components/Footer';
import ColegioInfoSection from './components/ColegioInfoSection';
import QuienesSomosSection from './components/QuienesSomosSection';
import PlanLectorSection from './components/PlanLectorSection';
import PlanLectorManagement from './components/PlanLectorManagement';
import DirectorioFundacionManagement from './components/DirectorioFundacionManagement';
import RectoriaSection from './components/RectoriaSection';
import ProyectoEducativoDocumento from './components/ProyectoEducativoDocumento';
import ProyectoEducativoDocumentoManagement from './components/ProyectoEducativoDocumentoManagement';
import ConsejoDirectivo from './components/ConsejoDirectivo';
import ConsejoDirectivoManagement from './components/ConsejoDirectivoManagement';
import ValoresSection from './components/ValoresSection';
import ValoresManagement from './components/ValoresManagement';
import AdmisionKinderIISection from './components/AdmisionKinderIISection';
import CalendarioCicloSection from './components/CalendarioCicloSection';
import AprendizajeCooperativoSection from './components/AprendizajeCooperativoSection';
import { getHomeHeroBaseImages, getHomeHeroUrl, HOME_HERO_DEFAULT_IMAGES, HOME_HERO_UPDATED_EVENT } from './lib/siteHero';

const PAGE_PATHS: Record<string, string> = {
  home: '/inicio',
  historia: '/historia',
  'historia-congregacion': '/historiacongregacion',
  'historia-colegio': '/historiacolegio',
  'vision-mision': '/visionmision',
  acles: '/acles',
  'departamento-orientacion': '/departamentoorientacion',
  'vicerrectoria-formacion': '/vicerrectoriaformacion',
  'tour-virtual': '/tour-virtual',
  'documentos-institucionales': '/documentosinstitucionales',
  ceal: '/ceal',
  'pastoral-juvenil': '/pastoraljuvenil',
  comunidad: '/comunidad',
  'cultura-pensamiento': '/culturapensamiento',
  rectoria: '/rectoria',
  'fundacion-pentecostes': '/fundacionpentecostes',
  'directorio-fundacion': '/directoriofundacion',
  admision: '/admision',
  'admision-prekinder': '/admision-prekinder',
  biblioteca: '/biblioteca',
  'utiles-escolares': '/utilesescolares',
  'uniformes-escolares': '/uniformesescolares',
  horarios: '/horarios',
  pagos: '/pagos',
  'recursos-digitales': '/recursosdigitales',
  'fechas-importantes': '/fechasimportantes',
  'proyecto-educativo': '/proyectoeducativo',
  'proyecto-educativo-equipo': '/proyectoeducativo-equipo',
  'consejo-directivo': '/consejodirectivo',
  valores: '/valores',
  'plan-lector': '/planlector',
  'student-withdrawal': '/retiroestudiantes',
  'admision-kinder-ii': '/admision-kinder-ii',
  'calendario-primer-ciclo': '/calendario-primer-ciclo',
  'calendario-segundo-ciclo': '/calendario-segundo-ciclo',
  'calendario-tercer-ciclo': '/calendario-tercer-ciclo',
  admin: '/admin',
  'institutional-documents-management': '/admin/documentos-institucionales',
  'ceal-management': '/admin/ceal',
  'pastoral-management': '/admin/pastoral',
  'comunidad-management': '/admin/comunidad',
  'admision-management': '/admin/admision',
  'biblioteca-management': '/admin/biblioteca',
  'utiles-escolares-management': '/admin/utiles-escolares',
  'casino-management': '/admin/casino',
  'uniformes-escolares-management': '/admin/uniformes-escolares',
  'horarios-management': '/admin/horarios',
  'pagos-management': '/admin/pagos',
  'recursos-digitales-management': '/admin/recursos-digitales',
  'fechas-importantes-management': '/admin/fechas-importantes',
  'valores-management': '/admin/valores',
  'announcement-management': '/admin/anuncios',
  'logo-management': '/admin/logo',
  'storage-optimizer': '/admin/storage-optimizer',
  'departamento-orientacion-management': '/admin/departamento-orientacion',
  'news-management': '/admin/noticias',
  'directory-management': '/admin/directorio',
  'directorio-fundacion-management': '/admin/directorio-fundacion',
  'consejo-directivo-management': '/admin/consejo-directivo',
  'proyecto-educativo-management': '/admin/proyecto-educativo',
  'plan-lector-management': '/admin/plan-lector',
  'proyecto-educativo-documento-management': '/admin/proyecto-educativo-documento',
};

function normalizePathname(pathname: string) {
  let normalizedPathname = pathname;

  try {
    normalizedPathname = decodeURI(pathname);
  } catch {
    normalizedPathname = pathname;
  }

  normalizedPathname = normalizedPathname.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (normalizedPathname.length > 1 && normalizedPathname.endsWith('/')) {
    return normalizedPathname.slice(0, -1);
  }

  return normalizedPathname || '/';
}

function getPageFromPathname(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === '/' || normalizedPathname === '/inicio') {
    return 'home';
  }

  if (normalizedPathname.startsWith('/documentosinstitucionales/') || normalizedPathname.startsWith('/documentos/')) {
    return 'documentos-institucionales';
  }

  const entry = Object.entries(PAGE_PATHS).find(([, routePath]) => routePath === normalizedPathname);
  return entry?.[0] ?? 'home';
}

function getPathForPage(page: string) {
  return PAGE_PATHS[page] ?? '/inicio';
}

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [backgroundImages, setBackgroundImages] = useState<string[]>(HOME_HERO_DEFAULT_IMAGES);
  const [currentPage, setCurrentPage] = useState(() => getPageFromPathname(window.location.pathname));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showCasinoModal, setShowCasinoModal] = useState(false);

  useEffect(() => {
    const loadHomeHeroImage = async () => {
      try {
        const baseImages = await getHomeHeroBaseImages();
        const homeHeroUrl = await getHomeHeroUrl();

        if (!homeHeroUrl) {
          setBackgroundImages(baseImages);
          return;
        }

        setBackgroundImages([homeHeroUrl, ...baseImages]);
      } catch (error) {
        console.error('Error loading home hero image:', error);
        setBackgroundImages(HOME_HERO_DEFAULT_IMAGES);
      }
    };

    const onHeroUpdated = () => {
      void loadHomeHeroImage();
    };

    void loadHomeHeroImage();
    window.addEventListener(HOME_HERO_UPDATED_EVENT, onHeroUpdated);

    return () => {
      window.removeEventListener(HOME_HERO_UPDATED_EVENT, onHeroUpdated);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  useEffect(() => {
    const currentPath = normalizePathname(window.location.pathname);
    const canonicalPath = getPathForPage(currentPage);

    if (
      currentPage === 'documentos-institucionales' &&
      (currentPath.startsWith('/documentosinstitucionales/') || currentPath.startsWith('/documentos/'))
    ) {
      return;
    }

    if (currentPath !== canonicalPath) {
      window.history.replaceState({}, '', canonicalPath);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromPathname(window.location.pathname));
      setShowCasinoModal(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handlePageChange = (page: string) => {
    if (page === 'casino') {
      setShowCasinoModal(true);
    } else {
      const nextPath = getPathForPage(page);
      const currentPath = normalizePathname(window.location.pathname);

      if (currentPath !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }

      setCurrentPage(page);
      setShowCasinoModal(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  };

  useEffect(() => {
    (window as any).navigateTo = handlePageChange;

    return () => {
      delete (window as any).navigateTo;
    };
  }, [handlePageChange]);

  const handleBackToHome = () => {
    handlePageChange('home');
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    handlePageChange('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    handlePageChange('home');
  };

  const handleBackToAdmin = () => {
    handlePageChange('admin');
  };

  if (currentPage === 'historia') {
    return <Historia onBack={handleBackToHome} />;
  }

  if (currentPage === 'historia-congregacion') {
    return <HistoriaCongregacion onBack={handleBackToHome} />;
  }

  if (currentPage === 'historia-colegio') {
    return <HistoriaColegio onBack={handleBackToHome} />;
  }

  if (currentPage === 'vision-mision') {
    return <VisionMision onBack={handleBackToHome} />;
  }

  if (currentPage === 'acles') {
    return <ACLESSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'departamento-orientacion') {
    return <DepartamentoOrientacionSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'vicerrectoria-formacion') {
    return <VicerretoriaFormacionSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'tour-virtual') {
    return <Tour360Section onBack={handleBackToHome} />;
  }

  if (currentPage === 'documentos-institucionales') {
    return <InstitutionalDocuments onBack={handleBackToHome} />;
  }

  if (currentPage === 'ceal') {
    return <CEALSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'pastoral-juvenil') {
    return <PastoralJuvenilSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'comunidad') {
    return <ComunidadSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'cultura-pensamiento') {
    return <CulturaPensamientoSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'rectoria') {
    return <RectoriaSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'aprendizaje-cooperativo') {
    return <AprendizajeCooperativoSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'institutional-documents-management') {
    return <InstitutionalDocumentsManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'ceal-management') {
    return <CEALManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'pastoral-management') {
    return <PastoralManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'comunidad-management') {
    return <ComunidadManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'fundacion-pentecostes') {
    return <FundacionPentecostes onBack={handleBackToHome} />;
  }

  if (currentPage === 'directorio-fundacion') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-100">
        {/* Header with back button */}
        <div className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={handleBackToHome}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al inicio
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Directorio Fundación</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <DirectorioFundacion />
        </div>
      </div>
    );
  }

  if (currentPage === 'consejo-directivo') {
    return <ConsejoDirectivo onBack={handleBackToHome} />;
  }

  if (currentPage === 'admision' || currentPage === 'admision-prekinder') {
    return <AdmisionSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'biblioteca') {
    return <BibliotecaSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'utiles-escolares') {
    return <UtilesEscolaresSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'uniformes-escolares') {
    return <UniformesEscolaresSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'horarios') {
    return <HorariosSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'pagos') {
    return <PagosSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'valores') {
    return <ValoresSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'recursos-digitales') {
    return <RecursosDigitalesSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'fechas-importantes') {
    return <FechasImportantesSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'admision-management') {
    return <AdmisionManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'biblioteca-management') {
    return <BibliotecaManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'utiles-escolares-management') {
    return <UtilesEscolaresManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'casino-management') {
    return <CasinoManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'uniformes-escolares-management') {
    return <UniformesEscolaresManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'horarios-management') {
    return <HorariosManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'pagos-management') {
    return <PagosManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'recursos-digitales-management') {
    return <RecursosDigitalesManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'fechas-importantes-management') {
    return <FechasImportantesManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'valores-management') {
    return <ValoresManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'announcement-management') {
    return <AnnouncementManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'logo-management') {
    return <LogoManagement onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'storage-optimizer') {
    return <StorageOptimizer onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'departamento-orientacion-management') {
    return <DepartamentoOrientacionManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'news-management') {
    return <NewsManagement onBack={handleBackToAdmin} />;
  }


  if (currentPage === 'directory-management') {
    return <DirectoryManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'directorio-fundacion-management') {
    return <DirectorioFundacionManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'consejo-directivo-management') {
    return <ConsejoDirectivoManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'proyecto-educativo') {
    return <ProyectoEducativoDocumento onBack={handleBackToHome} />;
  }

  if (currentPage === 'proyecto-educativo-equipo') {
    return <ProyectoEducativo onBack={handleBackToHome} />;
  }

  if (currentPage === 'plan-lector') {
    return <PlanLectorSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'plan-lector-management') {
    return <PlanLectorManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'proyecto-educativo-management') {
    return <ProyectoEducativoDocumentoManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'admin') {
    if (!isAdminAuthenticated) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    return <AdminDashboard onNavigate={handlePageChange} onLogout={handleAdminLogout} />;
  }

  if (currentPage === 'student-withdrawal') {
    return <StudentWithdrawalControl onBack={handleBackToHome} />;
  }

  if (currentPage === 'admision-kinder-ii') {
    return <AdmisionKinderIISection />;
  }

  if (currentPage === 'calendario-primer-ciclo') {
    return <CalendarioCicloSection ciclo="primer" onBack={handleBackToHome} />;
  }
  if (currentPage === 'calendario-segundo-ciclo') {
    return <CalendarioCicloSection ciclo="segundo" onBack={handleBackToHome} />;
  }
  if (currentPage === 'calendario-tercer-ciclo') {
    return <CalendarioCicloSection ciclo="tercer" onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Announcement Popup */}
      <AnnouncementPopup />
      
      {/* Navigation - Fixed at top */}
      <Navbar onPageChange={handlePageChange} />

      {/* Hero Section with Background */}
      <div className="relative min-h-screen overflow-hidden">
      {/* Background Images with Slideshow */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1500 ease-in-out ${
              index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          >
            {/* Overlay negro solo para la tercera imagen */}
            {index === 2 && (
              <div className="absolute inset-0 bg-black/40" />
            )}
          </div>
        ))}
        
        {/* Light Overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen pt-24 pb-20">
        {/* Hero Section */}
        <main className="px-8 md:px-12 lg:px-16">
          <div className="text-left max-w-4xl">
            <h1 className="text-white text-xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight tracking-wide drop-shadow-lg">
              ¿POR QUÉ ELEGIR<br />SAGRADOS CORAZONES<br />DE MANQUEHUE?
            </h1>
            
            <p className="text-white text-xs md:text-sm lg:text-base mb-6 leading-relaxed font-medium max-w-2xl drop-shadow-md">
              FORMACIÓN INTEGRAL – ESPIRITUALIDAD SSCC
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => handlePageChange('historia-colegio')}
                className="hidden sm:inline-flex group relative items-center justify-center px-8 py-3 text-sm font-bold text-white bg-transparent border-2 border-white rounded-none overflow-hidden transition-all duration-300 hover:bg-white hover:text-gray-800 drop-shadow-lg uppercase tracking-wide"
              >
                <span className="relative z-10 flex items-center">
                  VER MÁS
                </span>
              </button>

              <AnnouncementInfoSection />
              
              <button
                onClick={() => {
                  const newsSection = document.getElementById('news-section');
                  if (newsSection) {
                    newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white bg-transparent border-2 border-white rounded-none overflow-hidden transition-all duration-300 hover:bg-white hover:text-gray-800 drop-shadow-lg uppercase tracking-wide"
              >
                <span className="relative z-10 flex items-center">
                  NOTICIAS
                </span>
              </button>
            </div>
          </div>
        </main>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
      </div>


      {/* Sección ¿Por qué elegir Sagrados Corazones de Manquehue? */}
      <ColegioInfoSection />

      {/* Quiénes Somos Section */}
      <QuienesSomosSection />

      {/* News Section */}
      <NewsSection />

      {/* Editorial Section removed */}

      {/* 360 Tour Section */}
      <div id="tour-virtual-section">
        <Tour360Section />
      </div>

      {/* Map Section */}
      <MapSection />

      {/* Footer */}
      <Footer />

      {/* Casino Modal */}
      <CasinoModal isOpen={showCasinoModal} onClose={() => setShowCasinoModal(false)} />
    </div>

  );
}

export default App;