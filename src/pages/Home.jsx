
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (

    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Animación principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Título */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 12, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Bienvenido a Swipe UTNG
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Descubre, conecta y encuentra a otros estudiantes de tu carrera. ❤️  
            Tu próxima amistad o match ideal está a solo un swipe de distancia.
          </motion.p>

          {/* Botones de acción */}
          <motion.div
            className="flex flex-wrap justify-center gap-5 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="bg-gray-800 hover:bg-gray-700 text-purple-300 border-2 border-purple-400 px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              Registrarse
            </Link>
          </motion.div>
        </motion.div>

        {/* Decoración opcional (forma suave) */}
        <motion.div
          className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-800 rounded-full filter blur-3xl opacity-30 -z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 50 }}
        />
        <motion.div
          className="absolute top-1/3 right-0 w-1/2 h-1/3 bg-pink-800 rounded-full filter blur-3xl opacity-30 -z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 50 }}
        />
      </main>

      {/* Footer opcional */}
      <footer className="text-center text-gray-500 text-sm py-6">
        © 2025 Swipe UTNG — Conectando estudiantes de la UTNG
      </footer>
    </div>
  );
}
