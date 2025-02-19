import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/api';
import { toast } from 'sonner';

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      toast.success('Sesión cerrada');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            VideoClub
          </Link>
          
          <div className="flex gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/" className="hover:text-sky-400">
                  Inicio
                </Link>
                <Link to="/peliculas" className="hover:text-sky-400">
                  Películas
                </Link>
                <Link to="/buscar" className="hover:text-sky-400">
                  Buscar
                </Link>
                <Link to="/favoritos" className="hover:text-sky-400">
                  Favoritos
                </Link>
                <Link to="/comentarios" className="hover:text-sky-400">
                  Comentarios
                </Link>
                <button 
                  onClick={handleLogout}
                  className="hover:text-sky-400"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-sky-400">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="hover:text-sky-400">
                  Registro
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 