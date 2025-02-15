import Movie from '../models/Movie.js';
import * as tmdbService from '../services/tmdbService.js';

export const syncPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const tmdbMovies = await tmdbService.fetchPopularMovies(page);
    
    const moviesPromises = tmdbMovies.results.map(async (tmdbMovie) => {
      try {
        const movieDetails = await tmdbService.fetchMovieDetails(tmdbMovie.id);
        
        const movieData = {
          tmdbId: tmdbMovie.id,
          titulo: movieDetails.title,
          descripcion: movieDetails.overview,
          poster_path: movieDetails.poster_path,
          backdrop_path: movieDetails.backdrop_path,
          fecha_lanzamiento: movieDetails.release_date,
          puntuacion: movieDetails.vote_average,
          popularidad: movieDetails.popularity,
          generos: movieDetails.genres?.map(genre => ({
            id: genre.id,
            nombre: genre.name
          })) || [],
          videos: movieDetails.videos.map(video => ({
            key: video.key,
            site: video.site,
            type: video.type
          }))
        };

        return await Movie.findOneAndUpdate(
          { tmdbId: tmdbMovie.id },
          movieData,
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error(`Error procesando película ${tmdbMovie.id}:`, error);
        return null;
      }
    });

    const results = await Promise.all(moviesPromises);
    const successfulUpdates = results.filter(Boolean);
    
    res.json({ 
      mensaje: 'Películas sincronizadas correctamente',
      total: successfulUpdates.length 
    });
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ 
      mensaje: 'Error sincronizando películas', 
      error: error.message 
    });
  }
};

export const getMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find()
        .sort({ popularidad: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Movie.countDocuments()
    ]);

    res.json({
      results: movies,
      page: parseInt(page),
      total_pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error obteniendo películas', 
      error: error.message 
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: parseInt(req.params.id) });
    if (!movie) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error obteniendo película', 
      error: error.message 
    });
  }
};