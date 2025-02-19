import { createContext, useContext, useState } from "react";
import { createReview, getMovieReviews as fetchMovieReviews, getAllReviews as fetchAllReviews } from "../services/api.js";

const ReviewsContext = createContext();

const ReviewsProvider = ({ children }) => {
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

  const getMovieReviews = async (movieId) => {
    try {
      const movieReviews = await fetchMovieReviews(movieId);
      setReviews(movieReviews);
      return movieReviews;
    } catch (error) {
      console.error('Error obteniendo reseñas:', error);
      throw error;
    }
  };

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