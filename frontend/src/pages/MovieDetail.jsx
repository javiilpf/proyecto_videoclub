import { useParams } from "react-router-dom";
import { getMovieDetails, getImageUrl, getMovieVideos } from "../services/tmdb";
import { useEffect, useState } from "react";
import ReviewForm from "../components/ReviewForm";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movie details from tmdb api using movieID
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getMovieDetails(id);
      setMovie(result);

      const trailerResult = await getMovieVideos(id);
      if (trailerResult.results && trailerResult.results.length > 0) {
        setTrailer(trailerResult.results[0]);
      } else {
        console.log("No se encontró ningún trailer");
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching movie:', err);
    } finally {
      setLoading(false);
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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>No se encontró la película</p>;

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
                {movie.genres?.map((genre) => genre.name).join(", ")}
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
      </div>
    </div>
  );
};

export default MovieDetail;