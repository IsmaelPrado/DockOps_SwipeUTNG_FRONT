import { useState } from 'react';
import { motion } from 'framer-motion';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(['']);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      // Aquí acceso directo a res.token y res.user (no res.data)
      localStorage.setItem('token', res.token);
      toast.success('Inicio de sesión exitoso');
      navigate('/matches-mutual');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      const message = err?.response?.data?.message || 'Error al iniciar sesión';
      const errors = err?.response?.data?.errors || [];

      setError(errors.length > 0 ? errors : message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-700 to-pink-700 text-white p-8 text-center">
            <h2 className="text-3xl font-bold">Iniciar sesión</h2>
            <p className="text-purple-200 mt-2">¡Bienvenido de nuevo!</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900 border border-red-700 text-red-300 text-sm p-3 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@utng.edu.mx"
                className="w-full p-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </motion.button>
          </form>

          <div className="bg-gray-800 px-8 py-6 text-center border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-semibold text-purple-400 hover:text-purple-300 transition"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="text-center text-gray-500 text-sm py-4">
        © 2025 Swipe UTNG — Conectando estudiantes de la UTNG
      </footer>
    </div>
  );
}
