import { useState } from 'react';
import { useReview } from "../context/ReviewsContext";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const GlobalReviewForm = () => {
  const { addReview } = useReview();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      const reviewData = {
        movieId: formData.get("movieId"),
        texto: formData.get("reseña"),
        estrellas: Number(formData.get("ReviewStar"))
      };
      
      await addReview(reviewData);
      e.target.reset();
      toast.success("Reseña publicada correctamente");
      navigate(`/pelicula/${reviewData.movieId}`);
    } catch (error) {
      console.error('Error al publicar reseña:', error);
      toast.error("Error al publicar la reseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="movieId"
        placeholder="ID de la película"
        className="w-full p-2 border rounded text-gray-700"
        required
      />
      <textarea
        name="reseña"
        placeholder="Escribe tu reseña aquí"
        className="w-full p-2 border rounded text-gray-700"
        required
      />
      <select
        name="ReviewStar"
        className="w-full p-2 border rounded text-gray-700"
        required
      >
        <option value="">Selecciona una puntuación</option>
        {[1, 2, 3, 4, 5].map(num => (
          <option key={num} value={num}>
            {num} ⭐
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700 disabled:opacity-50"
      >
        {loading ? "Publicando..." : "Publicar reseña"}
      </button>
    </form>
  );
};

export default GlobalReviewForm; 