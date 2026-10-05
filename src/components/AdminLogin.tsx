import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { getSiteLogoUrl } from '../lib/siteLogo';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleBack = () => {
    window.location.href = '/';
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple authentication check
    if (email === 'admin@ssccmanquehue.cl' && password === 'admin123') {
      setTimeout(() => {
        onLogin();
        setLoading(false);
      }, 1000); // Simulate loading
    } else {
      setTimeout(() => {
        setError('Credenciales incorrectas. Verifique su email y contraseña.');
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2540] to-[#08304a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-blue-200 hover:text-white transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img src={logoUrl} alt="SSCC Manquehue" className="h-16 w-16 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-blue-100">
            SSCC Manquehue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  placeholder="admin@ssccmanquehue.cl"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-100 text-sm">
          <p>© 2025 SSCC Manquehue. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;