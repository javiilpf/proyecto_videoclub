import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdb";
import { useFavorites } from "../context/FavoritesContext";

const MovieCard = ({ movie, onRemove }) => {
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  const handleToggleFavorite = (e) => {
    e.preventDefault();

    if (isFavorite) {
      removeFromFavorites(movie.id);
      onRemove && onRemove();
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <article className="relative bg-sky-600 rounded-lg transform transition-transform duration-300 hover:scale-105">
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-2 left-2 py-1 px-2 rounded-full z-10 ${
          isFavorite ? "bg-red-400" : "bg-black bg-opacity-50"
        } text-white`}
      >
        {isFavorite ? "❤️" : "♡"}
      </button>

      <Link to={`/movies/${movie.id}`} className="block">
        <div className="relative aspect-[2/3]">
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white py-1 px-2 rounded">
            {rating}
          </div>
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg line-clamp-2 text-white">{movie.title}</h3>
          <p className="text-sm text-gray-300">{movie.release_date}</p>
        </div>
      </Link>
    </article>
  );
};

export default MovieCard;
