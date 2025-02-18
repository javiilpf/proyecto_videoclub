import { getPopularMoviesFromDB, getMovieDetailsFromDB } from './api';

const VITE_API_TOKEN = import.meta.env.VITE_API_TOKEN;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
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
    const response = await fetch(
      `${VITE_BASE_URL}${endpoint}?api_key=${VITE_API_TOKEN}&language=es-ES&${new URLSearchParams(
        options
      )}`
    );
    if (!response.ok) {
      throw new Error("Error en la petición");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    // throw new Error("Error en la petición");
    return error;
  }
};

// función para obtener las películas populares

export const getPopularMovies = async (page = 1) => {
  try {
    // Primero intenta obtener del backend
    return await getPopularMoviesFromDB(page);
  } catch (error) {
    // Si falla, usa la API de TMDB directamente
    console.log('Fallback a TMDB API');
    return fetchFromAPI("/movie/popular", { page });
  }
};

// detalles de las películas

export const getMovieDetails = async (id) => {
  try {
    // Primero intenta obtener del backend
    return await getMovieDetailsFromDB(id);
  } catch (error) {
    // Si falla, usa la API de TMDB directamente
    console.log('Fallback a TMDB API');
    return fetchFromAPI(`/movies/${id}`);
  }
};

// búsqueda de una película por un query de busqueda

export const searchMovies = async (query, page = 1) => {
  try {
    return await fetchFromAPI("/search/movie", { query, page });
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    throw new Error('Error al buscar películas');
  }
};

export const getMovieVideos = async (id) => {
  return fetchFromAPI(`/movie/${id}/videos`);
};
