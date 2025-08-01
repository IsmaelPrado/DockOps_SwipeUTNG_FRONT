// src/pages/MatchesMutuos.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function MatchesMutuos() {
  const [matchesMutuos, setMatchesMutuos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const [filters, setFilters] = useState({
    career: '',
    gender: '',
    minAge: 18,
    maxAge: 35,
  });

  const currentUserId = 1;
  const navigate = useNavigate();

  const carrerasOptions = [
    "Licenciatura en Administración",
    "TSU en Gestión de Capital Humano",
    "Licenciatura en Contaduría",
    "TSU en Contaduría",
    "Licenciatura en Negocios y Mercadotecnia",
    "TSU en Mercadotecnia",
    "Licenciatura en Gestión y Desarrollo Turístico",
    "TSU en Turismo",
    "Licenciatura en Diseño Digital y Producción Audiovisual",
    "TSU en Diseño y Animación Digital",
    "Licenciatura en Ingeniería en Tecnologías de la Información e Innovación Digital",
    "TSU en Desarrollo de Software Multiplataforma",
    "TSU en Infraestructura de Redes Digitales",
    "TSU en Entornos Virtuales y Negocios Digitales",
    "Licenciatura en Ingeniería en Mecatrónica",
    "TSU en Instalaciones Eléctricas",
    "TSU en Automatización",
    "Licenciatura en Ingeniería Industrial",
    "TSU en Procesos Productivos",
    "Licenciatura en Ingeniería en Energía y Desarrollo Sostenible",
    "TSU en Energía Turbo Solar"
  ];

  useEffect(() => {
    const fetchMutualMatches = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/matches/mutual/${currentUserId}`);
        console.log('Matches recibidos:', res.data);
        setMatchesMutuos(res.data);
      } catch (error) {
        console.error('Error al obtener matches mutuos:', error.response?.data || error.message);
        setMatchesMutuos([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchMutualMatches();
    }
  }, [currentUserId]);

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

  const filteredMatches = matchesMutuos.filter((match) => {
    const user = match.matchedUser;
    if (!user) return false;

    const age = parseInt(user.age) || 0;
    const { career, gender, minAge, maxAge } = filters;

    return (
      (career ? user.career === career : true) &&
      (gender ? user.gender === gender : true) &&
      age >= parseInt(minAge) &&
      age <= parseInt(maxAge)
    );
  });

  // Fallback para imagen
  const getImageUrl = (id) => {
    return `https://i.pravatar.cc/600?u=${id}`; // Imagen más grande y clara
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />

      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar - Filtros y lista de matches */}
        <div className="w-full md:w-80 bg-white shadow-xl p-6 space-y-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800">Descubre Matches</h2>
          <p className="text-sm text-gray-600">¡Conecta con personas que coinciden contigo!</p>

          {/* Filtros */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-4">
            <h3 className="font-semibold text-gray-800">Filtrar por</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Carrera</label>
              <select
                name="career"
                value={filters.career}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="">Todas las carreras</option>
                {carrerasOptions.map((carrera) => (
                  <option key={carrera} value={carrera}>
                    {carrera}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Género</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="">Todos</option>
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Edad mínima</label>
                <input
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  min="18"
                  max="35"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Edad máxima</label>
                <input
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  min="18"
                  max="35"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Lista de matches */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Tus Matches</h3>
            {filteredMatches.length === 0 ? (
              <p className="text-sm text-gray-500">No hay matches aún.</p>
            ) : (
              <div className="space-y-3">
                {filteredMatches.map((match) => {
                  const user = match.matchedUser;
                  return (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-purple-50 ${
                        selectedMatch?.id === match.id ? 'bg-purple-100 ring-2 ring-purple-300' : 'bg-white'
                      }`}
                    >
                      <img
                        src={getImageUrl(user.id)}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.age} años • {user.career?.split(' ').slice(0, 2).join(' ')}...
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Contenido principal - Perfil grande */}
        <div className="flex-1 p-6 overflow-y-auto bg-transparent">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mb-4"></div>
              <p className="text-lg font-medium">Cargando matches...</p>
            </div>
          ) : selectedMatch ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Imagen de perfil */}
              <div className="h-96 overflow-hidden">
                <img
                  src={getImageUrl(selectedMatch.matchedUser.id)}
                  alt={selectedMatch.matchedUser.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Información del perfil */}
              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedMatch.matchedUser.name}, <span className="text-purple-600">{selectedMatch.matchedUser.age}</span>
                </h2>
                <p className="text-purple-500 font-medium mt-1">{selectedMatch.matchedUser.career}</p>
                <p className="text-gray-600 mt-3 leading-relaxed">{selectedMatch.matchedUser.bio || 'Sin biografía.'}</p>

                {/* Botones de acción */}
                <div className="flex justify-between mt-6 space-x-3">
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold transition"
                  >
                    ❌ Saltar
                  </button>
                  <button
                    onClick={() => handleIniciarChat(selectedMatch.matchedUser.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold transition"
                  >
                    💬 Chat
                  </button>
                </div>
              </div>
            </motion.div>
          ) : filteredMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <img src="https://img.icons8.com/fluency/96/empty-heart.png" alt="Sin matches" className="w-24 h-24 opacity-30 mb-4" />
              <p className="text-xl text-gray-500 font-medium">Aún no tienes matches mutuos.</p>
              <p className="text-sm text-gray-400 mt-1">¡Sigue conectando!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredMatches.map((match) => {
                const user = match.matchedUser;
                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setSelectedMatch(match)}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className="h-60 overflow-hidden">
                      <img
                        src={getImageUrl(user.id)}
                        alt={user.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                      <p className="text-purple-600 font-medium">{user.career?.split(' ').slice(0, 3).join(' ')}</p>
                      <div className="flex items-center justify-between mt-2 text-gray-600">
                        <span>{user.age} años</span>
                        <span>
                          {user.gender === 'male' ? '♂️' : user.gender === 'female' ? '♀️' : '⚧️'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIniciarChat(user.id);
                        }}
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
                      >
                        Iniciar chat
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}