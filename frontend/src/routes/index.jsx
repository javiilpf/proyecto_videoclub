import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MovieList from '../pages/MovieList';
import MovieDetail from '../pages/MovieDetail';
import Search from '../pages/Search';
import Favorites from '../pages/Favorites';
import Reviews from '../pages/Reviews';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      
      <Route path="/peliculas" element={
        <ProtectedRoute>
          <MovieList />
        </ProtectedRoute>
      } />
      
      <Route path="/pelicula/:id" element={
        <ProtectedRoute>
          <MovieDetail />
        </ProtectedRoute>
      } />
      
      <Route path="/buscar" element={
        <ProtectedRoute>
          <Search />
        </ProtectedRoute>
      } />

      <Route path="/favoritos" element={
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      } />

      <Route path="/comentarios" element={
        <ProtectedRoute>
          <Reviews />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 