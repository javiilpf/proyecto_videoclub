import { useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { useFetch } from "../hooks/useFetch";
import { getPopularMovies } from "../services/tmdb";
import Spinner from "../components/Spinner";

const MovieList = () => {
  const [page, setPage] = useState(1);
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");

  const { data, loading, error } = useFetch(
    () => getPopularMovies(page, year, category, rating),
    [page, year, category, rating]
  );

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(newPage);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "year") setYear(value);
    if (name === "category") setCategory(value);
    if (name === "rating") setRating(value);
  };

  if (error) {
    return (
      <div className="text-center p-10">
        <h2 className="text-red-600 text-2xl font-bold">
          Error al traer las películas
        </h2>
        <p className="text-xl font-medium">{error.message}</p>
        <Link to="/" className="text-blue-600">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-sky-950">
          Listado de películas
        </h1>
        <p className="text-lg font-medium text-sky-900 mt-2">
          ¡Filtra tus películas favoritas!
        </p>
      </header>

      <section>
        <form className="flex justify-center gap-4 mb-8">
          <input
            type="number"
            name="year"
            placeholder="Año"
            value={year}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            name="category"
            placeholder="Categoría"
            value={category}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="number"
            name="rating"
            placeholder="Valoración"
            value={rating}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          
        </form>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {data?.results?.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                className="text-white px-4 py-2 rounded-lg transition-colors duration-200 bg-sky-800 hover:bg-sky-950"
                disabled={page === 1}
              >
                Anterior
              </button>
              <span>
                {page} / {data?.total_pages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                className="text-white px-4 py-2 rounded-lg transition-colors duration-200 bg-sky-800 hover:bg-sky-950"
                disabled={page === data?.total_pages}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default MovieList;