import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cinepulse_watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Error saving watchlist:', e);
    }
  }, [watchlist]);

  const toggleWatchlist = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.id === movie.id);
      if (exists) {
        return prev.filter((item) => item.id !== movie.id);
      } else {
        const itemToSave = {
          id: movie.id,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          release_date: movie.release_date || movie.first_air_date,
          vote_average: movie.vote_average,
          overview: movie.overview,
          genre_ids: movie.genre_ids || movie.genres?.map(g => g.id) || [],
          addedAt: new Date().toISOString(),
        };
        return [itemToSave, ...prev];
      }
    });
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((item) => item.id === movieId);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  return {
    watchlist,
    toggleWatchlist,
    isInWatchlist,
    clearWatchlist,
  };
}
