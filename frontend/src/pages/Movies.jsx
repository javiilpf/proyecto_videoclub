import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularMovies, getImageUrl, getGenres } from '../services/tmdb';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: '',
    rating: '',
    genre: ''
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getPopularMovies(filters);
        setMovies(data.results);
      } catch (error) {
        console.error('Error cargando películas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [name]: value
      };
      console.log('Nuevos filtros:', newFilters);
      return newFilters;
    });
  };

  if (loading) return <div className="text-center py-8">Cargando películas...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Películas Populares</h1>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          className="bg-gray-700 text-white rounded px-3 py-2"
        >
          <option value="">Todos los años</option>
          {[...Array(10)].map((_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        <select
          name="rating"
          value={filters.rating}
          onChange={handleFilterChange}
          className="bg-gray-700 text-white rounded px-3 py-2"
        >
          <option value="">Todas las puntuaciones</option>
          <option value="7">⭐ 7+</option>
          <option value="8">⭐ 8+</option>
          <option value="9">⭐ 9+</option>
        </select>

        <select
          name="genre"
          value={filters.genre}
          onChange={handleFilterChange}
          className="bg-gray-700 text-white rounded px-3 py-2"
        >
          <option value="">Todos los géneros</option>
          <option value="28">Acción</option>
          <option value="12">Aventura</option>
          <option value="16">Animación</option>
          <option value="35">Comedia</option>
          <option value="80">Crimen</option>
          <option value="99">Documental</option>
          <option value="18">Drama</option>
          <option value="14">Fantasía</option>
          <option value="27">Terror</option>
          <option value="10749">Romance</option>
          <option value="878">Ciencia ficción</option>
        </select>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron películas con los filtros seleccionados
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map(movie => (
            <Link 
              key={movie.id}
              to={`/pelicula/${movie.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-white mb-2">{movie.title}</h2>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-400">{new Date(movie.release_date).getFullYear()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies; 