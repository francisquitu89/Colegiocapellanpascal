import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, ArrowLeft, GraduationCap } from 'lucide-react';
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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
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
    if (email.trim().toLowerCase() === 'admin@capellanpascal.cl' && password === 'admin123') {
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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-amber-100 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-r from-sky-600 via-white to-red-600" />
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-sky-800 hover:text-red-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-sky-100 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo Colegio Capellán Pascal" className="h-16 w-16 object-contain" />
            ) : (
              <GraduationCap className="w-12 h-12 text-sky-700" aria-hidden="true" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-sky-950 mb-2">
            Acceso Administración
          </h1>
          <p className="text-slate-600">
            Colegio Capellán Pascal · Dios, Patria y Familia
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-sky-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-sky-950 mb-2">
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
                  className="block w-full pl-10 pr-3 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                  placeholder="admin@capellanpascal.cl"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-sky-950 mb-2">
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
                  className="block w-full pl-10 pr-12 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-700 to-blue-800 text-white py-3 px-4 rounded-lg font-semibold hover:from-sky-800 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
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
        <div className="text-center mt-8 text-slate-600 text-sm">
          <p>© Colegio Capellán Pascal</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;