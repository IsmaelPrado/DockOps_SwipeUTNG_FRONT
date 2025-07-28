import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8"
    >
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-pink-500 mb-4 text-center"
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Bienvenido a Swipe UTNG
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-green-400 text-center max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Explora, conecta y encuentra tu match ideal entre estudiantes por carrera. ❤️
      </motion.p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/login"
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-xl text-lg font-semibold shadow-md"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-lg font-semibold shadow-md"
        >
          Registrarse
        </Link>
      </div>
    </motion.div>
  );
}