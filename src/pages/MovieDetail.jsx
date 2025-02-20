import { useParams } from "react-router-dom";
import { getMovieDetails, getImageUrl, getMovieVideos } from "../services/tmdb";
import { useEffect, useState } from "react";
import ReviewForm from "../components/ReviewForm";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Fetch movie details from tmdb api using movieID
  const fetchData = async () => {
    try {
      const movieData = await getMovieDetails(id);
      setMovie(movieData);
      
      if (movieData.videos && movieData.videos.length > 0) {
        setTrailer(movieData.videos[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const movieReviews = storedReviews.filter(review => review.movieId === id);
    setReviews(movieReviews);
  }, [id]);

  if (!movie) return <p>Cargando...</p>;

  return (
    <div
      className="relative bg-cover bg-center min-h-screen text-white p-6"
      style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path)})` }}
    >
      <div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <div className="mb-2 top-2 left-2 bg-black bg-opacity-50 text-white py-1 px-2 rounded">
          ❤️
        </div>
        <div className="flex flex-col md:flex-row">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-64 h-auto rounded-lg shadow-md"
          />
          <div className="md:ml-6 mt-4 md:mt-0">
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <p className="text-sm text-gray-300">{movie.release_date}</p>
            <p className="mt-4 text-gray-200">{movie.overview}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Géneros</h3>
              <p className="text-gray-300">
                {movie.genres.map((genre) => genre.name).join(", ")}
              </p>
            </div>
          </div>
        </div>
        {trailer && trailer.key && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Trailer</h3>
            <iframe
              className="w-full h-64 md:h-96 rounded-lg"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Movie Trailer"
              allowFullScreen
            ></iframe>
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold mt-6">¡Deja tu reseña!</h2>
          <div className="grid grid-cols-3 gap-4">
            <ReviewForm id={id} />
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Comentarios</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border-b py-4">
                <div className="flex items-center">
                  <div>
                    <p className="text-gray-400">{review.texto}</p>
                    <p className="text-gray-300">Puntuación: {review.estrellas}⭐️ </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No hay comentarios para esta película.</p>
          )}
        </div>
        {movie.cast && movie.cast.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Reparto</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movie.cast.map(actor => (
                <div key={actor.id} className="text-center">
                  <img
                    src={actor.profile_path ? getImageUrl(actor.profile_path) : '/placeholder.png'}
                    alt={actor.name}
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
                  />
                  <h3 className="font-semibold">{actor.name}</h3>
                  <p className="text-sm text-gray-400">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;