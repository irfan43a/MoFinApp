import React, { useState, useEffect } from 'react';
import { Play, Info, Bookmark, Star, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { getBackdropUrl } from '../services/tmdb';
import { formatRating, formatYear } from '../utils/formatters';

export default function HeroBanner({
  featuredMovies = [],
  onSelectMovie,
  onPlayTrailer,
  isInWatchlist,
  toggleWatchlist,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate banner every 7 seconds
  useEffect(() => {
    if (!featuredMovies.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(featuredMovies.length, 5));
    }, 7000);
    return () => clearInterval(interval);
  }, [featuredMovies]);

  if (!featuredMovies || featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];
  const isBookmarked = isInWatchlist(currentMovie.id);

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] md:h-[600px] overflow-hidden rounded-3xl mb-8 border border-slate-800/80 shadow-2xl bg-slate-950">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <img
          key={currentMovie.id}
          src={getBackdropUrl(currentMovie.backdrop_path)}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center transform scale-105 animate-fade-in"
          loading="eager"
        />
        {/* Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-end pb-12 sm:pb-16 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white shadow-lg shadow-rose-600/30 flex items-center gap-1">
              🔥 TRENDING #1
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{formatRating(currentMovie.vote_average)}</span>
              <span className="text-slate-400 text-[10px]">({currentMovie.vote_count} votes)</span>
            </div>
            {currentMovie.release_date && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatYear(currentMovie.release_date)}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight line-clamp-2 drop-shadow-md">
            {currentMovie.title || currentMovie.name}
          </h1>

          {/* Overview */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed drop-shadow-sm max-w-xl">
            {currentMovie.overview || 'Sinopsis belum tersedia untuk film ini.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onPlayTrailer(currentMovie)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              Tonton Trailer
            </button>

            <button
              onClick={() => onSelectMovie(currentMovie.id)}
              className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold text-sm border border-slate-700/80 backdrop-blur-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Info className="w-4 h-4 text-slate-300" />
              Detail Lengkap
            </button>

            <button
              onClick={() => toggleWatchlist(currentMovie)}
              className={`p-2.5 rounded-xl font-semibold text-sm border backdrop-blur-md transition-all ${
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-slate-900/80 border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isBookmarked ? 'Hapus dari Watchlist' : 'Tambah ke Watchlist'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-6 right-6 sm:right-10 flex items-center gap-2 z-20">
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? Math.min(featuredMovies.length - 1, 4) : prev - 1))}
            className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Film Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex gap-1.5">
            {featuredMovies.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-rose-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Pilih Film ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % Math.min(featuredMovies.length, 5))}
            className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Film Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
