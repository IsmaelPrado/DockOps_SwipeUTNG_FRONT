import { useState } from 'react';
import { motion } from 'framer-motion';

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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-center text-pink-500 mb-8">Swipe UTNG</h1>

      <div className="flex justify-center mb-6">
        <select
          onChange={(e) => setFiltro(e.target.value)}
          className="bg-zinc-800 text-white p-2 rounded-xl text-lg"
        >
          <option value="">Filtrar por carrera</option>
          {carreras.map((carrera, idx) => (
            <option key={idx} value={carrera}>{carrera}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {carreras
          .filter((c) => !filtro || c === filtro)
          .map((carrera, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-zinc-900 p-6 rounded-2xl shadow-lg border border-pink-500"
            >
              <h2 className="text-xl font-semibold text-green-400 mb-2">{carrera}</h2>
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded-full text-sm">
                Ver más
              </button>
            </motion.div>
          ))}
      </div>

      <footer className="mt-12 text-center text-zinc-500 text-sm">
        2024 - Universidad Tecnológica de la Región Norte de Guanajuato (UTNG)
      </footer>
    </div>
  );
}
