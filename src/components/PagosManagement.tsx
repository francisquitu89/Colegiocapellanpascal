import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Link as LinkIcon } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';

interface PagosManagementProps {
  onBack: () => void;
}

interface PagosInfo {
  id?: number;
  payment_link: string;
}

const PagosManagement: React.FC<PagosManagementProps> = ({ onBack }) => {
  const [pagosInfo, setPagosInfo] = useState<PagosInfo>({ payment_link: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPagosInfo();
  }, []);

  const fetchPagosInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await driveRoutesSupabase
        .from('pagos_info')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setPagosInfo(data);
    } catch (error) {
      console.error('Error fetching pagos info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!pagosInfo.payment_link.trim()) {
      setMessage('Por favor ingresa un link válido');
      return;
    }

    setLoading(true);
    try {
      if (pagosInfo.id) {
        // Update existing
        const { error } = await driveRoutesSupabase
          .from('pagos_info')
          .upsert({ payment_link: pagosInfo.payment_link })
          .eq('id', pagosInfo.id);

        if (error) throw error;
        setMessage('Link actualizado exitosamente');
      } else {
        // Insert new
        const { error } = await driveRoutesSupabase
          .from('pagos_info')
          .insert([{ payment_link: pagosInfo.payment_link }]);

        if (error) throw error;
        setMessage('Link guardado exitosamente');
      }
      
      fetchPagosInfo();
    } catch (error) {
      console.error('Error saving pagos info:', error);
      setMessage('Error al guardar el link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al panel de administración
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Pagos</h1>
          <p className="text-gray-600">Configura el link de redirección para la plataforma de pagos</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Link de Plataforma de Pagos</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de la Plataforma de Pagos
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={pagosInfo.payment_link}
                  onChange={(e) => setPagosInfo({ ...pagosInfo, payment_link: e.target.value })}
                  placeholder="https://ejemplo.com/pagos"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Ingresa el link completo de la plataforma de pagos (debe comenzar con https://)
              </p>
            </div>

            {pagosInfo.payment_link && (
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Vista previa del link:</strong>
                </p>
                <a
                  href={pagosInfo.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline break-all"
                >
                  {pagosInfo.payment_link}
                </a>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Guardando...' : 'Guardar Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📋 Instrucciones</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex items-start">
              <span className="text-yellow-600 font-bold mr-2">1.</span>
              <span>Copia el link completo de la plataforma de pagos del colegio</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 font-bold mr-2">2.</span>
              <span>Pégalo en el campo de arriba (asegúrate de incluir https://)</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 font-bold mr-2">3.</span>
              <span>Haz clic en "Guardar Link" para actualizar</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 font-bold mr-2">4.</span>
              <span>Los usuarios serán redirigidos a este link cuando hagan clic en "Pagos"</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PagosManagement;
