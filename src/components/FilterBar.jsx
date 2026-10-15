import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';

export default function FilterBar({
  activeTab,
  setActiveTab,
  genres = [],
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  sortBy,
  setSortBy,
  onResetFilters,
  watchlistCount = 0,
}) {
  const years = [
    { label: 'Semua Tahun', value: 'all' },
    { label: '2026', value: '2026' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2020', value: '2020' },
    { label: '2019', value: '2019' },
    { label: '2015', value: '2015' },
    { label: '2010', value: '2010' },
  ];

  const sortOptions = [
    { label: 'Paling Populer', value: 'popularity.desc' },
    { label: 'Rating Tertinggi', value: 'vote_average.desc' },
    { label: 'Rilis Terbaru', value: 'primary_release_date.desc' },
    { label: 'Jumlah Vote Terbanyak', value: 'vote_count.desc' },
  ];

  const hasActiveFilters = selectedGenre !== 'all' || selectedYear !== 'all' || sortBy !== 'popularity.desc';

  return (
    <div className="space-y-4 mb-8">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'trending'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <span>🔥</span> Sedang Tren
        </button>

        <button
          onClick={() => setActiveTab('now_playing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'now_playing'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <span>🎬</span> Sedang Tayang
        </button>

        <button
          onClick={() => setActiveTab('popular')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'popular'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <span>⭐</span> Paling Populer
        </button>

        <button
          onClick={() => setActiveTab('top_rated')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'top_rated'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <span>🏆</span> Rating Tertinggi
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'upcoming'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <span>📅</span> Segera Hadir
        </button>

        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'watchlist'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <span>🔖</span> Watchlist ({watchlistCount})
        </button>
      </div>

      {/* Dropdown Filters (Genre, Year, Sort By) */}
      {activeTab !== 'watchlist' && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Genre Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-rose-400" />
              <span>Genre:</span>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                <option value="all">Semua Genre</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Tahun:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
              <span>Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset button if filter is active */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
