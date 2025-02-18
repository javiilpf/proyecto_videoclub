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

export const syncMovies = async () => {
  try {
    return await fetchAPI('/movies/sync', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Error sincronizando películas:', error);
    throw error;
  }
};

// Servicios de autenticación
export const login = async (credentials) => {
  try {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Después de un login exitoso, sincronizar películas
    await syncMovies();
    
    return response;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
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