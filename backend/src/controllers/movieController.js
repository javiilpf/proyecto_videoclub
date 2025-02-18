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
      results: movies.map(movie => ({
        id: movie.tmdbId,
        title: movie.titulo,
        overview: movie.descripcion,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.fecha_lanzamiento,
        vote_average: movie.puntuacion,
        popularity: movie.popularidad,
        genres: movie.generos
      })),
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
    
    // Transformar al formato esperado por el frontend
    const movieResponse = {
      id: movie.tmdbId,
      title: movie.titulo,
      overview: movie.descripcion,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.fecha_lanzamiento,
      vote_average: movie.puntuacion,
      popularity: movie.popularidad,
      genres: movie.generos,
      videos: movie.videos
    };
    
    res.json(movieResponse);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error obteniendo película', 
      error: error.message 
    });
  }
};

export const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    const movies = await Movie.find({
      $or: [
        { titulo: { $regex: query, $options: 'i' } },
        { descripcion: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.json({
      results: movies.map(movie => ({
        id: movie.tmdbId,
        title: movie.titulo,
        overview: movie.descripcion,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.fecha_lanzamiento,
        vote_average: movie.puntuacion,
        popularity: movie.popularidad
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error buscando películas', 
      error: error.message 
    });
  }
};