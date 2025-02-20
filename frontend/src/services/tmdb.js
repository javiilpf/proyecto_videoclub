import { getPopularMoviesFromDB, getMovieDetailsFromDB } from './api';

const VITE_API_TOKEN = import.meta.env.VITE_API_TOKEN;
const VITE_BASE_URL = 'https://api.themoviedb.org/3';
const VITE_BASE_IMAGE_URL = 'https://image.tmdb.org/t/p';

// objeto que me permite decidir el tamaño de las imágenes
export const IMAGES_SIZES = {
  POSTER: "w500",
  BACKDROP: "original",
};

// ------------- FUNCIONES QUE VOY A CREAR PARA LA API -------------
// función para obtener la url de una imagen
// le paso un path : /sssss
export const getImageUrl = (path, size = IMAGES_SIZES.POSTER) => {
  if (!path) return "/placeholder-movie.jpg";
  return `${VITE_BASE_IMAGE_URL}/${size}${path}`;
};

const fetchFromAPI = async (endpoint, options = {}) => {
  try {
    let url = `${VITE_BASE_URL}${endpoint}?api_key=${VITE_API_TOKEN}&language=es-ES`;
    
    // Añadir parámetros adicionales si existen
    if (Object.keys(options).length > 0) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options)) {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      }
      url += `&${params.toString()}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en fetchFromAPI:', error);
    throw new Error('Error al obtener datos de TMDB');
  }
};

// función para obtener las películas populares

export const getPopularMovies = async (page = 1, filters = {}) => {
  try {
    const options = {
      page,
      sort_by: 'popularity.desc',
      ...filters.year && { primary_release_year: filters.year },
      ...filters.rating && { 'vote_average.gte': filters.rating },
      ...filters.genre && { with_genres: filters.genre }
    };

    const data = await fetchFromAPI('/discover/movie', options);
    return data;
  } catch (error) {
    console.error('Error obteniendo películas populares:', error);
    throw error;
  }
};

// función para obtener todas las películas

export const getAllMovies = async (page = 1) => {
  try {
    return await fetchFromAPI("/movie/sync", {
      method: "POST",
      params: { page }
    });
  } catch (error) {
    console.error('Error obteniendo todas las películas:', error);
    throw error;
  }
};

// detalles de las películas

export const getMovieDetails = async (movieId) => {
  try {
    const [movieDetails, videosResponse] = await Promise.all([
      fetchFromAPI(`/movie/${movieId}`),
      fetchFromAPI(`/movie/${movieId}/videos`)
    ]);

    const trailers = videosResponse.results?.filter(
      video => video.site === "YouTube" && video.type === "Trailer"
    ) || [];

    return {
      ...movieDetails,
      videos: trailers
    };
  } catch (error) {
    console.error('Error obteniendo detalles:', error);
    throw error;
  }
};

// búsqueda de una película por un query de busqueda

export const searchMovies = async (query) => {
  try {
    return await fetchFromAPI('/search/movie', { query });
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    throw error;
  }
};

export const getMovieVideos = async (movieId) => {
  try {
    return await fetchFromAPI(`/movie/${movieId}/videos`);
  } catch (error) {
    console.error('Error obteniendo videos:', error);
    throw error;
  }
};
