import React, { useState } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { EditorialItem } from '../lib/supabase';
import { ContentRenderer } from './ContentRenderer';

interface EditorialDetailModalProps {
  editorial: EditorialItem;
  onClose: () => void;
}

const EditorialDetailModal: React.FC<EditorialDetailModalProps> = ({ editorial, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = Array.isArray(editorial.images) ? editorial.images : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVimeoVideoId = (url: string) => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const renderVideo = () => {
    if (!editorial.video_url) return null;

    const youtubeId = getYouTubeVideoId(editorial.video_url);
    const vimeoId = getVimeoVideoId(editorial.video_url);

    if (youtubeId) {
      return (
        <div className="relative w-full h-0 pb-[56.25%] mb-8">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (vimeoId) {
      return (
        <div className="relative w-full h-0 pb-[56.25%] mb-8">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title="Vimeo video"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3 text-red-600">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">{formatDate(editorial.date)}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 leading-tight">
            {editorial.title}
          </h1>

          {/* Image Carousel (Simple Images) */}
          {images.length > 0 && (
            <div className="relative mb-8">
              <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
                <img
                  src={images[currentImageIndex]}
                  alt={`${editorial.title} - Imagen ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Image Indicators */}
              {images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-red-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content with Advanced Images */}
          <ContentRenderer
            contentId={editorial.id}
            content={editorial.content}
            contentType="editorial"
            showImages={true}
            className="mb-8"
          />

          {/* Video Section */}
          {renderVideo()}
        </div>
      </div>
    </div>
  );
};

export default EditorialDetailModal;