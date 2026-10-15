// TMDB API Service
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Default public working key; user can also override in Settings
export const DEFAULT_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

export const getApiKey = () => {
  return localStorage.getItem('tmdb_api_key') || DEFAULT_API_KEY;
};

export const setApiKey = (key) => {
  if (key && key.trim()) {
    localStorage.setItem('tmdb_api_key', key.trim());
  } else {
    localStorage.removeItem('tmdb_api_key');
  }
};

export const getLanguage = () => {
  return localStorage.getItem('tmdb_language') || 'id-ID';
};

export const setLanguage = (lang) => {
  localStorage.setItem('tmdb_language', lang);
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'original') => {
  if (!path) return 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1280&auto=format&fit=crop&q=80';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getProfileUrl = (path, size = 'w185') => {
  if (!path) return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=185&auto=format&fit=crop&q=80';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

async function tmdbFetch(endpoint, params = {}) {
  const apiKey = getApiKey();
  const language = getLanguage();
  
  const queryParams = new URLSearchParams({
    api_key: apiKey,
    language: language,
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.status_message || `HTTP error! Status: ${response.status}`);
  }
  
  return await response.json();
}

export const fetchTrending = async (timeWindow = 'day', page = 1) => {
  return await tmdbFetch(`/trending/movie/${timeWindow}`, { page });
};

export const fetchNowPlaying = async (page = 1) => {
  return await tmdbFetch('/movie/now_playing', { page });
};

export const fetchPopular = async (page = 1) => {
  return await tmdbFetch('/movie/popular', { page });
};

export const fetchTopRated = async (page = 1) => {
  return await tmdbFetch('/movie/top_rated', { page });
};

export const fetchUpcoming = async (page = 1) => {
  return await tmdbFetch('/movie/upcoming', { page });
};

export const searchMovies = async (query, page = 1, year = null) => {
  const params = { query, page, include_adult: false };
  if (year) params.primary_release_year = year;
  return await tmdbFetch('/search/movie', params);
};

export const discoverMovies = async ({ genreId, year, sortBy = 'popularity.desc', page = 1 }) => {
  const params = {
    page,
    sort_by: sortBy,
    include_adult: false,
  };
  if (genreId && genreId !== 'all') {
    params.with_genres = genreId;
  }
  if (year && year !== 'all') {
    params.primary_release_year = year;
  }
  return await tmdbFetch('/discover/movie', params);
};

export const fetchMovieDetails = async (movieId) => {
  return await tmdbFetch(`/movie/${movieId}`, {
    append_to_response: 'videos,credits,similar,reviews',
  });
};

export const fetchGenres = async () => {
  return await tmdbFetch('/genre/movie/list');
};

export const checkApiKeyValidity = async (key) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${key}&page=1`);
    return response.ok;
  } catch {
    return false;
  }
};
