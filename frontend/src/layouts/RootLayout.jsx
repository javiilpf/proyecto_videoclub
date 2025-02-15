import { NavLink, Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    // Contenedor principal
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-sky-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Sección izquierda del vav */}
            <div className="flex items-center">
              {/* Título */}
              <NavLink to="/" className="text-lg font-bold">
                VideoClub
              </NavLink>
              <div className="flex space-x-4 ml-10">
                <NavLink to="/movies" className="hover:text-amber-600">
                  Películas
                </NavLink>
                <NavLink to="/search" className="hover:text-amber-600">
                  Buscar
                </NavLink>
                <NavLink to="/reviews" className="hover:text-amber-600">
                  Reseñas
                </NavLink>
                <NavLink to="/favorites" className="hover:text-amber-600">
                  Favoritos
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Contenedor principal donde colocar outlet  */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Outlet */}
        <Outlet />
      </main>
      {/* pie de página */}
      <footer className="bg-sky-950 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center">Videoclub © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
