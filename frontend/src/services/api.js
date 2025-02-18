import { API_URL } from '../config/api.config';

// Función auxiliar para manejar las peticiones
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Importante para las cookies
    });

    if (!response.ok) {
      throw new Error('Error en la petición');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Servicios para películas
export const getPopularMoviesFromDB = async (page = 1) => {
  return fetchAPI(`/movies/popular?page=${page}`);
};

export const getMovieDetailsFromDB = async (id) => {
  return fetchAPI(`/movies/${id}`);
};

// Servicios de autenticación
export const login = async (credentials) => {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const register = async (userData) => {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const logout = async () => {
  return fetchAPI('/auth/logout', {
    method: 'POST',
  });
};

export const syncMovies = async () => {
  return fetchAPI('/movies/sync', {
    method: 'POST'
  });
}; 