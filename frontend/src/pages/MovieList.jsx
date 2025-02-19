import { useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { useFetch } from "../hooks/useFetch";
import { getPopularMovies } from "../services/tmdb";
import Spinner from "../components/Spinner";
import MovieFilters from '../components/MovieFilters';

const MovieList = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { data, loading, error } = useFetch(
    () => getPopularMovies(page, filters),
    [page, filters]
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Resetear a la primera página cuando cambian los filtros
  };

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(newPage);
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
        <MovieFilters onFilterChange={handleFilterChange} />

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