// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const carreras = [
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

export default function Dashboard() {
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  const handleVerMas = (carrera) => {
    const encodedCarrera = encodeURIComponent(carrera);
    navigate(`/carrera/${encodedCarrera}`);
  };

  const filteredCarreras = carreras.filter((c) => !filtro || c === filtro);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Swipe UTNG
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Descubre perfiles de estudiantes por carrera y conecta con personas que comparten tus intereses académicos.
          </p>
        </motion.div>

        {/* Selector de carrera */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="relative w-full max-w-md">
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full p-4 pl-5 pr-10 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-700 focus:border-purple-500 text-gray-100 font-medium text-sm transition-all duration-300 appearance-none"
            >
              <option value="">Filtrar por carrera</option>
              {carreras.map((carrera, idx) => (
                <option key={idx} value={carrera} className="text-gray-900">
                  {carrera}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Contador de resultados */}
        <div className="text-center mb-8">
          <p className="text-gray-300">
            Mostrando <span className="font-semibold text-purple-400">{filteredCarreras.length}</span> carrera(s)
            {filtro && (
              <span className="ml-2 text-sm text-gray-400">
                filtrada(s) por "<strong>{filtro}</strong>"
              </span>
            )}
          </p>
        </div>

        {/* Grid de carreras */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredCarreras.map((carrera, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-700 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => handleVerMas(carrera)}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-100 leading-tight mb-4 line-clamp-3">
                  {carrera}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVerMas(carrera);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Ver estudiantes
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center text-gray-500 text-sm"
        >
          <p>© 2025 — <span className="font-semibold text-gray-400">Swipe UTNG</span></p>
          <p className="mt-1">Universidad Tecnológica de la Región Norte de Guanajuato</p>
        </motion.footer>
      </div>
    </div>
  );
}
