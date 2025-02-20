import Movie from '../models/Movie.js';
import * as tmdbService from '../services/tmdbService.js';

export const syncPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const tmdbMovies = await tmdbService.fetchPopularMovies(page);
    
    const moviesPromises = tmdbMovies.results.map(async (tmdbMovie) => {
      try {
        const [movieDetails, credits] = await Promise.all([
          tmdbService.fetchMovieDetails(tmdbMovie.id),
          tmdbService.fetchMovieCredits(tmdbMovie.id)
        ]);
        
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
          videos: movieDetails.videos
            .filter(video => video.type === "Trailer" && video.site === "YouTube")
            .map(video => ({
              key: video.key,
              site: video.site,
              type: video.type
            })),
          reparto: credits.cast.slice(0, 10).map(actor => ({
            id: actor.id,
            name: actor.name,
            character: actor.character,
            profile_path: actor.profile_path
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
      // Si no está en nuestra base de datos, intentamos obtenerla de TMDB
      const [movieDetails, credits] = await Promise.all([
        tmdbService.fetchMovieDetails(req.params.id),
        tmdbService.fetchMovieCredits(req.params.id)
      ]);
      
      const movieData = {
        tmdbId: parseInt(req.params.id),
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
        videos: movieDetails.videos
          .filter(video => video.type === "Trailer" && video.site === "YouTube")
          .slice(0, 1),
        reparto: credits.cast.slice(0, 6)
      };

      const newMovie = await Movie.create(movieData);
      return res.json(movieData);
    }
    
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
      videos: movie.videos.filter(video => video.type === "Trailer").slice(0, 1),
      cast: movie.reparto.slice(0, 6)
    };
    
    res.json(movieResponse);
  } catch (error) {
    console.error('Error obteniendo película:', error);
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