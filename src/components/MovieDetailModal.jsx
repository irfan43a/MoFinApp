import React, { useState, useEffect } from 'react';
import { 
  X, Star, Calendar, Clock, Bookmark, Play, Users, 
  DollarSign, Globe, Film, ChevronRight, Loader2, Award 
} from 'lucide-react';
import { fetchMovieDetails, getImageUrl, getBackdropUrl, getProfileUrl } from '../services/tmdb';
import { formatRating, formatDate, formatRuntime, formatCurrency } from '../utils/formatters';

export default function MovieDetailModal({
  movieId,
  onClose,
  onPlayTrailer,
  isInWatchlist,
  toggleWatchlist,
  onSelectMovie,
}) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchMovieDetails(movieId)
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Gagal memuat detail film');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movieId) return null;

  // Extract director and writers
  const crew = details?.credits?.crew || [];
  const director = crew.find((c) => c.job === 'Director')?.name || 'TBA';
  const writers = crew
    .filter((c) => c.job === 'Screenplay' || c.job === 'Writer')
    .slice(0, 2)
    .map((c) => c.name)
    .join(', ');

  // Official YouTube trailer
  const trailer = details?.videos?.results?.find(
    (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
  );

  const isBookmarked = details ? isInWatchlist(details.id) : false;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl my-auto text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Floating */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 shadow-lg transition-colors"
          title="Tutup (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
            <p className="text-sm text-slate-400">Memuat detail film secara real-time...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-4">
            <p className="text-rose-400 text-sm">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold"
            >
              Kembali
            </button>
          </div>
        ) : details && (
          <div className="max-h-[90vh] overflow-y-auto">
            {/* Header Backdrop Banner */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-900">
              <img
                src={getBackdropUrl(details.backdrop_path || details.poster_path)}
                alt={details.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />

              {/* Quick Play Trailer Button if available */}
              {trailer && (
                <div className="absolute bottom-6 right-6">
                  <button
                    onClick={() => onPlayTrailer(details)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Tonton Trailer
                  </button>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 -mt-20 relative z-10 space-y-8">
              {/* Main Info Header: Poster + Details */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Poster Card */}
                <div className="w-36 sm:w-48 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-slate-900">
                  <img
                    src={getImageUrl(details.poster_path, 'w500')}
                    alt={details.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Metadata */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Rating Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{formatRating(details.vote_average)}</span>
                      <span className="text-slate-400 text-[11px]">({details.vote_count} suara)</span>
                    </div>

                    {/* Runtime */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs border border-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatRuntime(details.runtime)}</span>
                    </div>

                    {/* Release Date */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs border border-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(details.release_date)}</span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {details.title}
                  </h1>

                  {details.tagline && (
                    <p className="text-rose-400/90 text-sm italic font-medium">
                      "{details.tagline}"
                    </p>
                  )}

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {details.genres?.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/60"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <button
                      onClick={() => toggleWatchlist(details)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isBookmarked
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      <span>{isBookmarked ? 'Tersimpan di Watchlist' : 'Tambah ke Watchlist'}</span>
                    </button>

                    {details.homepage && (
                      <a
                        href={details.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Situs Resmi</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-rose-500" />
                  Sinopsis
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {details.overview || 'Sinopsis belum tersedia dalam bahasa ini.'}
                </p>
              </div>

              {/* Crew & Financial Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Sutradara:</span>
                  <span className="font-semibold text-slate-200">{director}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Penulis Skenario:</span>
                  <span className="font-semibold text-slate-200">{writers || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Anggaran (Budget):</span>
                  <span className="font-semibold text-slate-200">{formatCurrency(details.budget)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Pendapatan (Revenue):</span>
                  <span className="font-semibold text-slate-200">{formatCurrency(details.revenue)}</span>
                </div>
              </div>

              {/* Top Cast Section */}
              {details.credits?.cast && details.credits.cast.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-rose-500" />
                    Pemeran Utama (Cast)
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none">
                    {details.credits.cast.slice(0, 10).map((actor) => (
                      <div
                        key={actor.id}
                        className="w-24 shrink-0 text-center space-y-1.5"
                      >
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border border-slate-700/80 bg-slate-900 shadow-md">
                          <img
                            src={getProfileUrl(actor.profile_path)}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                          {actor.name}
                        </p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">
                          {actor.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Movies Recommendations */}
              {details.similar?.results && details.similar.results.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-rose-500" />
                    Film Terkait & Rekomendasi Serupa
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {details.similar.results.slice(0, 5).map((sim) => (
                      <div
                        key={sim.id}
                        onClick={() => onSelectMovie(sim.id)}
                        className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 cursor-pointer group transition-all"
                      >
                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-slate-950 mb-2">
                          <img
                            src={getImageUrl(sim.poster_path, 'w300')}
                            alt={sim.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-xs font-medium text-slate-200 line-clamp-1 group-hover:text-rose-400 transition-colors">
                          {sim.title}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{formatRating(sim.vote_average)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
