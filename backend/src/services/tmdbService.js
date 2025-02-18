import axios from 'axios';
import { config } from '../config/config.js';

const tmdbApi = axios.create({
  baseURL: config.TMDB_BASE_URL,
  params: {
    api_key: config.TMDB_API_KEY,
    language: 'es-ES'
  }
});

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', { params: { page } });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo películas populares:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const [movieDetails, videosResponse] = await Promise.all([
      tmdbApi.get(`/movie/${movieId}`),
      tmdbApi.get(`/movie/${movieId}/videos`)
    ]);

    const videos = videosResponse.data.results || [];

    return {
      ...movieDetails.data,
      videos: videos.filter(video => video.site === 'YouTube')
    };
  } catch (error) {
    console.error('Error obteniendo detalles de película:', error);
    throw error;
  }
};