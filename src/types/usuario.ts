export interface UserCardProps {
    id: number;
  name: string;
  age: number;
  gender: string;
  career: string;
  photos: string[]; // base64 strings
  onLike?: () => void; // Callback para manejar el like
  onDislike?: () => void; // Callback para manejar el dislike
}

export interface Pagination {
    total: number;
    currentPage: number;
    totalPages: number;
    perPage: number;
}

export interface GetUsuariosResponse
{
    success: boolean;
    message: string;
    data: UserCardProps[];
    pagination: Pagination;
}
