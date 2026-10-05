import React from 'react';

const MapSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 font-medium mb-4" style={{color: '#2563EB'}}>
            <div className="w-8 h-0.5" style={{backgroundColor: '#2563EB'}}></div>
            <span>Ubicación</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
            Visítanos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estamos ubicados en Padre Damián de Veuster 2151, Vitacura, Región Metropolitana, 
            en un ambiente natural que favorece el aprendizaje y la formación integral.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="text-left">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Vista Fachada</h3>
            <p className="text-gray-600 max-w-xl mb-6">
              Fachada principal del colegio. Explora la entrada con Street View.
            </p>

            <div className="mx-auto max-w-4xl rounded-lg overflow-hidden shadow-lg">
              <div className="relative" style={{ paddingTop: '60%' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!4v1759096045152!6m8!1m7!1sZHZJ1tAt_3DzDavSVMnIjA!2m2!1d-33.37954734574453!2d-70.55154355390484!3f67.47583125443603!4f4.631081243600818!5f0.7820865974627469"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vista Fachada - Street View"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="text-left">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Vista Satelital</h3>
            <p className="text-gray-600 max-w-xl mb-4">
              Vista aérea para ubicar el terreno y accesos desde el aire.
            </p>
            <div className="mx-auto max-w-4xl rounded-lg overflow-hidden shadow-lg">
              <div className="relative" style={{ paddingTop: '60%' }}>
                <iframe
                  src="https://maps.google.com/maps?q=-33.37954734574453,-70.55154355390484&z=18&output=embed&t=k"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vista Satelital"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;