import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdb";
import { useFavorites } from "../context/FavoritesContext";

const MovieCard = ({ movie }) => {
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const isFavorite = favorites.some(f => f.id === movie.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <Link to={`/pelicula/${movie.id}`} className="block">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-auto"
          />
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-600 hover:bg-red-500'
            }`}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          <span className="absolute top-2 left-2 bg-gray-900 px-3 py-1 rounded-full text-yellow-400">
            ⭐ {movie.vote_average?.toFixed(1)}
          </span>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold text-white mb-2">{movie.title}</h2>
          <span className="text-gray-400">{new Date(movie.release_date).getFullYear()}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
