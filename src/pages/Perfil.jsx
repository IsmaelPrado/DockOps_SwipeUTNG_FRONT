import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [formData, setFormData] = useState({
    name: storedUser.name || '',
    email: storedUser.email || '',
    career: storedUser.career || '',
    age: storedUser.age || '',
    gender: storedUser.gender || '',
    photos: storedUser.photos || ['', '', '']
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith('photo') && files.length > 0) {
      const index = parseInt(name.split('-')[1], 10);
      const updatedPhotos = [...formData.photos];
      updatedPhotos[index] = URL.createObjectURL(files[0]);
      setFormData({ ...formData, photos: updatedPhotos });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(formData));
    alert('Perfil actualizado con éxito');
  };
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null;
});


  return (
    <motion.div
      className="min-h-screen bg-black text-white flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-zinc-900 rounded-2xl shadow-lg w-full max-w-xl p-8">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-6">Mi Perfil</h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <input type="text" name="name" placeholder="Nombre completo" value={formData.name} onChange={handleChange} className="p-3 rounded-xl bg-zinc-800" />
          <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} className="p-3 rounded-xl bg-zinc-800" disabled />
          <input type="number" name="age" placeholder="Edad" value={formData.age} onChange={handleChange} className="p-3 rounded-xl bg-zinc-800" />

          <select name="gender" value={formData.gender} onChange={handleChange} className="p-3 rounded-xl bg-zinc-800">
            <option value="">Selecciona tu sexo</option>
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="other">Otro</option>
          </select>

          <input type="text" name="career" placeholder="Carrera" value={formData.career} onChange={handleChange} className="p-3 rounded-xl bg-zinc-800" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {formData.photos.map((photo, i) => (
              <div key={i} className="flex flex-col items-center">
                {photo && <img src={photo} alt={`Foto ${i + 1}`} className="w-24 h-24 rounded-xl object-cover" />}
                <input type="file" name={`photo-${i}`} accept="image/*" onChange={handleChange} className="mt-2 text-xs text-gray-400" />
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-black font-bold py-2 rounded-xl mt-4"
          >
            Actualizar perfil
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
