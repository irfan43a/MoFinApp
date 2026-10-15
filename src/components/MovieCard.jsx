import React from 'react';
import { Star, Bookmark, Play, Calendar } from 'lucide-react';
import { getImageUrl } from '../services/tmdb';
import { formatRating, formatYear } from '../utils/formatters';

export default function MovieCard({
  movie,
  onSelectMovie,
  onPlayTrailer,
  isInWatchlist,
  toggleWatchlist,
}) {
  const isBookmarked = isInWatchlist(movie.id);
  const rating = Number(movie.vote_average || 0);

  // Rating badge color
  let ratingBadgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
  if (rating >= 7.5) {
    ratingBadgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  } else if (rating >= 6.0) {
    ratingBadgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  } else if (rating > 0) {
    ratingBadgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  }

  return (
    <div className="group relative flex flex-col bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-slate-700 hover:shadow-2xl hover:shadow-rose-950/20 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
      {/* Poster Image Container */}
      <div 
        className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950"
        onClick={() => onSelectMovie(movie.id)}
      >
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Top Badges (Rating & Bookmark) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          {rating > 0 ? (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold border backdrop-blur-md shadow-sm ${ratingBadgeColor}`}>
              <Star className="w-3 h-3 fill-current" />
              <span>{formatRating(rating)}</span>
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-900/80 text-slate-400 border border-slate-800">
              Baru
            </div>
          )}

          {/* Watchlist Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie);
            }}
            className={`pointer-events-auto p-1.5 rounded-xl border backdrop-blur-md transition-all ${
              isBookmarked
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                : 'bg-slate-950/70 text-slate-300 border-slate-700/60 hover:text-white hover:bg-slate-900'
            }`}
            title={isBookmarked ? 'Hapus dari Watchlist' : 'Simpan ke Watchlist'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div 
        className="p-3.5 flex flex-col flex-1 justify-between gap-2"
        onClick={() => onSelectMovie(movie.id)}
      >
        <div>
          <h3 className="font-semibold text-sm text-slate-100 group-hover:text-rose-400 transition-colors line-clamp-1 leading-snug">
            {movie.title || movie.name}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{formatYear(movie.release_date || movie.first_air_date) || 'TBA'}</span>
          </p>
        </div>

        {/* Short Overview snippet */}
        {movie.overview && (
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {movie.overview}
          </p>
        )}
      </div>
    </div>
  );
}
