import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);
    const { showFavoriteAddedToast, showFavoriteRemovedToast, showErrorToast } = useToast();

    // Cargar favoritos desde localStorage al iniciar
    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    const addToFavorites = (movie) => {
        if (favorites.some(m => m?.id === movie.id)) {
            showErrorToast("La película ya está en favoritos");
            return;
        }

        const updatedFavorites = [...favorites, movie];
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        showFavoriteAddedToast();
    };

    const removeFromFavorites = (movieId) => {
        const updatedFavorites = favorites.filter(m => m.id !== movieId);
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        showFavoriteRemovedToast();
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error("useFavorites debe ser usado dentro de un FavoritesProvider");
    }
    return context;
};