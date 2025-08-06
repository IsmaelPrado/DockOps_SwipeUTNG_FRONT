import React, { useEffect, useState } from "react";
import { createSwipe, getUsuariosConFiltros } from "../services/api";
import type { GetUsuariosResponse, UserCardProps } from "../types/usuario";
import UserCard from "./CardUsuarioSwipe"; // Tu componente UserCard
import { toast } from "react-toastify";

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

  const handleLike = async () => {
  const token = localStorage.getItem("token");
  setCurrentIndex((prev) => Math.min(prev + 1, users.length));

  if (!token) return;

  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    const userId = payload.id;

    const response = await createSwipe(
      token,
      userId,
      currentUser.id,
      true
    );

    if (response.success) {
      console.log("Like registrado correctamente");
      toast.success("Like registrado correctamente");
    } else {
      console.error("Error al registrar el like:", response.message);
      toast.error(`Error: ${response.message || "No se pudo registrar el like"}`);
    }
  } catch (error: any) {
    console.error("Excepción al registrar el like:", error);
    toast.error(`Error inesperado: ${error.message || "Intenta más tarde"}`);
  }
};


const handleDislike = async () => {
  const token = localStorage.getItem("token");
  setCurrentIndex((prev) => Math.min(prev + 1, users.length));

  if (!token) return;

  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    const userId = payload.id;

    const response = await createSwipe(
      token,
      userId,
      currentUser.id,
      false
    );

    if (response.success) {
      console.log("Dislike registrado correctamente");
      toast.success("Dislike registrado correctamente");
    } else {
      console.error("Error al registrar el dislike:", response.message);
      toast.error(`Error: ${response.message || "No se pudo registrar el dislike"}`);
    }
  } catch (error: any) {
    console.error("Excepción al registrar el dislike:", error);
    toast.error(`Error inesperado: ${error.message || "Intenta más tarde"}`);
  }
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
