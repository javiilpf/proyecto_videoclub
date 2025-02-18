import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Toaster } from "sonner";
import ReviewsProvider from "./context/ReviewsContext";
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';
import { syncMovies } from './services/api';

const App = () => {
  useEffect(() => {
    const syncMoviesData = async () => {
      try {
        await syncMovies();
        console.log('Películas sincronizadas correctamente');
      } catch (error) {
        console.error('Error sincronizando películas:', error);
      }
    };
    
    syncMoviesData();
  }, []);

  return (
    <AuthProvider>
      <FavoritesProvider>
        <ReviewsProvider>
          <Toaster position="top-right" duration={2000}/>
          <RouterProvider router={router}/>
        </ReviewsProvider>
      </FavoritesProvider>
    </AuthProvider>
  ) ;
};

export default App;
