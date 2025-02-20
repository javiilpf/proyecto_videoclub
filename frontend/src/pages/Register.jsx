import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const userData = {
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
      };

      if (userData.password !== userData.confirmPassword) {
        showErrorToast('Las contraseñas no coinciden');
        return;
      }

      if (userData.password.length < 6) {
        showErrorToast('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      const response = await register(userData);
      console.log('Respuesta del registro:', response);
      
      showSuccessToast('Registro exitoso');
      navigate('/login');
    } catch (error) {
      console.error('Error en registro:', error);
      showErrorToast(error.mensaje || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">Registro</h2>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-gray-300">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="text-gray-300">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-gray-300">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>

          <div className="text-center text-gray-400">
            ¿Ya tienes cuenta? <Link to="/login" className="text-sky-400 hover:text-sky-500">Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;