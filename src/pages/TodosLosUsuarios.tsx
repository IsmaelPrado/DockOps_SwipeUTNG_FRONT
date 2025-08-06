import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

type Usuario = {
  id: number;
  name: string;
  age: number;
};

export default function TodosLosUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    career: '',
    gender: '',
    minAge: 18,
    maxAge: 100,
  });

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
        const response = await axios.get('/api/usuarios');
        setUsuarios(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleMatch = async (matchedUserId: number) => {
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredUsers = usuarios
    .filter((user: any) => user.id !== currentUserId)
    .filter((user: any) => {
      const age = user.age;
      const { career, gender, minAge, maxAge } = filters;
      return (
        (career ? user.career === career : true) &&
        (gender ? user.gender === gender : true) &&
        (age >= minAge && age <= maxAge)
      );
    });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12 flex flex-col items-center">
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl font-extrabold text-center text-pink-400 mb-10">
            Todos los Usuarios
          </h1>

          {/* Filtros */}
          <div className="mb-8 flex flex-wrap justify-center gap-6">
            <div className="w-full sm:w-auto">
              <label htmlFor="career" className="text-white text-sm mb-2 block">
                Carrera:
              </label>
              <select
                id="career"
                name="career"
                value={filters.career}
                onChange={handleFilterChange}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
              >
                <option value="">Selecciona una carrera</option>
                {carrerasOptions.map((carrera) => (
                  <option key={carrera} value={carrera}>
                    {carrera}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label htmlFor="gender" className="text-white text-sm mb-2 block">
                Sexo:
              </label>
              <select
                id="gender"
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
              >
                <option value="">Todos</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label htmlFor="age" className="text-white text-sm mb-2 block">
                Edad:
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  id="minAge"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  placeholder="Edad mínima"
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
                />
                <input
                  type="number"
                  id="maxAge"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  placeholder="Edad máxima"
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-300 text-lg">Cargando usuarios...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 text-xl">No hay usuarios registrados.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="bg-zinc-800 rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 relative"
                  style={{
                    backgroundImage: `url(${user.photos?.[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '400px',
                    color: 'white',
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-40"></div>

                  <div className="relative z-10 flex flex-col items-start justify-end h-full p-4">
                    <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
                    <p className="text-sm text-pink-300 mb-1">{user.career}</p>
                    <div className="flex items-center gap-1 text-sm mb-4 text-gray-300">
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
                      className="w-full bg-pink-600 hover:bg-pink-500 text-white font-medium py-2 rounded-full transition duration-200 shadow-lg"
                    >
                      Match
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
