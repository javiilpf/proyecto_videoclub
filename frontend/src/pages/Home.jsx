import { useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { useFetch } from "../hooks/useFetch";
import { getPopularMovies } from "../services/tmdb";
import Spinner from "../components/Spinner";

const Home = () => {
  // estado para el número de página
  const [page, setPage] = useState(1);
  // me traigo la data de las películas
  const { data, loading, error } = useFetch(
    () => getPopularMovies(page),
    [page]
  );
  // que pasa con con el scroll

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(newPage);
  };

  // si hay error cargando??
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
          Bienvenido a Videoclub
        </h1>
        <p className="text-lg font-medium text-sky-900 mt-2">
          Descubre las películas más populares del momento
        </p>
      </header>
      {/* sección de películas populares */}
      <section>
        <h2 className="text-2xl font-bold text-sky-950 mb-10">
          Películas Populares
        </h2>
        {loading ? (
          <div> (<Spinner/>)</div>
        ) : (
          <>
            {/* grid de las películas */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
            xl:grid-cols-5 gap-6"
            >
              {data?.results?.map((movie) => (
                // aquí va el componente MovieCard
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            {/* Paginación  */}
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                className=" text-white px-4 py-2 rounded-lg transition-colors duration-200 bg-sky-800 hover:bg-sky-950"
                disabled={page ===1}
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

export default Home;
