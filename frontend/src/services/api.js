const API_URL = 'http://localhost:3000/api';

// Función auxiliar para manejar las peticiones
export const fetchAPI = async (endpoint, options = {}) => {
  try {
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    console.log('Fetching:', `${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...options
    });

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    });

    console.log('Response status:', response.status);

    // Para endpoints de verificación, manejamos el 401 de forma especial
    if (endpoint === '/auth/verify' && response.status === 401) {
      return { authenticated: false };
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Error en la petición');
    }

    return response.json();
  } catch (error) {
    if (endpoint === '/auth/verify') {
      return { authenticated: false };
    }
    console.error('Error en fetchAPI:', error);
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
  return fetchAPI('/movies/sync', {
    method: 'POST'
  });
};

export const getAllMovies = async (page = 1) => {
  return fetchAPI(`/movies?page=${page}`);
};

// Servicios de autenticación
export const login = async (credentials) => {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const verifyAuth = async () => {
  return fetchAPI('/auth/verify');
};

export const register = async (userData) => {
  const { confirmPassword, ...registerData } = userData; // Eliminamos confirmPassword
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(registerData)
  });
};

export const logout = async () => {
  return fetchAPI('/auth/logout', {
    method: 'POST'
  });
};

// Funciones específicas para reseñas
export const getMovieReviews = async (movieId) => {
  return fetchAPI(`/reviews/${movieId}`);
};

export const createReview = async (reviewData) => {
  return fetchAPI('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
};

export const getAllReviews = async () => {
  return fetchAPI('/reviews/all');
}; 