import { useState } from 'react';
import { useReview } from "../context/ReviewsContext";
import { useToast } from "../context/ToastContext";

const ReviewForm = ({ movieId }) => {
  const { addReview } = useReview();
  const [loading, setLoading] = useState(false);
  const { toastReviewMessage, showErrorToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      const reviewData = {
        movieId: movieId,
        texto: formData.get("reseña"),
        estrellas: Number(formData.get("ReviewStar"))
      };
      
      await addReview(reviewData);
      e.target.reset();
      toastReviewMessage();
    } catch (error) {
      console.error('Error al publicar reseña:', error);
      showErrorToast("Error al publicar la reseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <select 
        name="ReviewStar" 
        className="p-2 border rounded text-gray-700"
        required
      >
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1} ⭐
          </option>
        ))}
      </select>
      
      <textarea 
        name="reseña" 
        placeholder="Escribe tu reseña aquí" 
        className="p-2 border rounded text-gray-700"
        required
      />
      
      <button 
        type="submit" 
        disabled={loading}
        className="bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700 disabled:opacity-50"
      >
        {loading ? "Publicando..." : "Publicar reseña"}
      </button>
    </form>
  );
};

export default ReviewForm; 