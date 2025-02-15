import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { useFavorites } from "../context/FavoritesContext";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const { removeFromFavorites } = useFavorites();
  
  const getFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favorites);
  };

  useEffect(() => {
    getFavorites();
  }, []);

  const handleRemoveFavorite = (movieId) => {
    removeFromFavorites(movieId);
    setFavorites(prevFavorites => prevFavorites.filter(movie => movie.id !== movieId));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center">Mis Películas Favoritas</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {favorites.length > 0 ? (
          favorites.map((favorite) => (
            <MovieCard 
              key={favorite.id} 
              movie={favorite} 
              onRemove={() => handleRemoveFavorite(favorite.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No tienes películas favoritas
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;