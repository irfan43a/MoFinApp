import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import MovieGrid from './components/MovieGrid';
import MovieDetailModal from './components/MovieDetailModal';
import TrailerModal from './components/TrailerModal';
import SettingsModal from './components/SettingsModal';
import Footer from './components/Footer';

import { 
  fetchTrending, fetchNowPlaying, fetchPopular, 
  fetchTopRated, fetchUpcoming, searchMovies, 
  discoverMovies, fetchGenres, fetchMovieDetails 
} from './services/tmdb';
import { useDebounce } from './hooks/useDebounce';
import { useWatchlist } from './hooks/useWatchlist';
import { AlertCircle, Film, RefreshCw } from 'lucide-react';

export default function App() {
  // Navigation & tabs
  const [activeTab, setActiveTab] = useState('trending');
  
  // Search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 400);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('popularity.desc');

  // Movie lists & metadata
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Loading & error states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Modals state
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [trailerData, setTrailerData] = useState(null); // { key, title }
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Watchlist hook
  const { watchlist, toggleWatchlist, isInWatchlist } = useWatchlist();

  // Load genres on initial mount
  useEffect(() => {
    fetchGenres()
      .then((data) => {
        if (data?.genres) setGenres(data.genres);
      })
      .catch((err) => {
        console.error('Error fetching genres:', err);
      });
  }, []);

  // Fetch featured banner movies (Trending)
  useEffect(() => {
    fetchTrending('day', 1)
      .then((data) => {
        if (data?.results) {
          setFeaturedMovies(data.results.slice(0, 8));
        }
      })
      .catch((err) => {
        console.error('Error fetching featured trending:', err);
      });
  }, []);

  // Main movie fetch logic
  const loadMovies = useCallback(async (isInitial = true, targetPage = 1) => {
    if (isInitial) {
      setIsLoading(true);
      setApiError(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      let data = null;

      // 1. If user is in Watchlist tab
      if (activeTab === 'watchlist') {
        let filtered = [...watchlist];
        if (debouncedQuery.trim()) {
          filtered = filtered.filter((m) =>
            m.title?.toLowerCase().includes(debouncedQuery.toLowerCase())
          );
        }
        if (selectedGenre !== 'all') {
          filtered = filtered.filter((m) =>
            m.genre_ids?.includes(Number(selectedGenre))
          );
        }
        setMovies(filtered);
        setTotalPages(1);
        setTotalResults(filtered.length);
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      // 2. If user searched with text
      if (debouncedQuery.trim() !== '') {
        const yearParam = selectedYear !== 'all' ? selectedYear : null;
        data = await searchMovies(debouncedQuery.trim(), targetPage, yearParam);
      } 
      // 3. If user applied custom filters (genre, custom year, or custom sorting)
      else if (selectedGenre !== 'all' || selectedYear !== 'all' || sortBy !== 'popularity.desc') {
        data = await discoverMovies({
          genreId: selectedGenre,
          year: selectedYear,
          sortBy: sortBy,
          page: targetPage,
        });
      }
      // 4. Standard category tabs
      else {
        switch (activeTab) {
          case 'trending':
            data = await fetchTrending('day', targetPage);
            break;
          case 'now_playing':
            data = await fetchNowPlaying(targetPage);
            break;
          case 'popular':
            data = await fetchPopular(targetPage);
            break;
          case 'top_rated':
            data = await fetchTopRated(targetPage);
            break;
          case 'upcoming':
            data = await fetchUpcoming(targetPage);
            break;
          default:
            data = await fetchTrending('day', targetPage);
        }
      }

      if (data && data.results) {
        if (isInitial) {
          setMovies(data.results);
        } else {
          setMovies((prev) => [...prev, ...data.results]);
        }
        setPage(data.page || targetPage);
        setTotalPages(data.total_pages || 1);
        setTotalResults(data.total_results || data.results.length);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setApiError(err.message || 'Gagal memuat data dari server TMDB. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [activeTab, debouncedQuery, selectedGenre, selectedYear, sortBy, watchlist]);

  // Trigger data fetch on relevant parameter changes
  useEffect(() => {
    setPage(1);
    loadMovies(true, 1);
  }, [activeTab, debouncedQuery, selectedGenre, selectedYear, sortBy]);

  // Load more pagination handler
  const handleLoadMore = () => {
    if (page < totalPages && !isLoadingMore) {
      const nextPage = page + 1;
      loadMovies(false, nextPage);
    }
  };

  // Play trailer handler
  const handlePlayTrailer = async (movie) => {
    try {
      // Fetch details with videos if not already present
      const details = await fetchMovieDetails(movie.id);
      const trailer = details?.videos?.results?.find(
        (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
      );
      setTrailerData({
        key: trailer ? trailer.key : null,
        title: movie.title || movie.name,
      });
    } catch (err) {
      console.error('Error loading trailer:', err);
      setTrailerData({
        key: null,
        title: movie.title || movie.name,
      });
    }
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setSelectedGenre('all');
    setSelectedYear('all');
    setSortBy('popularity.desc');
    setSearchQuery('');
  };

  // Determine section heading
  let activeTabTitle = 'Film Sedang Tren';
  if (debouncedQuery.trim()) {
    activeTabTitle = `Hasil Pencarian: "${debouncedQuery}"`;
  } else if (activeTab === 'now_playing') {
    activeTabTitle = 'Sedang Tayang di Bioskop (Now Playing)';
  } else if (activeTab === 'popular') {
    activeTabTitle = 'Film Paling Populer Saat Ini';
  } else if (activeTab === 'top_rated') {
    activeTabTitle = 'Film dengan Rating Tertinggi';
  } else if (activeTab === 'upcoming') {
    activeTabTitle = 'Film Segera Hadir di Bioskop';
  } else if (activeTab === 'watchlist') {
    activeTabTitle = 'Watchlist Film Saya';
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (searchQuery) setSearchQuery('');
        }}
        watchlistCount={watchlist.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Hero Banner: only show on Home/Trending when not actively searching */}
        {activeTab === 'trending' && !searchQuery.trim() && (
          <HeroBanner
            featuredMovies={featuredMovies}
            onSelectMovie={(id) => setSelectedMovieId(id)}
            onPlayTrailer={handlePlayTrailer}
            isInWatchlist={isInWatchlist}
            toggleWatchlist={toggleWatchlist}
          />
        )}

        {/* Real-Time Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalResults={totalResults}
          isSearching={isLoading}
        />

        {/* Filter Bar (Categories, Genre, Year, Sort) */}
        <FilterBar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (searchQuery) setSearchQuery('');
          }}
          genres={genres}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onResetFilters={handleResetFilters}
          watchlistCount={watchlist.length}
        />

        {/* Error Alert if API error occurs */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{apiError}</span>
            </div>
            <button
              onClick={() => loadMovies(true, 1)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Movies Grid */}
        <MovieGrid
          movies={movies}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          hasMore={page < totalPages && activeTab !== 'watchlist'}
          onSelectMovie={(id) => setSelectedMovieId(id)}
          onPlayTrailer={handlePlayTrailer}
          isInWatchlist={isInWatchlist}
          toggleWatchlist={toggleWatchlist}
          activeTabTitle={activeTabTitle}
          onReset={handleResetFilters}
        />
      </main>

      {/* Movie Details Modal */}
      {selectedMovieId && (
        <MovieDetailModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          onPlayTrailer={handlePlayTrailer}
          isInWatchlist={isInWatchlist}
          toggleWatchlist={toggleWatchlist}
          onSelectMovie={(id) => setSelectedMovieId(id)}
        />
      )}

      {/* Trailer Video Player Modal */}
      {trailerData && (
        <TrailerModal
          trailerKey={trailerData.key}
          movieTitle={trailerData.title}
          onClose={() => setTrailerData(null)}
        />
      )}

      {/* Settings & API Key Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsSaved={() => {
          loadMovies(true, 1);
          fetchGenres().then((data) => data?.genres && setGenres(data.genres));
        }}
      />

      {/* Footer */}
      <Footer onSelectCategory={(tab) => setActiveTab(tab)} />
    </div>
  );
}
