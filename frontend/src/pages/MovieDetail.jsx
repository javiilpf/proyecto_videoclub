import { useParams } from "react-router-dom";
import { getMovieDetails, getImageUrl } from "../services/tmdb";
import { useEffect, useState } from "react";
import { useReview } from "../context/ReviewsContext";
import ReviewForm from "../components/ReviewForm";
import { useFavorites } from "../context/FavoritesContext";

const MovieDetail = () => {
  const { id } = useParams();
  const { reviews, getMovieReviews } = useReview();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const isFavorite = favorites.some(f => f?.id === Number(id));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const movieData = await getMovieDetails(id);
        console.log('Movie Data:', movieData);
        console.log('Videos:', movieData.videos);
        setMovie(movieData);
        
        if (getMovieReviews) {
          await getMovieReviews(id);
        }
      } catch (err) {
        console.error('Error in component:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, getMovieReviews]);

  const renderTrailer = () => {
    if (!movie?.videos || movie.videos.length === 0) {
      return (
        <div className="text-center text-gray-500 p-4 bg-gray-700 rounded-lg">
          <p>No hay trailers disponibles</p>
        </div>
      );
    }

    const trailer = movie.videos[0];
    return (
      <div className="relative pt-[56.25%]">
        <iframe
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`}
          title={trailer.name}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        ></iframe>
      </div>
    );
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!movie) return <div className="text-center py-8">No se encontró la película</div>;

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="md:flex relative">
            <div className="absolute top-2 right-2 flex items-center gap-4 z-10">
              <span className="bg-gray-900 px-3 py-1 rounded-full text-yellow-400 flex items-center">
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>
              <button
                onClick={() => {
                  if (isFavorite) {
                    removeFromFavorites(Number(id));
                  } else {
                    addToFavorites(movie);
                  }
                }}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-600 hover:bg-red-500'
                }`}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-64 h-auto rounded-lg shadow-md"
            />
            <div className="md:ml-6 mt-4 md:mt-0">
              <h2 className="text-3xl font-bold text-white">{movie.title}</h2>
              <p className="text-sm text-gray-300">{movie.release_date}</p>
              <p className="mt-4 text-gray-200">{movie.overview}</p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white">Géneros</h3>
                <p className="text-gray-300">
                  {movie.genres?.map((genre) => genre.name).join(", ")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Trailer</h2>
            {renderTrailer()}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Reseñas</h3>
            <ReviewForm movieId={id} />
            {reviews?.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-200">{review.texto}</p>
                    <div className="text-yellow-400 mt-2">
                      {"⭐".repeat(review.estrellas)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No hay reseñas todavía</p>
            )}
          </div>

          {/* Reparto limitado a 6 actores */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Reparto Principal</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {movie.cast.map(actor => (
                  <div key={actor.id} className="text-center">
                    <img
                      src={actor.profile_path ? getImageUrl(actor.profile_path) : '/placeholder.png'}
                      alt={actor.name}
                      className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
                    />
                    <h3 className="font-semibold text-white">{actor.name}</h3>
                    <p className="text-sm text-gray-400">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;