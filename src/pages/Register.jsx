
// src/pages/Register.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    career: '',

    photos: ['', '', ''],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const normalizeGender = (gender) => {
    const lower = gender.toLowerCase();
    if (['female', 'male', 'other'].includes(lower)) return lower;
    return '';
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      const updatedPhotos = [...formData.photos];
      updatedPhotos[index] = base64;
      setFormData({ ...formData, photos: updatedPhotos });
    } catch (err) {
      setError('Error al procesar la imagen. Intenta con otra.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (Number(formData.age) < 17) {
      setError('Debes tener al menos 17 años para registrarte.');
      setLoading(false);
      return;
    }

    if (!formData.gender) {
      setError('Por favor, selecciona tu género.');
      setLoading(false);
      return;
    }

    if (!formData.career) {
      setError('Por favor, selecciona tu carrera.');
      setLoading(false);
      return;
    }

    if (formData.photos.some(photo => !photo)) {
      setError('Debes subir las 3 fotos para completar tu registro.');
      setLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      gender: normalizeGender(formData.gender),
      age: Number(formData.age),
    };

    try {
      await registerUser(dataToSend);

      navigate('/login');
    } catch (err) {
      setError(err.errors[0] || err.message || 'Error al registrar. Intenta nuevamente.');
      toast.error(err.message || 'Error al registrar. Intenta nuevamente.');
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fileInputRefs = [null, null, null];
  const triggerFileInput = (index) => fileInputRefs[index].click();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-700 to-pink-700 text-white p-8 text-center">
            <h2 className="text-3xl font-bold">Crea tu cuenta</h2>
            <p className="text-purple-100 mt-2">¡Únete a la comunidad estudiantil!</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-800 border border-red-400 text-red-200 text-sm p-3 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input className="input bg-gray-700 text-white rounded-xl p-2" name="name" type="text" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
              <input className="input bg-gray-700 text-white rounded-xl p-2" name="email" type="email" placeholder="Correo" value={formData.email} onChange={handleChange} required />
              <div className="relative">
                <input
                  className="input bg-gray-700 text-white rounded-xl p-2 w-full pr-10"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-sm text-gray-300"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input bg-gray-700 text-white rounded-xl p-2" name="age" type="number" placeholder="Edad" value={formData.age} onChange={handleChange} required />
              <select className="input bg-gray-700 text-white rounded-xl p-2" name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Género</option>
                <option value="female">Femenino</option>
                <option value="male">Masculino</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <select className="input bg-gray-700 text-white rounded-xl p-2 w-full" name="career" value={formData.career} onChange={handleChange} required>
              <option value="">Selecciona tu carrera</option>
              {carreras.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <div>
              <label className="block text-sm mb-2">Sube tus 3 fotos</label>
              <div className="grid grid-cols-3 gap-6">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex flex-col items-center space-y-3">
                    <div
                      onClick={() => triggerFileInput(index)}
                      className={`w-28 h-28 rounded-2xl border-2 flex items-center justify-center overflow-hidden cursor-pointer transition-all ${
                        formData.photos[index]
                          ? 'border-purple-500 ring-2 ring-purple-400'
                          : 'border-dashed border-gray-600 hover:border-purple-400'
                      }`}
                    >
                      {formData.photos[index] ? (
                        <img src={formData.photos[index]} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-xs">Foto {index + 1}</span>
                      )}
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => triggerFileInput(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs bg-purple-800 text-white px-3 py-1 rounded-full"
                    >
                      {formData.photos[index] ? 'Cambiar' : 'Subir'}
                    </motion.button>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index)} ref={(el) => (fileInputRefs[index] = el)} className="hidden" />
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl shadow-md mt-4 disabled:opacity-70"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </motion.button>
          </form>

          <div className="bg-gray-800 px-8 py-6 text-center border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => navigate('/login')} className="font-semibold text-purple-400 hover:text-purple-300 transition">
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="text-center text-gray-500 text-sm py-4">
        © 2025 Swipe UTNG — Conectando estudiantes de la UTNG
      </footer>
    </div>
  );
}
