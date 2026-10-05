import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, ExternalLink, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PagosInfo {
  id: number;
  payment_link: string;
  updated_at: string;
}

interface PagosSectionProps {
  onBack: () => void;
}

const PagosSection: React.FC<PagosSectionProps> = ({ onBack }) => {
  const [pagosInfo, setPagosInfo] = useState<PagosInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPagosInfo();
  }, []);

  const fetchPagosInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pagos_info')
        .select('*')
        .single();

      if (error) throw error;
      if (data) setPagosInfo(data);
    } catch (error) {
      console.error('Error fetching pagos info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    if (pagosInfo?.payment_link) {
      window.open(pagosInfo.payment_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Botón Volver */}
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </button>

        {/* Encabezado */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <CreditCard className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Pagos en Línea
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Realiza tus pagos de manera segura y conveniente
          </p>
        </div>

        {/* Contenido Principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Cargando información de pagos...</p>
          </div>
        ) : pagosInfo?.payment_link ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500">
            <div className="text-center space-y-8">
              {/* Información */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Plataforma de Pagos
                </h2>
                <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  Accede a nuestra plataforma de pagos en línea para realizar tus transacciones 
                  de manera segura. Podrás pagar matrículas, mensualidades y otros servicios del colegio.
                </p>
              </div>

              {/* Botón de Redirección */}
              <button
                onClick={handleRedirect}
                className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <CreditCard className="w-6 h-6" />
                  <span>Ir a Plataforma de Pagos</span>
                  <ExternalLink className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Información Adicional */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Información Importante
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Seguridad:</strong> Todos los pagos se procesan a través de plataformas seguras y certificadas.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Métodos de Pago:</strong> Se aceptan tarjetas de crédito, débito y transferencias bancarias.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Comprobantes:</strong> Recibirás un comprobante de pago por correo electrónico.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Consultas:</strong> Para cualquier duda, contacta a administración del colegio.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              La plataforma de pagos no está disponible en este momento.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Por favor, contacta a administración para más información.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagosSection;
