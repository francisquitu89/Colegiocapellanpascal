import React, { useState } from 'react';
import { Eye, Target } from 'lucide-react';

interface FlipCardProps {
  type: 'vision' | 'mision';
  title: string;
  content: string;
  customImage?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ type, title, content, customImage }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const colors: {
    [key: string]: {
      bg: string;
      icon: string;
      text: string;
      light: string;
      useImage: boolean;
      image?: string;
    };
  } = {
    vision: {
      bg: 'from-blue-500 to-blue-700',
      icon: 'bg-blue-600',
      text: 'text-blue-600',
      light: 'bg-blue-50',
      useImage: true,
      image: 'https://i.postimg.cc/X7RvQJ5r/hdadj.png'
    },
    mision: {
      bg: 'from-red-500 to-red-700',
      icon: 'bg-red-600',
      text: 'text-red-600',
      light: 'bg-red-50',
      useImage: true,
      image: 'https://i.postimg.cc/mZQwjcJ9/4tet.png'
    }
  };

  const Icon = type === 'vision' ? Eye : Target;
  const color = colors[type];
  const finalImage = customImage || color.image;

  return (
    <div 
      className={`flip-card h-80 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        {/* Front of Card */}
        <div className={`flip-card-front shadow-2xl flex flex-col items-center justify-center p-8 text-white relative overflow-hidden ${
          color.useImage ? '' : `bg-gradient-to-br ${color.bg}`
        }`}>
          {/* Background Image for Vision */}
          {color.useImage && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${finalImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'contrast(1.2) brightness(1.1) saturate(1.3)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/30 to-black/40"></div>
            </>
          )}
          
          <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110 relative z-10">
            <div className="w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Icon className={`w-12 h-12 ${color.text}`} />
            </div>
            <h3 className="text-4xl font-bold text-center mb-4 drop-shadow-lg">{title}</h3>
            <div className="flex items-center justify-center space-x-2 text-white/90 animate-pulse drop-shadow-md">
              <span className="text-sm font-semibold">Haz clic para descubrir</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          {/* Decorative elements - only for non-image cards */}
          {!color.useImage && (
            <>
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            </>
          )}
        </div>

        {/* Back of Card */}
        <div className={`flip-card-back ${color.light} shadow-2xl flex flex-col p-6 overflow-hidden`}>
          <div className="flex flex-col items-center mb-3 flex-shrink-0">
            <div className={`w-10 h-10 ${color.icon} rounded-full flex items-center justify-center mb-2`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className={`text-xl font-bold ${color.text} text-center`}>{title}</h3>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-2">
            <p className="text-gray-700 leading-snug text-sm text-center">
              {content}
            </p>
          </div>

          {/* Decorative corner elements */}
          <div className={`absolute top-0 right-0 w-32 h-32 ${color.icon} opacity-5 rounded-bl-full`}></div>
          <div className={`absolute bottom-0 left-0 w-24 h-24 ${color.icon} opacity-5 rounded-tr-full`}></div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
