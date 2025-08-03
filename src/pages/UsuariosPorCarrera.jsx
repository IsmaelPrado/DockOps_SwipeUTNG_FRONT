// src/pages/UsuariosPorCarrera.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

export default function UsuariosPorCarrera() {
  const { nombreCarrera } = useParams();
  const decodedCarrera = decodeURIComponent(nombreCarrera);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Matches mutuos para barra lateral
  const [matchesMutuos, setMatchesMutuos] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filtros
  const [filters, setFilters] = useState({
    gender: '',
    minAge: 18,
    maxAge: 35,
  });

  const navigate = useNavigate();

  // Obtener usuario actual
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data.id);
      } catch (error) {
        console.error('Error al obtener el usuario logueado:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Obtener usuarios por carrera
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoadingUsuarios(true);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `${API_URL}/usuarios/carrera/${encodeURIComponent(decodedCarrera)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsuarios(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error al obtener usuarios:', error.response?.data || error.message);
        setUsuarios([]);
      } finally {
        setLoadingUsuarios(false);
      }
    };

    fetchUsuarios();
  }, [decodedCarrera]);

  // Obtener matches mutuos para barra lateral
  useEffect(() => {
    const fetchMutualMatches = async () => {
      setLoadingMatches(true);
      if (!currentUserId) {
        setMatchesMutuos([]);
        setLoadingMatches(false);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/matches/mutual/${currentUserId}`);
        setMatchesMutuos(res.data || []);
      } catch (error) {
        console.error('Error al obtener matches mutuos:', error.response?.data || error.message);
        setMatchesMutuos([]);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMutualMatches();
  }, [currentUserId]);

  const handleMatch = async (matchedUserId) => {
    if (!currentUserId) {
      alert('Debes iniciar sesión para hacer match.');
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
      alert('✅ ¡Match enviado! Espera a que también te matcheen.');
      // Opcional: remover del listado o actualizar estado
      setUsuarios(prev => prev.filter(u => u.id !== matchedUserId));
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al hacer match:', error);
      alert('❌ No se pudo enviar el match. Intenta más tarde.');
    }
  };

  const handleIniciarChat = (matchedUserId) => {
    navigate(`/chat/${matchedUserId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filtrar usuarios
  const filteredUsers = usuarios
    .filter((user) => user.id !== currentUserId)
    .filter((user) => {
      const age = parseInt(user.age, 10) || 0;
      return (
        (!filters.gender || user.gender === filters.gender) &&
        age >= parseInt(filters.minAge, 10) &&
        age <= parseInt(filters.maxAge, 10)
      );
    });

  const getImageUrl = (id) => `https://i.pravatar.cc/600?u=${id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <Navbar />
      <div className="flex flex-col md:flex-row h-screen">
        {/* Barra lateral - Matches mutuos */}
        <div className="w-full md:w-80 bg-gray-800 shadow-xl p-6 space-y-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white">Tus Matches Mutuos</h2>
          <p className="text-sm text-gray-400">¡Conecta con quienes ya coincidieron contigo!</p>

          {/* Filtros para matches (opcional) */}
          <div className="bg-gray-700 p-4 rounded-xl space-y-3">
            <h3 className="font-semibold text-white text-sm">Filtrar Matches</h3>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Género</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todos</option>
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Edad mín.</label>
                <input
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  min="18"
                  max="35"
                  className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Edad máx.</label>
                <input
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  min="18"
                  max="35"
                  className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Lista de matches mutuos */}
          {loadingMatches ? (
            <div className="flex justify-center items-center h-16">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-purple-500"></div>
            </div>
          ) : matchesMutuos.length === 0 ? (
            <p className="text-sm text-gray-400">No tienes matches mutuos aún.</p>
          ) : (
            <div className="space-y-3">
              {matchesMutuos.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedUser(match)}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all hover:shadow-md hover:bg-gray-700 ${
                    selectedUser?.id === match.id ? 'bg-gray-600 ring-2 ring-purple-400' : 'bg-gray-800'
                  }`}
                >
                  <img
                    src={getImageUrl(match.id)}
                    alt={match.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{match.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {match.age} años • {match.career?.split(' ').slice(0, 2).join(' ')}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contenido principal - Usuarios por carrera */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loadingUsuarios ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mb-4"></div>
              <p className="text-lg font-medium">Cargando estudiantes...</p>
            </div>
          ) : selectedUser ? (
            /* Vista detallada del usuario seleccionado */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="h-96 overflow-hidden">
                <img
                  src={getImageUrl(selectedUser.id)}
                  alt={selectedUser.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="text-3xl font-bold text-white">
                  {selectedUser.name}, <span className="text-purple-400">{selectedUser.age}</span>
                </h2>
                <p className="text-purple-300 font-medium mt-1">{selectedUser.career}</p>
                <p className="text-gray-300 mt-3 leading-relaxed">{selectedUser.bio || 'Sin biografía.'}</p>
                <div className="flex justify-between mt-6 space-x-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold transition"
                  >
                    ❌ Saltar
                  </button>
                  <button
                    onClick={() => handleMatch(selectedUser.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold transition"
                  >
                    💘 Hacer Match
                  </button>
                </div>
              </div>
            </motion.div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <img
                src="https://img.icons8.com/fluency/96/empty-heart.png"
                alt="Sin estudiantes"
                className="w-24 h-24 opacity-30 mb-4"
              />
              <p className="text-xl text-gray-400 font-medium">No hay estudiantes disponibles.</p>
              <p className="text-sm text-gray-500 mt-1">Intenta ajustar los filtros.</p>
            </div>
          ) : (
            /* Cuadrícula de usuarios */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelectedUser(user)}
                  className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="h-60 overflow-hidden">
                    <img
                      src={getImageUrl(user.id)}
                      alt={user.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white">{user.name}</h3>
                    <p className="text-purple-300 font-medium">{user.career?.split(' ').slice(0, 3).join(' ')}</p>
                    <div className="flex items-center justify-between mt-2 text-gray-300">
                      <span>{user.age} años</span>
                      <span>
                        {user.gender === 'male' ? '♂️' : user.gender === 'female' ? '♀️' : '⚧️'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMatch(user.id);
                      }}
                      className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                      💘 Hacer Match
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}