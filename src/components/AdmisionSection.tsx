import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface AdmisionSectionProps {
  onBack: () => void;
}

const AdmisionSection: React.FC<AdmisionSectionProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <button
            onClick={onBack}
            className="flex items-center text-white hover:text-blue-200 transition-all duration-300 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver
          </button>
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">Admisión</h1>
          <p className="text-xl text-blue-100 max-w-3xl animate-fade-in-delay">
            Conoce nuestro proceso de admisión y forma parte de la familia Manquehuina
          </p>
        </div>
      </div>

      {/* Admisión Pre Kínder Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            Proceso cerrado hasta nuevo aviso
          </h2>
          
          {/* Imagen decorativa */}
          <div className="mb-8 flex justify-center">
            <img 
              src="https://i.postimg.cc/zXjYBLqJ/ninps.jpg" 
              alt="Niños del colegio" 
              className="rounded-xl shadow-lg max-w-full h-auto"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdmisionSection;
