import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UsuariosPorCarrera() {
  const { nombreCarrera } = useParams();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data.id);
      } catch (error) {
        console.error('Error al obtener el usuario logueado:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(
          `/api/usuarios/carrera/${encodeURIComponent(nombreCarrera)}`
        );
        setUsuarios(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [nombreCarrera]);

  const handleMatch = async (matchedUserId) => {
    if (!currentUserId) {
      alert('Debes estar logueado para hacer match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/matches',
        {
          user_id: currentUserId,
          matched_user_id: matchedUserId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('¡Match enviado!');
    } catch (error) {
      console.error('Error al hacer match:', error);
      alert('Error al hacer match');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-pink-400 mb-12">
          Usuarios de {decodeURIComponent(nombreCarrera)}
        </h1>

        {loading ? (
          <p className="text-center text-gray-400 text-lg">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">
            No hay usuarios registrados en esta carrera.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {usuarios
              .filter((user) => user.id !== currentUserId)
              .map((user) => (
                <div
                  key={user.id}
                  className="bg-gradient-to-tr from-purple-800 via-pink-700 to-red-700 p-6 rounded-3xl shadow-xl text-white flex flex-col items-center gap-4 hover:scale-105 transition-transform duration-300"
                >
                  {user.photos?.[0] ? (
                    <img
                      src={user.photos[0]}
                      alt={`${user.name} avatar`}
                      className="w-28 h-28 rounded-full object-cover border-4 border-pink-400 shadow-lg"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center text-5xl font-bold text-pink-300 shadow-lg">
                      {user.name[0].toUpperCase()}
                    </div>
                  )}

                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="italic text-pink-300 text-center">{user.career}</p>

                  <div className="flex items-center gap-2 text-lg">
                    <span>{user.age} años</span>
                    <span>
                      {user.gender === 'male'
                        ? '♂️'
                        : user.gender === 'female'
                        ? '♀️'
                        : '⚧️'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleMatch(user.id)}
                    className="mt-3 bg-pink-600 text-white font-semibold rounded-full px-7 py-2 hover:bg-pink-500 transition-colors duration-200 w-full shadow-md"
                  >
                    Match
                  </button>
                </div>
              ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            to="/matches-mutual"
            className="bg-pink-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-pink-500 transition-colors shadow-lg"
          >
            Ver Matches Mutuos
          </Link>
        </div>
      </div>
    </div>
  );
}
