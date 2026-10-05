import React, { useState, useEffect } from 'react';
import { FileText, Users, ArrowLeft, LogOut, BookOpen, FolderOpen, UserCheck, Heart, Library, ShoppingBag, UtensilsCrossed, Shirt, Clock, CreditCard, Monitor, Calendar, Bell, Users2, Image, HardDrive } from 'lucide-react';
import { getSiteLogoUrl } from '../lib/siteLogo';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
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

  const adminOptions = [
    {
      id: 'news-management',
      title: 'Gestión de Noticias',
      description: 'Crear, editar y administrar las noticias del colegio',
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'directorio-fundacion-management',
      title: 'Gestión Directorio Fundación',
      description: 'Editar la sección Directorio Fundación (imagen, texto, nombres)',
      icon: <Library className="w-8 h-8" />,
      color: 'bg-emerald-600 hover:bg-emerald-700',
      iconBg: 'bg-emerald-100 text-emerald-600'
    },
    {
      id: 'consejo-directivo-management',
      title: 'Gestión Consejo Directivo',
      description: 'Editar la sección Consejo Directivo (imagen, texto, nombres)',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'proyecto-educativo-management',
      title: 'Gestión Proyecto Educativo',
      description: 'Subir/actualizar el documento PDF del proyecto educativo',
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-orange-600 hover:bg-orange-700',
      iconBg: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'institutional-documents-management',
      title: 'Gestión de Documentos Institucionales',
      description: 'Administrar documentos oficiales del colegio',
      icon: <FolderOpen className="w-8 h-8" />,
      color: 'bg-red-600 hover:bg-red-700',
      iconBg: 'bg-red-100 text-red-600'
    },
    {
      id: 'valores-management',
      title: 'Gestión de Valores',
      description: 'Administrar matrícula y colegiaturas 2026',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'bg-emerald-600 hover:bg-emerald-700',
      iconBg: 'bg-emerald-100 text-emerald-600'
    },
    {
      id: 'announcement-management',
      title: 'Anuncio Popup',
      description: 'Gestionar anuncio emergente para usuarios',
      icon: <Bell className="w-8 h-8" />,
      color: 'bg-red-600 hover:bg-red-700',
      iconBg: 'bg-red-100 text-red-600'
    },
    {
      id: 'comunidad-management',
      title: 'Gestión de Comunidad',
      description: 'Administrar los 5 bloques de comunidad con carruseles e integrantes',
      icon: <Users2 className="w-8 h-8" />,
      color: 'bg-purple-600 hover:bg-purple-700',
      iconBg: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'logo-management',
      title: 'Gestión del Logo',
      description: 'Subir y administrar el logo principal del sitio',
      icon: <Image className="w-8 h-8" />,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      iconBg: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 'storage-optimizer',
      title: '🔧 Optimizador de Storage',
      description: 'Optimizar archivos antiguos y configurar caché para reducir costos de tráfico',
      icon: <HardDrive className="w-8 h-8" />,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      iconBg: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2540] to-[#08304a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-blue-200 hover:text-white transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </button>

        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img src={logoUrl} alt="SSCC Manquehue" className="h-16 w-16 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Panel de Administración
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Gestiona el contenido del sitio web del SSCC Manquehue
          </p>
          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="absolute top-0 right-0 flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>

        {/* Admin Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {adminOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => onNavigate(option.id)}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-blue-100"
            >
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${option.iconBg}`}>
                    {option.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-blue-900 text-center mb-4">
                  {option.title}
                </h3>
                
                <p className="text-blue-800 text-center mb-6">
                  {option.description}
                </p>
                
                <button
                  className={`w-full text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${option.color}`}
                >
                  Acceder
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">Gestión Integral</h4>
            <p className="text-blue-800 text-sm">
              Administra todo el contenido desde un solo lugar
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">Fácil de Usar</h4>
            <p className="text-blue-800 text-sm">
              Interface intuitiva y amigable para todos los usuarios
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">Contenido Rico</h4>
            <p className="text-blue-800 text-sm">
              Soporte para imágenes, videos y texto formateado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;