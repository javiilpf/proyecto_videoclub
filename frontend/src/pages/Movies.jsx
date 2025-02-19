import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularMovies, getImageUrl } from '../services/tmdb';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getPopularMovies();
        setMovies(data.results);
      } catch (error) {
        console.error('Error cargando películas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando películas...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Películas Populares</h1>
      
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
    </div>
  );
};

export default Movies; 