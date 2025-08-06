import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';
import CarouselUsersSwipe from '../components/CarouselUsersSwipe';
import ChatModal from '../components/ChatModal';

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
  const [activeConversationId, setActiveConversationId] = useState(null);
  const token = localStorage.getItem('token');
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
        const res = await axios.get(`${API_URL}/matches/mutual`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Matches recibidos:", res.data.data);
        setMatchesMutuos(res.data.data);
      } catch (error) {
        console.error("Error al obtener matches mutuos:", error.response?.data || error.message);
        setMatchesMutuos([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchMutualMatches();
    }
  }, [token]);

  const handleIniciarChat = (matchedUserId) => {
    navigate(`${API_URL}/chat/${matchedUserId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filtrado robusto para evitar errores
 const filteredMatches = matchesMutuos.filter(({ user }) => {
  const age = parseInt(user.age, 10) || 0;
  const { career, gender, minAge, maxAge } = filters;

  return (
    (career ? user.career === career : true) &&
    (gender ? user.gender === gender : true) &&
    age >= parseInt(minAge, 10) &&
    age <= parseInt(maxAge, 10)
  );
});


  const getImageUrl = (id) => `https://i.pravatar.cc/600?u=${id}`;

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
    <Navbar />
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar / Filtros y listado */}
      <div className="w-full md:w-80 bg-gray-800 shadow-xl p-6 space-y-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-white">Descubre personas nuevas</h2>
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
        {filteredMatches.map(({ matchId, user }) => (
  <div
    key={matchId}
    onClick={() => {
      setSelectedMatch(user);
      setActiveConversationId(matchId); // <-- quizás aquí también quieras usar matchId
    }}
    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-gray-700 ${
      selectedMatch?.id === user.id ? 'bg-gray-600 ring-2 ring-purple-400' : 'bg-gray-800'
    }`}
  >
    <img
      src={getImageUrl(user.id)}
      alt={user.name}
      className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
    />
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-white text-sm truncate">{user.name}</p>
      <p className="text-xs text-gray-400 truncate">
        {user.age} años • {user.career?.split(' ').slice(0, 2).join(' ')}...
      </p>
    </div>
  </div>
))}

        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL DE CAROUSEL QUE OCUPA EL ESPACIO RESTANTE */}
      <div className="flex-1 h-full flex items-center justify-center">
  <CarouselUsersSwipe />
</div>

      {/* CHAT MODAL */}
      {activeConversationId && (
        <ChatModal
          conversationId={activeConversationId}
          onClose={() => setActiveConversationId(null)}
        />
      )}
    </div>
  </div>
);

}