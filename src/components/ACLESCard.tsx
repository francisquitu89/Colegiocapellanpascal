import React, { useState } from 'react';
import { 
  Dumbbell, 
  Palette, 
  Lightbulb
} from 'lucide-react';

interface ACLESCardProps {
  type: 'deportiva' | 'artistica' | 'cientifica';
  title: string;
  items: string[];
  imageUrl?: string;
}

const ACLESCard: React.FC<ACLESCardProps> = ({ type, title, items, imageUrl }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const configs: {
    [key: string]: {
      bg: string;
      icon: string;
      text: string;
      light: string;
      IconComponent: React.ComponentType<any>;
      useImage: boolean;
      image?: string;
    };
  } = {
    deportiva: {
      bg: 'from-green-500 to-green-700',
      icon: 'bg-green-600',
      text: 'text-green-600',
      light: 'bg-green-50',
      IconComponent: Dumbbell,
      useImage: !!imageUrl,
      image: imageUrl
    },
    artistica: {
      bg: 'from-purple-500 to-purple-700',
      icon: 'bg-purple-600',
      text: 'text-purple-600',
      light: 'bg-purple-50',
      IconComponent: Palette,
      useImage: !!imageUrl,
      image: imageUrl
    },
    cientifica: {
      bg: 'from-orange-500 to-orange-700',
      icon: 'bg-orange-600',
      text: 'text-orange-600',
      light: 'bg-orange-50',
      IconComponent: Lightbulb,
      useImage: !!imageUrl,
      image: imageUrl
    }
  };

  const config = configs[type];
  const Icon = config.IconComponent;

  return (
    <div 
      className={`flip-card h-80 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        {/* Front of Card */}
        <div className={`flip-card-front shadow-2xl flex flex-col items-center justify-center p-8 text-white relative overflow-hidden ${
          config.useImage ? '' : `bg-gradient-to-br ${config.bg}`
        }`}>
          {/* Background Image */}
          {config.useImage && config.image && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${config.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </>
          )}
          
          <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110 relative z-10">
            <div className="w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Icon className={`w-12 h-12 ${config.text}`} />
            </div>
            <h3 className="text-3xl font-bold text-center mb-4 drop-shadow-lg">{title}</h3>
            <div className="flex items-center justify-center space-x-2 text-white/90 animate-pulse drop-shadow-md">
              <span className="text-sm font-semibold">Haz clic para ver actividades</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          {/* Decorative elements - only for non-image cards */}
          {!config.useImage && (
            <>
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            </>
          )}
        </div>

        {/* Back of Card */}
        <div className={`flip-card-back ${config.light} shadow-2xl flex flex-col p-6 overflow-hidden`}>
          <div className="flex flex-col items-center mb-3 flex-shrink-0">
            <div className={`w-10 h-10 ${config.icon} rounded-full flex items-center justify-center mb-2`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className={`text-xl font-bold ${config.text} text-center`}>{title}</h3>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-2 overflow-y-auto">
            <ul className="space-y-2 w-full">
              {items.map((item, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-700">
                  <div className={`w-2 h-2 ${config.icon} rounded-full flex-shrink-0`}></div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Decorative corner elements */}
          <div className={`absolute top-0 right-0 w-32 h-32 ${config.icon} opacity-5 rounded-bl-full`}></div>
          <div className={`absolute bottom-0 left-0 w-24 h-24 ${config.icon} opacity-5 rounded-tr-full`}></div>
        </div>
      </div>
    </div>
  );
};

export default ACLESCard;
