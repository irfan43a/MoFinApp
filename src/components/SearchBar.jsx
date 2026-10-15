import React from 'react';
import { Search, X, Flame } from 'lucide-react';

const QUICK_SUGGESTIONS = [
  'Spider-Man',
  'Avengers',
  'Batman',
  'Oppenheimer',
  'Dune',
  'Avatar',
  'Interstellar',
  'Godzilla',
];

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  totalResults,
  isSearching,
}) {
  return (
    <div className="w-full space-y-3 mb-6">
      {/* Main Search Input */}
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-rose-500" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari judul film apa saja (contoh: Spider-Man, Oppenheimer, Barbie)..."
          className="w-full pl-12 pr-12 py-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base shadow-inner transition-all"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Hapus Pencarian"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick suggestions & live query state */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-slate-400">
          <span className="flex items-center gap-1 text-slate-400 font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Populer dicari:
          </span>
          {QUICK_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-800/80 transition-all text-xs"
            >
              {tag}
            </button>
          ))}
        </div>

        {searchQuery.trim() && (
          <div className="text-slate-400 text-xs flex items-center gap-2">
            {isSearching ? (
              <span className="text-rose-400 animate-pulse">Mencari...</span>
            ) : (
              <span>
                Ditemukan <strong className="text-white">{totalResults}</strong> hasil untuk "{searchQuery}"
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
