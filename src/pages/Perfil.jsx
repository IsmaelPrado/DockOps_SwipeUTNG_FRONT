import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { API_URL } from '../services/api';

export default function Profile() {
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    career: '',
    age: '',
    gender: '',
    photos: ['', '', ''],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/usuarios/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener perfil de usuario');
        }

        const data = await response.json();
        setFormData(data);
        console.log('Perfil de usuario cargado:', data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const [photoPreviews, setPhotoPreviews] = useState(
    formData.photos?.map((photo) => (photo ? photo : '')) || ['', '', '']
  );


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith('photo-') && files.length > 0) {
      const index = parseInt(name.split('-')[1], 10);
      const file = files[0];
      const updatedPhotos = [...formData.photos];
      const updatedPreviews = [...photoPreviews];

      updatedPhotos[index] = URL.createObjectURL(file);
      updatedPreviews[index] = URL.createObjectURL(file);

      setFormData({ ...formData, photos: updatedPhotos });
      setPhotoPreviews(updatedPreviews);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(formData));

    alert('✅ Perfil actualizado con éxito');
  };

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

  const fileInputRefs = [null, null, null];
  const triggerFileInput = (index) => {
    fileInputRefs[index].click();
  };

  const profilePhoto = formData.photos[0] || 'https://i.pravatar.cc/400?u=profile';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <Navbar />

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center py-10 px-4 max-w-7xl mx-auto">
        {/* Formulario */}
        <div className="bg-gray-800 rounded-3xl shadow-2xl w-full lg:w-2/3 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 to-pink-700 text-white p-8 text-center">
            <h2 className="text-3xl font-bold">Mi Perfil</h2>
            <p className="text-purple-200 mt-2">Actualiza tu información y fotos</p>
          </div>

          <form onSubmit={handleUpdate} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre completo</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ej. Ana Martínez"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="w-full p-3 border border-gray-600 rounded-xl bg-gray-600 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Edad</label>
                <input
                  type="number"
                  name="age"
                  min="18"
                  max="100"
                  placeholder="Ej. 22"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Género</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                >
                  <option value="">Selecciona tu género</option>
                  <option value="female">Femenino</option>
                  <option value="male">Masculino</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Carrera</label>
              <select
                name="career"
                value={formData.career}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value="">Selecciona tu carrera</option>
                {carrerasOptions.map((carrera) => (
                  <option key={carrera} value={carrera}>
                    {carrera}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">Fotos de perfil</label>
              <div className="grid grid-cols-3 gap-6">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="flex flex-col items-center space-y-3">
                    <div
                      className={`w-28 h-28 rounded-2xl border-2 flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 ${
                        photo
                          ? 'border-purple-500 ring-2 ring-purple-400'
                          : 'border-dashed border-gray-500 hover:border-purple-400'
                      }`}
                      onClick={() => triggerFileInput(index)}
                    >
                      {photo ? (
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs font-medium">Foto {index + 1}</span>
                      )}
                    </div>

                    <motion.button
                      type="button"
                      onClick={() => triggerFileInput(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2 rounded-full font-medium shadow-sm transition"
                    >
                      {photo ? 'Cambiar' : 'Subir'}
                    </motion.button>

                    <input
                      type="file"
                      name={`photo-${index}`}
                      accept="image/*"
                      onChange={handleChange}
                      ref={(el) => (fileInputRefs[index] = el)}
                      className="hidden"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Haz clic en la imagen o el botón para subir una foto. La primera será tu foto principal.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-700 to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition duration-300 mt-6"
            >
              🔄 Actualizar perfil
            </motion.button>
          </form>
        </div>

        {/* Vista previa */}
        <div className="lg:w-1/3 sticky top-8 self-start">
          <h3 className="text-xl font-bold text-gray-200 mb-4 text-center">Vista previa del perfil</h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl"
          >
            <div className="h-80 overflow-hidden">
              <img
                src={profilePhoto}
                alt="Vista previa"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-100">
                {formData.name || 'Tu nombre'}
              </h3>
              <p className="text-purple-400 font-medium">{formData.age ? `${formData.age} años` : 'Edad'}</p>
              <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                {formData.career || 'Tu carrera aparecerá aquí'}
              </p>

              <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                <span>
                  {formData.gender === 'male'
                    ? '♂️ Hombre'
                    : formData.gender === 'female'
                    ? '♀️ Mujer'
                    : formData.gender === 'other'
                    ? '⚧️ Otro'
                    : 'Género'}
                </span>
              </div>

              <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition">
                💬 Chat
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
