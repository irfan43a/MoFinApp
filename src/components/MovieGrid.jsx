import React from 'react';
import MovieCard from './MovieCard';
import { Film, Loader2, Sparkles, RefreshCw } from 'lucide-react';

export default function MovieGrid({
  movies = [],
  isLoading,
  isLoadingMore,
  onLoadMore,
  hasMore,
  onSelectMovie,
  onPlayTrailer,
  isInWatchlist,
  toggleWatchlist,
  activeTabTitle,
  onReset,
}) {
  return (
    <section className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {activeTabTitle}
          </h2>
          {!isLoading && movies.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700/60">
              {movies.length} Film
            </span>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-800 animate-pulse"
            >
              <div className="aspect-[2/3] bg-slate-800/60 w-full" />
              <div className="p-3.5 space-y-2">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                <div className="h-3 bg-slate-800/40 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-slate-900/30 border border-dashed border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 border border-rose-500/20">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            Tidak ada film yang ditemukan
          </h3>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            Coba ubah kata kunci pencarian, sesuaikan filter genre/tahun, atau reset pengaturan pencarian.
          </p>
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Kembalikan ke Tampilan Awal
            </button>
          )}
        </div>
      )}

      {/* Movies Grid */}
      {!isLoading && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={`${movie.id}-${movie.release_date || ''}`}
              movie={movie}
              onSelectMovie={onSelectMovie}
              onPlayTrailer={onPlayTrailer}
              isInWatchlist={isInWatchlist}
              toggleWatchlist={toggleWatchlist}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!isLoading && movies.length > 0 && hasMore && (
        <div className="flex justify-center pt-8 pb-4">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-800 hover:border-slate-700 shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                <span>Memuat data real-time...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Muat Lebih Banyak Film</span>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
