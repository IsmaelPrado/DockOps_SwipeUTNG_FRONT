import React, { useState, useEffect } from 'react';
import type { UserCardProps } from '../types/usuario';

const UserCard: React.FC<UserCardProps> = ({
  name,
  age,
  gender,
  career,
  photos,
  onLike,
  onDislike,
}) => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timeout);
  }, [currentPhoto]);

  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="w-full max-w-md h-[700px] bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-3xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col">
      {/* Imagen principal */}
      <div className="relative w-full h-[70%] bg-black select-none flex items-center justify-center">
        <img
          src={photos[currentPhoto]}
          alt={`Foto ${currentPhoto + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
          draggable={false}
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition"
            >
              ◀
            </button>
            <button
              onClick={nextPhoto}
              aria-label="Foto siguiente"
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition"
            >
              ▶
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
              {photos.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrentPhoto(idx)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
                    idx === currentPhoto ? 'bg-white' : 'bg-gray-500'
                  }`}
                  aria-label={`Ir a foto ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info + botones */}
      <div className="p-4 flex flex-col justify-between h-[15%]">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-wide">
            {name}, <span className="font-normal text-base">{age}</span>
          </h2>
          <p className="text-sm text-gray-300">{career}</p>
          <p className="text-sm text-gray-400 capitalize">{gender}</p>
        </div>

        {/* Botones like/dislike */}
        <div className="flex justify-center gap-10 mt-4">
          <button
            onClick={onDislike}
            aria-label="Rechazar usuario"
            className="bg-red-600 hover:bg-red-700 p-4 rounded-full text-2xl font-bold shadow-md transition transform hover:scale-110"
          >
            ❌
          </button>
          <button
            onClick={onLike}
            aria-label="Aceptar usuario"
            className="bg-green-600 hover:bg-green-700 p-4 rounded-full text-2xl font-bold shadow-md transition transform hover:scale-110"
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
