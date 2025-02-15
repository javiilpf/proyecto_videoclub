import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Toaster } from "sonner";
import ReviewsProvider from "./context/ReviewsContext";

const App = () => {

  return (
    // aquí podríamos poner cualquier contexto que necesitemos
    <FavoritesProvider >
      <ReviewsProvider>
        <Toaster position="top-right" duration={2000}/>
        <RouterProvider router={router}/>
      </ReviewsProvider>
  </FavoritesProvider>

  ) ;
};

export default App;
