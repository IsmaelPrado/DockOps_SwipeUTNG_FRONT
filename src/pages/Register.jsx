// src/components/Register.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    career: '',
    photos: ['', '', '']
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Normaliza el género para enviar valores aceptados por el backend
  const normalizeGender = (gender) => {
    const lower = gender.toLowerCase();
    if (lower === 'female') return 'female';
    if (lower === 'male') return 'male';
    if (lower === 'other') return 'other';
    return gender;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar edad mínima
    if (Number(formData.age) < 17) {
      setError('Debes tener al menos 17 años para registrarte.');
      return;
    }

    // Normalizar género y preparar datos para enviar
    const dataToSend = {
      ...formData,
      gender: normalizeGender(formData.gender),
      age: Number(formData.age), // asegurar que edad sea número
    };

    try {
      await registerUser(dataToSend);
      // No guardamos token porque backend no lo envía en registro
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al registrar');
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-black text-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-zinc-900 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-pink-400 mb-6">Crear cuenta en Swipe UTNG</h2>
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800 text-white"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800 text-white"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800 text-white"
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Edad"
            value={formData.age}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800 text-white"
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800 text-white"
            required
          >
            <option value="">Selecciona tu sexo</option>
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="other">Otro</option>
          </select>

          <select
            name="career"
            value={formData.career}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800 text-white"
            required
          >
            <option value="">Selecciona tu carrera</option>
            {carreras.map((carrera) => (
              <option key={carrera} value={carrera}>{carrera}</option>
            ))}
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex flex-col items-center">
                {formData.photos[index] && (
                  <img
                    src={formData.photos[index]}
                    alt={`Foto ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                )}
                <input
                  type="file"
                  name={`photo-${index}`}
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const base64 = await fileToBase64(file);
                      const updatedPhotos = [...formData.photos];
                      updatedPhotos[index] = base64;
                      setFormData({ ...formData, photos: updatedPhotos });
                    }
                  }}
                  className="text-xs mt-2 text-gray-400"
                  required
                />
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 rounded-xl transition"
          >
            Registrarse
          </motion.button>
        </form>
      </div>
    </motion.div>
  );f
}
