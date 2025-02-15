import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  key: String,
  site: String,
  type: String
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
  actualizado: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Movie', movieSchema);