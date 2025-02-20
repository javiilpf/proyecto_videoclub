import { createContext, useContext, useState, useCallback } from "react";
import { createReview, getAllReviews as fetchAllReviews } from "../services/api.js";

const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  const addReview = async (reviewData) => {
    try {
      const response = await createReview(reviewData);
      setReviews(prev => [...prev, response]);
      return response;
    } catch (error) {
      console.error('Error añadiendo reseña:', error);
      throw error;
    }
  };

  const getMovieReviews = useCallback(async (movieId) => {
    try {
      const response = await fetch(`/api/reviews/${movieId}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, []);

  const getAllReviews = async () => {
    try {
      const allReviews = await fetchAllReviews();
      setReviews(allReviews);
      return allReviews;
    } catch (error) {
      console.error('Error obteniendo todas las reseñas:', error);
      throw error;
    }
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, getMovieReviews, getAllReviews }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReview debe estar dentro del proveedor ReviewsContext");
  }
  return context;
};

export default ReviewsProvider;