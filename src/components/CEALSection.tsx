import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CEALSectionProps {
  onBack: () => void;
}

interface CEALMember {
  id: string;
  position: string;
  name: string;
  order_index: number;
  year: number;
}

interface Photo {
  id: string;
  photo_url: string;
  photo_name: string;
  order_index: number;
}

const CEALSection: React.FC<CEALSectionProps> = ({ onBack }) => {
  const [members, setMembers] = useState<CEALMember[]>([]);
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
      
      const [membersData, photosData] = await Promise.all([
        supabase.from('ceal_members').select('*').order('order_index'),
        supabase.from('ceal_photos').select('*').order('order_index')
      ]);

      if (membersData.error) throw membersData.error;
      if (photosData.error) throw photosData.error;

      setMembers(membersData.data || []);
      setPhotos(photosData.data || []);
    } catch (error) {
      console.error('Error fetching CEAL data:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
            CEAL - Centro de Alumnos
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
                    alt={`CEAL ${index + 1}`}
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

        {/* CEAL 2025 Content */}
        <div className={`bg-white rounded-lg shadow-lg p-8 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Centro de Alumnos 2025</h2>
          
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Este año, como Centro de Alumnos, queremos ser una voz cercana y presente. Nuestra meta es simple pero importante: 
              aportar con pequeños gestos y grandes ideas para que este 2025 sea un año especial para todos.
            </p>
            
            <p>
              Nos propusimos fortalecer la convivencia, hacer comunidad y darle vida al sello SF que nos une como colegio. 
              Pero también queremos reafirmar el rol del CEAL como un espacio representativo, activo y comprometido, 
              que contribuya de forma concreta a la vida escolar y al crecimiento de cada curso.
            </p>
            
            <p>
              Creemos que cada uno de nosotros tiene algo valioso que aportar, y que todos podemos dejar una huella en el camino.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6 rounded">
              <p className="text-xl font-semibold text-blue-900 mb-2">
                "Avanzando juntos, dejando huellas"
              </p>
              <p className="text-gray-700">
                Queremos seguir creando espacios que nos acerquen, como el Torneo de Media, las Alianzas o la Semana de la Convivencia, 
                donde cada encuentro sea una oportunidad para disfrutar y construir recuerdos.
              </p>
            </div>
            
            <p className="text-right italic">Con cariño,<br />Centro de Alumnos 2025</p>
          </div>
        </div>

        {/* Members Grid */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Integrantes CEAL 2025</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <div
                key={member.id}
                className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 delay-${(index % 4) * 100}`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{member.position}</h3>
                  <p className="text-blue-600 font-medium">{member.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CEALSection;
