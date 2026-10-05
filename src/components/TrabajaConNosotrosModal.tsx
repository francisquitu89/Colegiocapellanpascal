import React from 'react';
import { X, Briefcase, Mail } from 'lucide-react';

interface TrabajaConNosotrosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrabajaConNosotrosModal: React.FC<TrabajaConNosotrosModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Trabaja con Nosotros</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Únete a Nuestro Equipo
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Si deseas integrarte a nuestra comunidad interna y ser parte del <strong>Colegio Sagrada Familia de Reñaca</strong>, 
                    te invitamos a enviarnos tu Currículum Vitae actualizado con el propósito de incorporarte en nuestros 
                    continuos procesos de selección.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="w-6 h-6 text-red-600" />
                  <h4 className="text-lg font-bold text-gray-900">Envía tu CV a:</h4>
                </div>
                <a
                  href="mailto:postulaciones@csfr.cl"
                  className="text-2xl font-bold text-red-600 hover:text-red-700 hover:underline transition-colors block"
                >
                  postulaciones@csfr.cl
                </a>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Nota:</strong> Todos los currículums recibidos serán evaluados y considerados para 
                  futuras vacantes según las necesidades del colegio.
                </p>
              </div>
            </div>

            {/* Footer Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrabajaConNosotrosModal;
