import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Perfil';
import UsuariosPorCarrera from '../pages/UsuariosPorCarrera';
import MatchesMutuos from '../pages/MatchesMutuos'; // 👈 Importa el nuevo componente
import TodosLosUsuarios from '../pages/TodosLosUsuarios'; // 👈 Importa el componente TodosLosUsuarios

const AppRouter = () => {
  console.log('AppRouter cargado');

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/carrera/:nombreCarrera" element={<UsuariosPorCarrera />} />
      <Route path="/matches-mutual" element={<MatchesMutuos />} />
      <Route path="/todos-los-usuarios" element={<TodosLosUsuarios />} /> {/* 👈 Nueva ruta */}
    </Routes>
  );
};

export default AppRouter;
