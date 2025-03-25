import React from 'react';
import { useHistory } from 'react-router-dom';

export const ChatPage = () => {
  const history = useHistory();

  const handleLogout = () => {
    // Limpiar información de usuario
    localStorage.removeItem('userInfo');
    // Redirigir al login
    history.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mis Chats</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
        {/* Contenido de la página de chats */}
        <div className="text-center text-gray-600">
          Bienvenido a tu aplicación de chats
        </div>
      </div>
    </div>
  );
};

