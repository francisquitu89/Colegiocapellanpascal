import { useEffect, useState } from 'react';
import { ArrowRight, Download, Loader2, X } from 'lucide-react';
import { driveRoutesSupabase } from '../lib/supabase';
import { handleProtectedDownload } from '../lib/downloadRateLimit';

interface AnnouncementData {
  id: number;
  is_active: boolean;
  title: string;
  message: string;
  document_url: string | null;
  document_name: string | null;
  image_url?: string | null;
  image_name?: string | null;
  image_enabled?: boolean;
  link_url?: string | null;
  link_text?: string | null;
}

export default function AnnouncementInfoSection() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncement();

    const intervalId = setInterval(fetchAnnouncement, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const { data, error } = await driveRoutesSupabase
        .from('announcement_popup')
        .select('*')
        .order('id', { ascending: true })
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching announcement info:', error);
        setAnnouncement(null);
        return;
      }

      if (data && data.length > 0 && data[0].is_active) {
        setAnnouncement(data[0]);
      } else {
        setAnnouncement(null);
      }
    } catch (error) {
      console.error('Error fetching announcement info:', error);
      setAnnouncement(null);
    } finally {
      setLoading(false);
    }
  };

  const openMobilePopup = () => setIsMobilePopupOpen(true);
  const closeMobilePopup = () => setIsMobilePopupOpen(false);

  if (loading) {
    return (
      <>
        <div className="pointer-events-none absolute right-4 top-56 z-20 hidden w-[calc(100%-2rem)] max-w-xs sm:right-6 sm:top-64 sm:block sm:w-auto sm:max-w-[22rem]">
          <div className="pointer-events-auto flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-2xl shadow-black/15 backdrop-blur-md">
            <Loader2 className="h-5 w-5 animate-spin text-white/90" />
            <span className="text-sm font-medium text-white/90">Cargando aviso...</span>
          </div>
        </div>

        <button
          type="button"
          onClick={openMobilePopup}
          className="inline-flex items-center justify-center rounded-none border-2 border-white px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-gray-800 drop-shadow-lg sm:hidden"
        >
          <Loader2 className="h-5 w-5 animate-spin text-white/90" />
          <span className="ml-2">Ver aviso</span>
        </button>
      </>
    );
  }

  if (!announcement) {
    return null;
  }

  return (
    <>
      <div className="pointer-events-none absolute right-4 top-56 z-20 hidden w-[calc(100%-2rem)] max-w-xs sm:right-6 sm:top-64 sm:block sm:w-auto sm:max-w-[22rem]">
        <div className="pointer-events-auto overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-white shadow-2xl shadow-black/15 backdrop-blur-md">
          <div className="flex flex-col items-center gap-3 px-4 py-4 text-center sm:px-5 sm:py-4">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">Aviso activo</p>
              <h2 className="text-sm font-semibold text-white sm:text-[15px]">{announcement.title}</h2>
              <p className="max-w-[20rem] text-xs leading-relaxed text-white/80 sm:text-sm">
                {announcement.message}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:flex-shrink-0">
              {announcement.link_url && announcement.link_text && (
                <a
                  href={announcement.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-white/15"
                >
                  {announcement.link_text}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}

              {announcement.document_url && (
                <button
                  onClick={handleProtectedDownload(announcement.document_url, announcement.document_name || 'documento')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Descargar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={openMobilePopup}
        className="inline-flex max-w-[18rem] flex-col items-center justify-center rounded-none border-2 border-white px-4 py-3 text-center text-[10px] leading-tight font-bold uppercase tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-gray-800 drop-shadow-lg sm:hidden"
      >
        <span className="text-[9px] leading-none opacity-90">Ver</span>
        <span className="mt-1 whitespace-normal break-words text-[10px] leading-tight">
          {announcement.title}
        </span>
      </button>

      {isMobilePopupOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/55 p-4 sm:hidden">
          <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Aviso activo</p>
                <h3 className="mt-1 text-sm font-semibold text-slate-900">{announcement.title}</h3>
              </div>
              <button
                type="button"
                onClick={closeMobilePopup}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {announcement.message}
              </p>

              <div className="flex flex-col gap-2">
                {announcement.document_url && (
                  <button
                    type="button"
                    onClick={handleProtectedDownload(announcement.document_url, announcement.document_name || 'documento')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <Download className="h-4 w-4" />
                    Descargar adjunto
                  </button>
                )}

                {announcement.link_url && announcement.link_text && (
                  <a
                    href={announcement.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900"
                  >
                    {announcement.link_text}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}