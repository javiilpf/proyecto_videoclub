import axios from 'axios';

const tmdbApi = axios.create({
  baseURL: process.env.VITE_BASE_URL,
  params: {
    api_key: process.env.VITE_API_TOKEN,
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