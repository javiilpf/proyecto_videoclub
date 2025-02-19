import { useEffect } from 'react';
import { useReview } from '../context/ReviewsContext';
import { Link } from 'react-router-dom';

const Reviews = () => {
  const { reviews, getAllReviews } = useReview();

  useEffect(() => {
    getAllReviews();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Todos los Comentarios</h1>
      <div className="grid gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-300">Usuario Anónimo</span>
                  <span className="text-yellow-400">{review.estrellas} ⭐</span>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-200 mb-4">{review.texto}</p>
              <Link 
                to={`/pelicula/${review.movieId}`}
                className="text-sky-400 hover:text-sky-500"
              >
                Ver película
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-300">No hay comentarios todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;