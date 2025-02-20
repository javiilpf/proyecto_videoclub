import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  key: String,
  site: String,
  type: String
}, { _id: false });

const actorSchema = new mongoose.Schema({
  id: Number,
  name: String,
  character: String,
  profile_path: String
}, { _id: false });

const movieSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true, unique: true },
  titulo: { type: String, required: true },
  descripcion: String,
  poster_path: String,
  backdrop_path: String,
  fecha_lanzamiento: Date,
  puntuacion: Number,
  popularidad: Number,
  generos: [{
    id: Number,
    nombre: String
  }],
  videos: [videoSchema],
  reparto: [actorSchema]
}, {
  timestamps: true
});

// Limpiar modelos existentes
if (mongoose.models.Movie) {
  delete mongoose.models.Movie;
}

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;