import React, { useEffect, useState } from "react";
import { getUsuariosConFiltros } from "../services/api";
import type { GetUsuariosResponse, UserCardProps } from "../types/usuario";
import UserCard from "./CardUsuarioSwipe"; // Tu componente UserCard

const CarouselUsersSwipe: React.FC = () => {
  const [users, setUsers] = useState<UserCardProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const response: GetUsuariosResponse = await getUsuariosConFiltros(token, {
          career: undefined,
          minAge: undefined,
          maxAge: undefined,
          gender: undefined,
          page: 1,
          limit: 20,
        });

        if (response.success) {
          setUsers(response.data);
        } else {
          setError(response.message || "Error al obtener los usuarios");
        }
      } catch (err) {
        setError("Hubo un problema al obtener los usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLike = () => {
    // Aquí podrías hacer llamada para registrar el like
    // Por ahora solo avanzamos
    setCurrentIndex((prev) => Math.min(prev + 1, users.length));
  };

  const handleDislike = () => {
    // Similar a like, solo avanzar
    setCurrentIndex((prev) => Math.min(prev + 1, users.length));
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  if (currentIndex >= users.length) {
    return <p>No hay más usuarios disponibles.</p>;
  }

  const currentUser = users[currentIndex];

  return (
    <div className="">
      <UserCard {...currentUser}
       onLike={handleLike}
       onDislike={handleDislike}
      />

    </div>
  );
};

export default CarouselUsersSwipe;
