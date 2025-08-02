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
  const currentUserId = 1; // Deberías obtenerlo dinámicamente, ej. contexto o auth
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
        setMatchesMutuos(res.data || []);
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

  // Filtrado robusto para evitar errores
  const filteredMatches = matchesMutuos.filter((match) => {
    const age = parseInt(match.age, 10) || 0; // Parse age directly from match
    const { career, gender, minAge, maxAge } = filters;
    return (
      (career ? match.career === career : true) && // Filter by career
      (gender ? match.gender === gender : true) && // Filter by gender
      age >= parseInt(minAge, 10) && // Filter by minimum age
      age <= parseInt(maxAge, 10) // Filter by maximum age
    );
  });

  const getImageUrl = (id) => `https://i.pravatar.cc/600?u=${id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <Navbar />
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-80 bg-gray-800 shadow-xl p-6 space-y-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white">Descubre Matches</h2>
          <p className="text-sm text-gray-400">¡Conecta con personas que coinciden contigo!</p>
          {/* FILTROS */}
          <div className="bg-gray-700 p-4 rounded-xl space-y-4">
            <h3 className="font-semibold text-white">Filtrar por</h3>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Carrera</label>
              <select
                name="career"
                value={filters.career}
                onChange={handleFilterChange}
                className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="">Todas las carreras</option>
                {carrerasOptions.map((carrera) => (
                  <option key={carrera} value={carrera}>{carrera}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Género</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="">Todos</option>
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Edad mínima</label>
                <input
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  min="18"
                  max="35"
                  className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Edad máxima</label>
                <input
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  min="18"
                  max="35"
                  className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
          {/* LISTADO LATERAL */}
          <div>
            <h3 className="font-semibold text-white mb-3">Tus Matches</h3>
            {filteredMatches.length === 0 ? (
              <p className="text-sm text-gray-400">No hay matches aún.</p>
            ) : (
              <div className="space-y-3">
                {filteredMatches.map((match) => {
                  return (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-gray-700 ${
                        selectedMatch?.id === match.id ? 'bg-gray-600 ring-2 ring-purple-400' : 'bg-gray-800'
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* DETALLE / MAIN */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mb-4"></div>
              <p className="text-lg font-medium">Cargando matches...</p>
            </div>
          ) : selectedMatch ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="h-96 overflow-hidden">
                <img
                  src={getImageUrl(selectedMatch.id)}
                  alt={selectedMatch.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="text-3xl font-bold text-white">
                  {selectedMatch.name}, <span className="text-purple-400">{selectedMatch.age}</span>
                </h2>
                <p className="text-purple-300 font-medium mt-1">{selectedMatch.career}</p>
                <p className="text-gray-300 mt-3 leading-relaxed">{selectedMatch.bio || 'Sin biografía.'}</p>
                <div className="flex justify-between mt-6 space-x-3">
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold transition"
                  >
                    ❌ Saltar
                  </button>
                  <button
                    onClick={() => handleIniciarChat(selectedMatch.id)}
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
              <p className="text-xl text-gray-400 font-medium">Aún no tienes matches mutuos.</p>
              <p className="text-sm text-gray-500 mt-1">¡Sigue conectando!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredMatches.map((match) => {
                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setSelectedMatch(match)}
                    className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className="h-60 overflow-hidden">
                      <img
                        src={getImageUrl(match.id)}
                        alt={match.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-white">{match.name}</h3>
                      <p className="text-purple-300 font-medium">{match.career?.split(' ').slice(0, 3).join(' ')}</p>
                      <div className="flex items-center justify-between mt-2 text-gray-300">
                        <span>{match.age} años</span>
                        <span>{match.gender === 'male' ? '♂️' : match.gender === 'female' ? '♀️' : '⚧️'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIniciarChat(match.id);
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