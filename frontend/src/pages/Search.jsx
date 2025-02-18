import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../services/tmdb";
import MovieCard from "../components/MovieCard";

const Search = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const data = await searchMovies(search);
      if (data && data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError(err.message || 'Error en la búsqueda');
      console.error('Error searching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Buscar película</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar película"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
            minLength={2}
            required
          />
          <button
            type="submit"
            className="bg-sky-700 text-white hover:bg-sky-600 px-4 py-2 rounded-lg disabled:opacity-50"
            disabled={loading || !search.trim()}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>
      
      {loading && <div className="text-center mt-8">Buscando películas...</div>}
      {error && (
        <div className="text-red-500 text-center mt-8">
          Error: {error}
        </div>
      )}
      
      <div className="mt-6">
        {!loading && !error && results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : !loading && !error && (
          <p className="text-center">No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
};

export default Search;