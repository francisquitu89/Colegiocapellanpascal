import React from 'react';

export interface DirectoryItem {
  name: string;
  photoUrl: string;
}

interface DirectoryCarouselProps {
  items: DirectoryItem[];
}

const DirectoryCarousel: React.FC<DirectoryCarouselProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-3 p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105">
          <div className="w-full aspect-square overflow-hidden rounded-lg border-4 border-blue-100">
            <img
              src={item.photoUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center text-gray-800 font-medium text-sm leading-tight">
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DirectoryCarousel;