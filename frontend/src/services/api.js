const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Función auxiliar para manejar las peticiones
export const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw {
        status: response.status,
        mensaje: data.mensaje || 'Error en la petición'
      };
    }

    return data;
  } catch (error) {
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
  try {
    const { confirmPassword, ...registerData } = userData;
    console.log('Datos de registro:', registerData);
    
    const response = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData)
    });
    
    return response;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
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