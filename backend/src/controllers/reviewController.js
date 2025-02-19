import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const { movieId, texto, estrellas } = req.body;
    // Temporalmente, para pruebas, usamos un ID fijo
    const userId = "65f37b83f4f6eaa8e2b2aa2a"; 

    const review = await Review.create({
      movieId,
      userId,
      texto,
      estrellas
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error creando reseña',
      error: error.message 
    });
  }
};

export const getMovieReviews = async (req, res) => {
  try {
    const { movieId } = req.params;
    console.log('Buscando reseñas para película:', movieId);
    
    const reviews = await Review.find({ movieId })
      .sort('-createdAt');

    console.log('Reseñas encontradas:', reviews);
    res.json(reviews);
  } catch (error) {
    console.error('Error en getMovieReviews:', error);
    res.status(500).json({ 
      mensaje: 'Error obteniendo reseñas',
      error: error.message 
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort('-createdAt')
      .lean();

    console.log('Total de reseñas encontradas:', reviews.length);
    res.json(reviews);
  } catch (error) {
    console.error('Error obteniendo todas las reseñas:', error);
    res.status(500).json({ 
      mensaje: 'Error obteniendo reseñas',
      error: error.message 
    });
  }
}; 