import React, { useState, useEffect } from 'react';
import { FileText, Users, ArrowLeft, LogOut, BookOpen, FolderOpen, Library, CreditCard, Bell, Users2, Image, GraduationCap, ShieldCheck, CalendarDays } from 'lucide-react';
import { getSiteLogoUrl } from '../lib/siteLogo';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
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

  const adminOptions = [
    {
      id: 'news-management',
      title: 'Gestión de Noticias',
      description: 'Publica novedades, actividades y noticias de la comunidad educativa.',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-sky-500 to-blue-700',
      iconBg: 'bg-sky-100 text-sky-700',
      enabled: true
    },
    {
      id: 'directorio-fundacion-management',
      title: 'Fundación Educacional',
      description: 'Herramientas para la gestión de la fundación.',
      icon: <Library className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-700',
      iconBg: 'bg-emerald-100 text-emerald-700',
      enabled: false
    },
    {
      id: 'consejo-directivo-management',
      title: 'Consejo Directivo',
      description: 'Información del equipo directivo del colegio.',
      icon: <Users className="w-8 h-8" />,
      color: 'from-violet-500 to-purple-700',
      iconBg: 'bg-violet-100 text-violet-700',
      enabled: false
    },
    {
      id: 'proyecto-educativo-management',
      title: 'Proyecto Educativo',
      description: 'Documentos y lineamientos formativos del Capellán Pascal.',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-amber-500 to-orange-700',
      iconBg: 'bg-amber-100 text-amber-700',
      enabled: false
    },
    {
      id: 'institutional-documents-management',
      title: 'Documentos Institucionales',
      description: 'Material oficial y documentos de la comunidad escolar.',
      icon: <FolderOpen className="w-8 h-8" />,
      color: 'from-rose-500 to-red-700',
      iconBg: 'bg-rose-100 text-rose-700',
      enabled: false
    },
    {
      id: 'valores-management',
      title: 'Aranceles y Matrículas',
      description: 'Información de matrícula y colegiaturas del colegio.',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'from-cyan-500 to-teal-700',
      iconBg: 'bg-cyan-100 text-cyan-700',
      enabled: false
    },
    {
      id: 'announcement-management',
      title: 'Avisos del Colegio',
      description: 'Anuncios importantes para las familias y estudiantes.',
      icon: <Bell className="w-8 h-8" />,
      color: 'from-pink-500 to-rose-700',
      iconBg: 'bg-pink-100 text-pink-700',
      enabled: false
    },
    {
      id: 'comunidad-management',
      title: 'Comunidad Educativa',
      description: 'Espacios para apoderados, estudiantes y equipos del colegio.',
      icon: <Users2 className="w-8 h-8" />,
      color: 'from-indigo-500 to-blue-800',
      iconBg: 'bg-indigo-100 text-indigo-700',
      enabled: false
    },
    {
      id: 'logo-management',
      title: 'Gestión del Logo',
      description: 'Actualiza la identidad visual del Colegio Capellán Pascal.',
      icon: <Image className="w-8 h-8" />,
      color: 'from-red-600 to-rose-800',
      iconBg: 'bg-red-100 text-red-700',
      enabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-sky-800 hover:text-red-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </button>

        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-sky-100 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo Colegio Capellán Pascal" className="h-16 w-16 object-contain" />
            ) : (
              <GraduationCap className="w-11 h-11 text-sky-700" aria-hidden="true" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-sky-950 mb-3">
            Portal de Gestión Escolar
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Colegio Capellán Pascal <span className="text-red-700 font-semibold">· Dios, Patria y Familia</span>
          </p>
          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="absolute top-0 right-0 flex items-center space-x-2 text-sky-800 hover:text-red-700 transition-colors duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>

        {/* Admin Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {adminOptions.map((option) => (
            <div
              key={option.id}
              className={`relative bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 transition-all duration-300 ${
                option.enabled ? 'hover:shadow-xl hover:-translate-y-1' : 'opacity-70'
              }`}
            >
              <div className={`h-2 bg-gradient-to-r ${option.color}`} />
              <div className="p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${option.iconBg}`}>
                    {option.icon}
                  </div>
                  {!option.enabled && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                      Próximamente
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-sky-950 mb-2">{option.title}</h3>
                <p className="text-slate-600 text-sm min-h-10">{option.description}</p>
                {option.enabled ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(option.id)}
                    className={`mt-6 w-full text-white px-5 py-3 rounded-xl font-semibold bg-gradient-to-r ${option.color} hover:brightness-105 transition`}
                  >
                    Acceder
                  </button>
                ) : (
                  <div
                    aria-disabled="true"
                    className="mt-6 w-full text-center px-5 py-3 rounded-xl font-semibold bg-slate-100 text-slate-400 cursor-not-allowed"
                  >
                    No disponible aún
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-14 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-sky-100">
            <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-sky-950 mb-2">Nuestra Comunidad</h4>
            <p className="text-slate-600 text-sm">
              Un espacio para compartir la vida del colegio.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-amber-100">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-sky-950 mb-2">Vida Escolar</h4>
            <p className="text-slate-600 text-sm">
              Noticias y actividades que nos mantienen unidos.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-red-100">
            <div className="w-12 h-12 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-sky-950 mb-2">Dios, Patria y Familia</h4>
            <p className="text-slate-600 text-sm">
              Los valores que inspiran nuestra formación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;