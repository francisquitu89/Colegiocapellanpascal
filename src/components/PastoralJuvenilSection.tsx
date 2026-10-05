import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PastoralJuvenilSectionProps {
  onBack: () => void;
}

interface CoreMember {
  id: string;
  name: string;
  order_index: number;
  year: number;
}

interface Teacher {
  id: string;
  name: string;
  order_index: number;
}

interface Photo {
  id: string;
  photo_url: string;
  photo_name: string;
  order_index: number;
}

const PastoralJuvenilSection: React.FC<PastoralJuvenilSectionProps> = ({ onBack }) => {
  const [coreMembers, setCoreMembers] = useState<CoreMember[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, []);

  useEffect(() => {
    if (photos.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [photos]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [coreMembersData, teachersData, photosData] = await Promise.all([
        supabase.from('pastoral_core_members').select('*').order('order_index'),
        supabase.from('pastoral_teachers').select('*').order('order_index'),
        supabase.from('pastoral_photos').select('*').order('order_index')
      ]);

      if (coreMembersData.error) throw coreMembersData.error;
      if (teachersData.error) throw teachersData.error;
      if (photosData.error) throw photosData.error;

      setCoreMembers(coreMembersData.data || []);
      setTeachers(teachersData.data || []);
      setPhotos(photosData.data || []);
    } catch (error) {
      console.error('Error fetching Pastoral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    resetZoom();
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    resetZoom();
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(1, zoom + delta), 3);
    setZoom(newZoom);
    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Pastoral Juvenil
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Photo Carousel */}
        {photos.length > 0 && (
          <div className={`relative mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div 
              className="relative h-96 rounded-xl overflow-hidden shadow-2xl"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentPhotoIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={photo.photo_url}
                    alt={`Pastoral ${index + 1}`}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                    style={{
                      transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                      transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                  />
                </div>
              ))}
              
              {/* Navigation Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => { setCurrentPhotoIndex(index); resetZoom(); }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentPhotoIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mission Statement */}
        <div className={`bg-white rounded-lg shadow-lg p-8 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-purple-900">Nuestra Misión</h2>
          </div>
          
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              La Pastoral Juvenil tiene como objetivo fundamental favorecer el cultivo de la fe de nuestros alumnos, 
              a través de la conducción, gestión y organización de diversas actividades y proyectos apostólicos y pastorales de nuestro colegio.
            </p>
            
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 my-6 rounded">
              <h3 className="font-bold text-purple-900 mb-3">Proyectos Pastorales:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Trabajos de invierno</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Preparación de Vía crucis y Pentecostés</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Misiones Siembra (para alumnos de 7º y 8º básico)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Vinculación con María Ayuda</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Misiones de verano</span>
                </li>
              </ul>
            </div>
            
            <p>
              Nuestra Pastoral promueve que nuestros alumnos, desde su propia originalidad y motivación, sean capaces de salir al encuentro del otro 
              y crecer como personas íntegras, preparados a responder de las problemáticas sociales de nuestro país y nuestro tiempo, 
              desde una mirada cristiana basada en la entrega y misericordia.
            </p>
            
            <p>
              La Pastoral Juvenil SF es integrada por un amplio número de alumnos de 7º básico a IVº medio y conducida por un núcleo de 6 alumnos 
              de enseñanza media y tres profesores, quienes acogen las inquietudes y necesidades de nuestra comunidad y organizan las tareas propias 
              de cada proyecto, que luego son delegadas y gestionadas por los alumnos integrantes de la pastoral juvenil.
            </p>
          </div>
        </div>

        {/* Core Members */}
        <div className={`bg-white rounded-lg shadow-lg p-8 mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-2xl font-bold text-purple-900 mb-6 text-center">
            Alumnos Núcleo Pastoral Juvenil 2025
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-3 bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors duration-300"
              >
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-800 font-medium">{member.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Teachers */}
        {teachers.length > 0 && (
          <div className={`bg-white rounded-lg shadow-lg p-8 mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-2xl font-bold text-purple-900 mb-6 text-center">Profesores</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center space-x-3 bg-purple-50 rounded-lg px-6 py-3 hover:bg-purple-100 transition-colors duration-300"
                >
                  <Heart className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-800 font-medium">{teacher.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instagram Link */}
        <div className={`text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="https://www.instagram.com/pastoraljuvenil_csfr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Instagram className="w-6 h-6" />
            <span className="font-semibold text-lg">Visita nuestro Instagram</span>
          </a>
          <p className="mt-3 text-gray-600">@pastoraljuvenil_csfr</p>
        </div>
      </div>
    </div>
  );
};

export default PastoralJuvenilSection;
