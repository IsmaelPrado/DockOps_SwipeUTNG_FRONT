import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Suponiendo que guardas un token o user en localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // o el nombre que uses
    setIsLoggedIn(false);
    navigate('/login'); // Redirigir al login después de cerrar sesión
  };

  return (
    <header className="bg-zinc-900 text-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo o nombre de la app */}
        <Link to="/" className="text-2xl font-bold text-pink-400 hover:text-pink-300 transition">
          Swipe UTNG
        </Link>

        {/* Navegación */}
        <nav className="space-x-4">
          <Link to="/dashboard" className="hover:text-pink-300 transition">
            Carreras
          </Link>
          <Link to="/matches-mutual" className="hover:text-pink-300 transition">
            Matches Mutuos
          </Link>
          <Link to="/profile" className="hover:text-pink-300 transition">
            Perfil
          </Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="hover:text-pink-300 transition">
              Cerrar sesión
            </button>
          ) : (
            <Link to="/login" className="hover:text-pink-300 transition">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
