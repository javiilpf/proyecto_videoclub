import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Toaster } from "sonner";
import ReviewsProvider from "./context/ReviewsContext";
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ReviewsProvider>
          <Toaster position="top-right" duration={2000}/>
          <RouterProvider router={router}/>
        </ReviewsProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;
