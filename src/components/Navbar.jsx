// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCaretDown, FaBars, FaTimes } from 'react-icons/fa';
import { API_URL } from '../services/api';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Para menú móvil
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile();
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/usuarios/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener el perfil del usuario');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const photoBase64 = user?.photos?.[0] || user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>Swipe UTNG</span>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            {isLoggedIn ? (
              <>
               <Link
                  to="/matches-mutual"
                  className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition duration-300 relative group"
                >
                   Swipes
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition duration-300 relative group"
                >
                   Carreras
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all group-hover:w-full"></span>
                </Link>
               
                <Link
                  to="/profile"
                  className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition duration-300 relative group"
                >
                   Perfil
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all group-hover:w-full"></span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 font-medium transition duration-300 relative group"
                >
                   Cerrar sesión
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all group-hover:w-full"></span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition duration-300 relative group"
                >
                   Iniciar sesión
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition duration-300 relative group"
                >
                   Registrarse
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all group-hover:w-full"></span>
                </Link>
              </>
            )}
          </nav>

          {/* Perfil con dropdown (Desktop) */}
          {isLoggedIn && user && (
            <div className="hidden md:flex relative items-center space-x-2">
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer ring-2 ring-purple-200 dark:ring-purple-800"
                onClick={toggleDropdown}
              >
                {photoBase64 ? (
                  <img src={photoBase64} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  user.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <span
                className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
                onClick={toggleDropdown}
              >
                Hola, {user.name?.split(' ')[0]}
              </span>
              <FaCaretDown
                className={`text-gray-600 dark:text-gray-300 cursor-pointer transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                onClick={toggleDropdown}
              />

              {/* Menú desplegable */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-14 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-700 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                       Mi perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-700 transition text-left"
                    >
                       Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-gray-200 focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Línea decorativa */}
      <div className="h-0.5 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 dark:from-purple-900 dark:via-pink-900 dark:to-purple-900"></div>

      {/* Menú móvil desplegable */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                     Carreras
                  </Link>
                  <Link
                    to="/matches-mutual"
                    className="text-gray-700 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                     Matches
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                     Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 dark:text-gray-200 py-2"
                  >
                     Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-700 dark:text-gray-200 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}




