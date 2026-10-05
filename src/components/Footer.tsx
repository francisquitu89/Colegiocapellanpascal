import React, { useState, useEffect } from 'react';
import { getSiteLogoUrl } from '../lib/siteLogo';

const Footer: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string>('https://ssccmanquehue.cl/wp-content/uploads/2025/03/70SSCC_OK_transparente-4-1-1-1.png');
  
  useEffect(() => {
    void loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const logoUrl = await getSiteLogoUrl();

      if (logoUrl) {
        setLogoUrl(logoUrl);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const goAdmin = () => {
    const nav = (window as any).navigateTo;
    if (typeof nav === 'function') {
      nav('admin');
    }
  };

  return (
  <footer className="bg-blue-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="flex flex-col items-center space-y-8">
        <div className="flex items-center justify-center space-x-8 flex-wrap">
          <div className="flex items-center">
            <img
              src={logoUrl}
              alt="Colegio Manquehue SSCC Logo"
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-blue-200 text-sm md:text-base font-medium">
            Colegio Manquehue SSCC | Copyright ® 1999 - 2025 | Política de Privacidad
          </p>
        </div>

        <div className="text-center text-blue-100 text-sm mt-2">
          <p>Padre Damián de Veuster 2151</p>
          <p className="mt-1">Vitacura, Región Metropolitana</p>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-red-700">
        <div className="flex items-center justify-between">
          <div className="text-red-200 text-xs text-center w-full">
            <p>Sitio web desarrollado por Tourify.cl</p>
          </div>
          <div className="text-right w-full">
            <button
              aria-label="Admin"
              onClick={goAdmin}
              className="inline-block text-white/60 hover:text-white text-xs px-3 py-1 border border-white/30 hover:border-white rounded transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;