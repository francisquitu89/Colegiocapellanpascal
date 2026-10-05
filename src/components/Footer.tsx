import React, { useState, useEffect } from 'react';
import { getSiteLogoUrl } from '../lib/siteLogo';

const Footer: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string>('');
  
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
  <footer className="relative overflow-hidden bg-[#f8fafc] py-12 text-[#003b71] border-t-4 border-[#f2c500]">
    <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#003b71_0%,#003b71_33%,#f2c500_33%,#f2c500_66%,#003b71_66%,#003b71_100%)]" aria-hidden="true" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="flex flex-col items-center space-y-8">
        <div className="flex items-center justify-center space-x-8 flex-wrap">
          <div className="flex items-center">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Colegio Capellán Pascal logo"
                className="h-24 w-auto object-contain"
              />
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-[#003b71] text-sm md:text-base font-semibold">
            Colegio Capellán Pascal | Copyright ® 1992 - 2026 | Política de Privacidad
          </p>
        </div>

        <div className="text-center text-[#49627b] text-sm mt-2">
          <p>Guardiamarina Riquelme s/n, Población Allard, Las Salinas, Viña del Mar</p>
          <p className="mt-1">+56 32 2546520 · contactoweb@capellanpascal.cl</p>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-[#003b71]/15">
        <div className="flex items-center justify-between">
          <div className="text-[#49627b] text-xs text-center w-full">
            <p>Sitio web desarrollado por Tourify.cl</p>
          </div>
          <div className="text-right w-full">
            <button
              aria-label="Admin"
              onClick={goAdmin}
              className="inline-block text-[#003b71]/60 hover:text-[#003b71] text-xs px-3 py-1 border border-[#003b71]/30 hover:border-[#003b71] rounded transition-colors"
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