import React, { useState } from 'react';
import axios from 'axios';
import { User, Camera, Edit } from 'lucide-react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ChatState } from '../Context/ChatProvider';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const [name, setName] = useState(user.name);
  const [profileImage] = useState(user.pic);
  const [imageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = ChatState();

  /*const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  */

  const API_URL = import.meta.env.VITE_API_URL;
  const handleSave = async () => {
    if (!name.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }

    setLoading(true);
    
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      
      // Primero, subir imagen si se ha cambiado
      let picUrl = user.pic;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadResponse = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        picUrl = uploadResponse.data.url;
      }

      // Luego actualizar perfil
      const updateResponse = await axios.post(`${API_URL}/api/user/profile`, { 
        name, 
        pic: picUrl 
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Actualizar usuario en estado global y localStorage
      updateUser(updateResponse.data);
      
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Actualización de perfil fallida', error);
      alert('Error al actualizar el perfil: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      className="relative z-50"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30" 
        aria-hidden="true" 
      />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel 
          className="w-full max-w-md rounded-xl bg-white p-6 space-y-4 shadow-xl"
        >
          <DialogTitle 
            className="text-xl font-bold text-gray-900 flex items-center gap-2"
          >
            <User className="w-5 h-5" /> Editar Perfil
          </DialogTitle>

          {/* Sección de imagen de perfil */}
          <div className="flex justify-center relative">
            <div className="relative">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-contain md:object-cover"
              />
             {/* <label 
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600"
              >
                <Camera className="w-5 h-5" />
                <input 
                  type="file" 
                  id="profile-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                
              </label>
              */}
            </div>
          </div>

          {/* Formulario de edición */}
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <Edit className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-4">
                  Email
                </label>
                <span className="font-light">
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2">
            <button 
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 hover:cursor-pointer transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:cursor-pointer transition disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : "Guardar"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ProfileModal;