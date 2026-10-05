import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { deleteExistingSiteLogos, getSiteLogoUrl, SITE_LOGO_BUCKET, SITE_LOGO_FILENAME } from '../lib/siteLogo';
import {
  deleteExistingHomeHeroImages,
  emitHomeHeroUpdated,
  getHomeHeroBaseImages,
  getHomeHeroUrl,
  HOME_HERO_DEFAULT_IMAGES,
  HOME_HERO_FILENAME,
  saveHomeHeroBaseImages,
} from '../lib/siteHero';
import { driveRoutesSupabase } from '../lib/supabase';

interface LogoManagementProps {
  onNavigate: (page: string) => void;
}

const LogoManagement: React.FC<LogoManagementProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [selectedHeroFile, setSelectedHeroFile] = useState<File | null>(null);
  const [currentHeroUrl, setCurrentHeroUrl] = useState<string | null>(null);
  const [heroPreviewUrl, setHeroPreviewUrl] = useState<string | null>(null);
  const [heroBaseImages, setHeroBaseImages] = useState<string[]>(HOME_HERO_DEFAULT_IMAGES);
  const [savingHeroBase, setSavingHeroBase] = useState(false);

  useEffect(() => {
    checkExistingLogo();
    checkExistingHero();
  }, []);

  const checkExistingLogo = async () => {
    try {
      const logoUrl = await getSiteLogoUrl();

      if (logoUrl) {
        setCurrentLogoUrl(logoUrl);
        setPreviewUrl(logoUrl);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingHero = async () => {
    try {
      const baseImages = await getHomeHeroBaseImages();
      setHeroBaseImages(baseImages);

      const heroUrl = await getHomeHeroUrl();

      if (heroUrl) {
        setCurrentHeroUrl(heroUrl);
        setHeroPreviewUrl(heroUrl);
      }
    } catch (error) {
      console.error('Error loading home hero:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es muy grande. El tamaño máximo es 5MB');
        return;
      }

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadLogo = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo primero');
      return;
    }

    setUploading(true);
    try {
      // Primero eliminar logos anteriores en el proyecto secundario
      await deleteExistingSiteLogos();

      // Subir nuevo logo con nombre fijo + extensión
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${SITE_LOGO_FILENAME}.${fileExt}`;

      const { error: uploadError } = await driveRoutesSupabase.storage
        .from(SITE_LOGO_BUCKET)
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert(`Error al subir: ${uploadError.message}`);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = driveRoutesSupabase.storage
        .from(SITE_LOGO_BUCKET)
        .getPublicUrl(fileName);

      setCurrentLogoUrl(publicUrl);
      setPreviewUrl(publicUrl);
      setSelectedFile(null);

      alert('¡Logo subido exitosamente! Recarga la página para ver los cambios en la navbar.');
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      alert(`Error: ${error?.message || 'Error desconocido'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleHeroFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('El archivo es muy grande. El tamaño máximo es 8MB');
      return;
    }

    setSelectedHeroFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setHeroPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadHero = async () => {
    if (!selectedHeroFile) {
      alert('Por favor selecciona una portada primero');
      return;
    }

    setUploadingHero(true);
    try {
      await deleteExistingHomeHeroImages();

      const fileExt = selectedHeroFile.name.split('.').pop();
      const fileName = `${HOME_HERO_FILENAME}.${fileExt}`;

      const { error: uploadError } = await driveRoutesSupabase.storage
        .from(SITE_LOGO_BUCKET)
        .upload(fileName, selectedHeroFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload home hero error:', uploadError);
        alert(`Error al subir portada: ${uploadError.message}`);
        return;
      }

      const { data: { publicUrl } } = driveRoutesSupabase.storage
        .from(SITE_LOGO_BUCKET)
        .getPublicUrl(fileName);

      setCurrentHeroUrl(publicUrl);
      setHeroPreviewUrl(publicUrl);
      setSelectedHeroFile(null);
      emitHomeHeroUpdated();

      alert('¡Portada principal actualizada! Recarga la página para ver cambios.');
    } catch (error: any) {
      console.error('Error uploading home hero:', error);
      alert(`Error: ${error?.message || 'Error desconocido'}`);
    } finally {
      setUploadingHero(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar el logo?')) return;

    try {
      await deleteExistingSiteLogos();

      setCurrentLogoUrl(null);
      setPreviewUrl(null);
      alert('Logo eliminado. Recarga la página para ver los cambios.');
    } catch (error: any) {
      alert(`Error: ${error?.message || 'Error desconocido'}`);
    }
  };

  const handleDeleteHero = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar la portada principal personalizada?')) return;

    try {
      await deleteExistingHomeHeroImages();
      setCurrentHeroUrl(null);
      setHeroPreviewUrl(null);
      alert('Portada principal personalizada eliminada. Se usarán las imágenes por defecto.');
    } catch (error: any) {
      alert(`Error: ${error?.message || 'Error desconocido'}`);
    }
  };

  const moveHeroBaseImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= heroBaseImages.length) {
      return;
    }

    setHeroBaseImages((prev) => {
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const removeHeroBaseImage = (index: number) => {
    setHeroBaseImages((prev) => {
      if (prev.length <= 1) {
        alert('La portada debe tener al menos una imagen base.');
        return prev;
      }

      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleSaveHeroBaseImages = async () => {
    try {
      setSavingHeroBase(true);
      await saveHomeHeroBaseImages(heroBaseImages);
      alert('Orden y selección de fotos base guardados exitosamente.');
    } catch (error: any) {
      console.error('Error saving hero base images:', error);
      alert(`Error al guardar fotos base: ${error?.message || 'Error desconocido'}`);
    } finally {
      setSavingHeroBase(false);
    }
  };

  const handleResetHeroBaseImages = () => {
    setHeroBaseImages(HOME_HERO_DEFAULT_IMAGES);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b2540] to-[#08304a] flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2540] to-[#08304a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center text-blue-200 hover:text-white transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al Panel de Administración
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Gestión del Logo Principal</h1>
          <p className="text-blue-100 text-lg">
            Administra el logo que aparece en la barra de navegación del sitio
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Current Logo Preview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="w-6 h-6 mr-2" />
              Logo Actual
            </h2>
            <div className="flex flex-col items-center bg-gray-100 rounded-lg p-8 min-h-[200px]">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Logo actual"
                    className="max-h-48 max-w-full object-contain mb-4"
                    onError={() => {
                      setPreviewUrl(null);
                      setCurrentLogoUrl(null);
                    }}
                  />
                  {currentLogoUrl && !selectedFile && (
                    <button
                      onClick={handleDeleteLogo}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-800 mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar logo</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="text-gray-400 text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                  <p>No hay logo configurado</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload New Logo */}
          <div className="mb-8 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Upload className="w-6 h-6 mr-2" />
              Subir Nuevo Logo
            </h2>
            <p className="text-gray-600 mb-4">
              Sube un archivo de imagen desde tu computadora (PNG, JPG, SVG). Tamaño máximo: 5MB
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Seleccionar archivo:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
                />
              </div>

              {selectedFile && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Archivo seleccionado:</strong> {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tamaño: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <button
                onClick={handleUploadLogo}
                disabled={!selectedFile || uploading}
                className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  !selectedFile || uploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>{uploading ? 'Subiendo...' : 'Subir Logo'}</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="w-6 h-6 mr-2" />
              Portada Landing Principal
            </h2>
            <p className="text-gray-600 mb-4">
              Esta imagen se usa en la portada del inicio detrás del texto "¿POR QUÉ ELEGIR SAGRADOS CORAZONES DE MANQUEHUE?".
            </p>

            <div className="flex flex-col items-center bg-gray-100 rounded-lg p-6 mb-4 min-h-[220px]">
              {heroPreviewUrl ? (
                <>
                  <img
                    src={heroPreviewUrl}
                    alt="Portada principal"
                    className="w-full max-w-3xl max-h-72 object-cover rounded-lg mb-3"
                    onError={() => {
                      setHeroPreviewUrl(null);
                      setCurrentHeroUrl(null);
                    }}
                  />
                  {currentHeroUrl && !selectedHeroFile && (
                    <button
                      onClick={handleDeleteHero}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar portada personalizada</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="text-gray-400 text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                  <p>Sin portada personalizada (usa imágenes por defecto)</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Fotos base actualmente activas en la portada</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {heroBaseImages.map((imageUrl, index) => (
                  <div key={`${imageUrl}-${index}`} className="relative rounded-lg overflow-hidden border border-gray-200 bg-white">
                    <img
                      src={imageUrl}
                      alt={`Portada base ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <div className="px-2 py-1 text-xs text-gray-600 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2">
                      <span>Base {index + 1}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveHeroBaseImage(index, 'up')}
                          disabled={index === 0}
                          className="px-1.5 py-0.5 rounded border border-gray-300 text-gray-700 disabled:opacity-40"
                          title="Mover arriba"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveHeroBaseImage(index, 'down')}
                          disabled={index === heroBaseImages.length - 1}
                          className="px-1.5 py-0.5 rounded border border-gray-300 text-gray-700 disabled:opacity-40"
                          title="Mover abajo"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeHeroBaseImage(index)}
                          disabled={heroBaseImages.length <= 1}
                          className="px-1.5 py-0.5 rounded border border-red-300 text-red-700 disabled:opacity-40"
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Si subes una portada personalizada, se mostrará primero y luego estas fotos base en este orden.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSaveHeroBaseImages}
                  disabled={savingHeroBase}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${savingHeroBase ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {savingHeroBase ? 'Guardando...' : 'Guardar Orden y Selección'}
                </button>
                <button
                  type="button"
                  onClick={handleResetHeroBaseImages}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Restablecer Fotos Base
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroFileSelect}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
              />

              {selectedHeroFile && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Archivo seleccionado:</strong> {selectedHeroFile.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tamaño: {(selectedHeroFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <button
                onClick={handleUploadHero}
                disabled={!selectedHeroFile || uploadingHero}
                className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  !selectedHeroFile || uploadingHero
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>{uploadingHero ? 'Subiendo...' : 'Subir Portada Principal'}</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              📌 Recomendaciones
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Usa imágenes en formato PNG con fondo transparente para mejores resultados</li>
              <li>• Dimensiones recomendadas: 200x200 píxeles o más</li>
              <li>• El logo se ajustará automáticamente al tamaño de la barra de navegación</li>
              <li>• <strong>Recarga la página</strong> después de subir para ver los cambios</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoManagement;
