import React, { useEffect } from 'react';
import { X, Film, AlertCircle } from 'lucide-react';

export default function TrailerModal({
  trailerKey,
  movieTitle,
  onClose,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2 truncate pr-4">
            <Film className="w-4 h-4 text-rose-500 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              Trailer Resmi: {movieTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player or Fallback */}
        <div className="relative aspect-video w-full bg-black">
          {trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`Trailer: ${movieTitle}`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
              <h4 className="text-lg font-bold text-white mb-1">
                Trailer Tidak Ditemukan
              </h4>
              <p className="text-sm text-slate-400 max-w-sm">
                Maaf, video trailer untuk film ini belum disediakan oleh penyedia data TMDb.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
