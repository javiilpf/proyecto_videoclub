import { useState } from 'react';

const MovieFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    year: '',
    rating: '',
    genre: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex gap-4 mb-6">
      <select
        name="year"
        value={filters.year}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="">Año</option>
        {Array.from({ length: 24 }, (_, i) => 2024 - i).map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <select
        name="rating"
        value={filters.rating}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="">Puntuación</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(rating => (
          <option key={rating} value={rating}>{rating}+</option>
        ))}
      </select>

      <select
        name="genre"
        value={filters.genre}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="">Género</option>
        <option value="28">Acción</option>
        <option value="12">Aventura</option>
        <option value="16">Animación</option>
        <option value="35">Comedia</option>
        <option value="80">Crimen</option>
        <option value="99">Documental</option>
        <option value="18">Drama</option>
        <option value="10751">Familia</option>
        <option value="14">Fantasía</option>
        <option value="36">Historia</option>
        <option value="27">Terror</option>
        <option value="10402">Música</option>
        <option value="9648">Misterio</option>
        <option value="10749">Romance</option>
        <option value="878">Ciencia ficción</option>
        <option value="10770">Película de TV</option>
        <option value="53">Suspense</option>
        <option value="10752">Bélica</option>
        <option value="37">Western</option>
      </select>
    </div>
  );
};

export default MovieFilters; 