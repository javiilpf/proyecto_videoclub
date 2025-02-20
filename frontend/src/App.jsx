import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ReviewsProvider from './context/ReviewsContext';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <FavoritesProvider>
            <ReviewsProvider>
              <div className="min-h-screen flex flex-col bg-gray-900">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <AppRoutes />
                </main>
                <Footer />
                <Toaster position="top-right" />
              </div>
            </ReviewsProvider>
          </FavoritesProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
