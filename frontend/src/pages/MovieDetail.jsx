import { useParams } from "react-router-dom";
import { getMovieDetails, getImageUrl, getMovieVideos } from "../services/tmdb";
import { useEffect, useState } from "react";
import { useReview } from "../context/ReviewsContext";
import ReviewForm from "../components/ReviewForm";
import { useFavorites } from "../context/FavoritesContext";

const MovieDetail = () => {
  const { id } = useParams();
  const { reviews, getMovieReviews } = useReview();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const isFavorite = favorites.some(f => f?.id === Number(id));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieData, trailerData] = await Promise.all([
          getMovieDetails(id),
          getMovieVideos(id)
        ]);
        
        setMovie(movieData);
        if (trailerData.results?.length > 0) {
          setTrailer(trailerData.results[0]);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (getMovieReviews) {
      getMovieReviews(id);
    }
  }, [id, getMovieReviews]);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(Number(id));
    } else {
      addToFavorites(movie);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return <div>No se encontró la película</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="md:flex relative">
          <div className="absolute top-2 right-2 flex items-center gap-4 z-10">
            <span className="bg-gray-900 px-3 py-1 rounded-full text-yellow-400 flex items-center">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
            <button
              onClick={handleFavoriteClick}
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

        {trailer && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Trailer</h3>
            <iframe
              className="w-full h-64 md:h-96 rounded-lg"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Movie Trailer"
              allowFullScreen
            ></iframe>
          </div>
        )}

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
      </div>
    </div>
  );
};

export default MovieDetail;