import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { driveRoutesSupabase, supabase, NewsItem } from '../lib/supabase';
import NewsDetailModal from './NewsDetailModal';

const NEWS_SHARE_PARAM = 'noticia';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'noticia';

const buildNewsShareToken = (item: NewsItem) => `${slugify(item.title)}--${item.id}`;

const resolveNewsIdFromToken = (token: string) => {
  const separatorIndex = token.lastIndexOf('--');
  return separatorIndex >= 0 ? token.slice(separatorIndex + 2) : token;
};

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [showAll, setShowAll] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (news.length === 0) {
      return;
    }

    const token = new URLSearchParams(window.location.search).get(NEWS_SHARE_PARAM);
    if (!token) {
      return;
    }

    const newsId = resolveNewsIdFromToken(token);
    const matchedNews = news.find((item) => item.id === newsId);

    if (matchedNews) {
      setSelectedNews(matchedNews);
    }
  }, [news]);

  useEffect(() => {
    const handlePopState = () => {
      const token = new URLSearchParams(window.location.search).get(NEWS_SHARE_PARAM);

      if (!token) {
        setSelectedNews(null);
        return;
      }

      const newsId = resolveNewsIdFromToken(token);
      const matchedNews = news.find((item) => item.id === newsId);
      setSelectedNews(matchedNews || null);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [news]);

  const getNewsShareUrl = (item: NewsItem) => {
    const url = new URL(window.location.origin);
    url.pathname = '/inicio';
    url.searchParams.set(NEWS_SHARE_PARAM, buildNewsShareToken(item));
    return url.toString();
  };

  const openNewsDetail = (item: NewsItem) => {
    setSelectedNews(item);

    const shareUrl = getNewsShareUrl(item);
    window.history.pushState({}, '', shareUrl);
  };

  const closeNewsDetail = () => {
    setSelectedNews(null);

    const url = new URL(window.location.href);
    url.searchParams.delete(NEWS_SHARE_PARAM);
    window.history.replaceState({}, '', url.toString());
  };

  const fetchNews = async () => {
    try {
      console.log('Fetching news from Supabase...');
      const [secondaryResult, primaryResult] = await Promise.allSettled([
        driveRoutesSupabase
          .from('news')
          .select('*')
          .order('date', { ascending: false }),
        supabase
          .from('news')
          .select('*')
          .order('date', { ascending: false }),
      ]);

      const secondaryNews = secondaryResult.status === 'fulfilled' && !secondaryResult.value.error
        ? (secondaryResult.value.data || [])
        : [];
      const primaryNews = primaryResult.status === 'fulfilled' && !primaryResult.value.error
        ? (primaryResult.value.data || [])
        : [];

      const mergedById = new Map<string, NewsItem>();
      primaryNews.forEach((item) => mergedById.set(item.id, item as NewsItem));
      secondaryNews.forEach((item) => mergedById.set(item.id, item as NewsItem));

      const mergedNews = Array.from(mergedById.values()).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      console.log('News fetched successfully:', mergedNews);
      setNews(mergedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique years from news
  const availableYears = React.useMemo(() => {
    const years = news.map(item => new Date(item.date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  }, [news]);

  // Filter news by selected year
  const filteredNews = React.useMemo(() => {
    if (selectedYear === 'all') return showAll ? news : news.slice(0, 6); // Show first 6 unless 'Mostrar más' pressed
    return news.filter(item => new Date(item.date).getFullYear().toString() === selectedYear);
  }, [news, selectedYear, showAll]);

  const nextImage = (newsId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [newsId]: ((prev[newsId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (newsId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [newsId]: ((prev[newsId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
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

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando noticias...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news-section" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 font-medium mb-4" style={{color: '#2563EB'}}>
            <div className="w-8 h-0.5" style={{backgroundColor: '#2563EB'}}></div>
            <span>Informativos</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-blue-900">Noticias</h2>
        </div>

        

        {/* Year Filter */}
        {availableYears.length > 1 && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-1 shadow-md">
              <div className="flex space-x-1">
                <button
                  onClick={() => { setSelectedYear('all'); setShowAll(false); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedYear === 'all'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  Todas
                </button>
                {availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => { setSelectedYear(year.toString()); setShowAll(false); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedYear === year.toString()
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => {
            const currentIndex = currentImageIndex[item.id] || 0;
            const images = Array.isArray(item.images) ? item.images : [];
            
            return (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                onClick={() => openNewsDetail(item)}
              >
                {/* Image Carousel */}
                {images.length > 0 && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={images[currentIndex]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.date)}</span>
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage(item.id, images.length);
                          }}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage(item.id, images.length);
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Image Indicators */}
                    {images.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {images.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Video Thumbnail */}
                {item.video_url && !images.length && (
                  <div className="relative h-48 overflow-hidden bg-gray-900">
                    {getYouTubeVideoId(item.video_url) && (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${getYouTubeVideoId(item.video_url)}/maxresdefault.jpg`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-600 rounded-full p-3">
                            <Play className="w-6 h-6 text-white fill-current" />
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <div 
                    className="text-gray-600 text-sm line-clamp-3"
                    dangerouslySetInnerHTML={{ 
                      __html: item.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                    }}
                  />
                  
                  <div className="mt-4 text-red-600 text-sm font-medium flex items-center">
                    <span>Leer más</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {selectedYear === 'all' ? 'No hay noticias disponibles' : `No hay noticias para ${selectedYear}`}
            </h3>
            <p className="text-gray-500">
              {selectedYear === 'all' 
                ? 'Las noticias aparecerán aquí una vez que sean publicadas.' 
                : 'Intenta seleccionar otro año o ver todas las noticias.'
              }
            </p>
          </div>
        )}

        {/* Mostrar más / Mostrar menos for homepage - moved to bottom of section */}
        {selectedYear === 'all' && news.length > 6 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={(e) => { e.stopPropagation(); setShowAll(prev => !prev); }}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              {showAll ? 'Mostrar menos' : 'Mostrar más'}
            </button>
          </div>
        )}
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          onClose={closeNewsDetail}
          shareUrl={getNewsShareUrl(selectedNews)}
        />
      )}
    </section>
  );
};

export default NewsSection;