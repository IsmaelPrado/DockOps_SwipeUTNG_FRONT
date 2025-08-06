import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MatchesMutuos from '../pages/MatchesMutuos';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';
import Profile from '../pages/Perfil';
import UsuariosPorCarrera from '../pages/UsuariosPorCarrera';
import TodosLosUsuarios from '../pages/TodosLosUsuarios';



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
