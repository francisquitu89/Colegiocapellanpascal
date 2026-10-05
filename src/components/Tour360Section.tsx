import React from 'react';
import { Camera, Eye, Navigation, ExternalLink, ArrowLeft } from 'lucide-react';

interface Tour360SectionProps {
  onBack?: () => void;
}

const Tour360Section: React.FC<Tour360SectionProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button - only show if onBack is provided */}
      {onBack && (
        <div className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={onBack}
              className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </button>
          </div>
        </div>
      )}

    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 font-medium mb-4" style={{color: '#2563EB'}}>
            <div className="w-8 h-0.5" style={{backgroundColor: '#2563EB'}}></div>
            <span>Experiencia Virtual</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{color: '#1e3a8a'}}>
            Tour Virtual 360°
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Explora nuestras instalaciones desde la comodidad de tu hogar. 
            Recorre cada rincón del colegio con nuestra experiencia inmersiva en 360°.
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Vista 360°</h3>
            <p className="text-gray-600 text-sm">
              Tecnología de última generación para una experiencia inmersiva completa
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Navegación Intuitiva</h3>
            <p className="text-gray-600 text-sm">
              Muévete libremente por todas las instalaciones con controles fáciles de usar
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Experiencia Realista</h3>
            <p className="text-gray-600 text-sm">
              Siente como si estuvieras realmente caminando por nuestro colegio
            </p>
          </div>
        </div>

        {/* Main Tour Container */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 bg-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Tour Virtual Colegio Sagrados Corazones de Manquehue</h3>
                <p className="text-blue-100">
                  Explora nuestras aulas, laboratorios, biblioteca, capilla y espacios recreativos
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Camera className="w-8 h-8 text-blue-200" />
                <span className="text-blue-200 font-medium">360°</span>
              </div>
            </div>
          </div>

          {/* Tour Iframe */}
          <div className="relative" style={{ height: '600px' }}>
            <iframe
              src="https://tours.tourify.cl/tours/sR3QULqXd"
              title="Tour Virtual 360° - Colegio Sagrada Familia"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; vr"
              allowFullScreen
              loading="lazy"
            />
          </div>

          {/* Footer Info */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="flex items-center space-x-2 text-sm" style={{color: '#2563EB'}}>
                  <Camera className="w-4 h-4" />
                  <span>Tour Interactivo 360°</span>
                </div>
                <div className="flex items-center space-x-2 text-sm" style={{color: '#2563EB'}}>
                  <Navigation className="w-4 h-4" />
                  <span>Navegación Libre</span>
                </div>
                <div className="flex items-center space-x-2 text-sm" style={{color: '#2563EB'}}>
                  <Eye className="w-4 h-4" />
                  <span>Alta Resolución</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="https://tours.tourify.cl/tours/sR3QULqXd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir en Pantalla Completa</span>
                </a>
                <div className="text-gray-500 text-xs">
                  Powered by Tourify.cl
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">Cómo usar el Tour Virtual</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-blue-800 mb-2">Navegación:</h5>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Haz clic y arrastra para mirar alrededor</li>
                <li>• Usa las flechas para moverte entre espacios</li>
                <li>• Haz clic en los puntos de interés para más información</li>
                <li>• Usa la rueda del mouse para hacer zoom</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-800 mb-2">Espacios Disponibles:</h5>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Aulas y laboratorios</li>
                <li>• Biblioteca y salas de estudio</li>
                <li>• Capilla y espacios de reflexión</li>
                <li>• Áreas recreativas y deportivas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Tour360Section;