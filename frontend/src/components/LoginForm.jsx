import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Image } from "lucide-react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ChatState } from "../Context/ChatProvider";

export const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  });

  const history = useNavigate();
  const { setUser: setChatUser, setSelectedChat, setChats } = ChatState();

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mern-chat-app");
  
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dwbmxfezu/image/upload", {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al subir la imagen a Cloudinary: ${errorData.error.message}`);
      }
  
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      setError("Error al subir la imagen");
      return null;
    }
  };
  
  const API_URL = import.meta.env.VITE_API_URL || '';
  

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Validaciones
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Solo se permiten imágenes JPEG, PNG o GIF');
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('La imagen no debe exceder 5MB');
      return;
    }
  
    // Previsualizacion local
    const previewUrl = URL.createObjectURL(file);
    setUser(prev => ({ ...prev, pic: previewUrl }));
  
    // Subir a Cloudinary
    try {
      setLoading(true);
      const uploadedImageUrl = await handleImageUpload(file);
      if (uploadedImageUrl) {
        setUser(prev => ({ ...prev, pic: uploadedImageUrl }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Error al subir la imagen. Intenta con otra imagen.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (isLogin) {
      if (!user.email || !user.password) {
        setError("Por favor completa todos los campos");
        return false;
      }
    } else {
      if (!user.name || !user.email || !user.password || !user.pic) {
        setError("Por favor completa todos los campos");
        return false;
      }
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' }
      };

      //Login
      let response;
      if (isLogin) {
        response = await axios.post(`/api/user/login`, {
          email: user.email,
          password: user.password
        }, config);

      } else {
        response = await axios.post(`/api/user`, {
          name: user.name,
          email: user.email,
          password: user.password,
          pic: user.pic
        }, config);
      }

      // Limpiar estados previos
      setSelectedChat(null);
      setChats([]);
      
      // Guardar la información del usuario y actualizar el contexto
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      setChatUser(response.data);
      
      history("/chats");
    } catch (error) {
      setError(error.response?.data?.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = (formType) => {
    setIsLogin(formType === "login");
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen md:p-4 ">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="md:w-20 md:h-20 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <span className="text-white md:text-2xl text-md font-bold">MT</span>
        </div>
        <h1 className="md:text-4xl text-xl font-light text-gray-800">MyTalk App</h1>
        <p className="text-gray-600 mt-2 text-md">Conéctate y comunícate</p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6 md:w-full w-[200px] max-w-md bg-white/20 backdrop-blur-md rounded-full p-1 shadow-inner">
        <button
          onClick={() => toggleForm("login")}
          className={`w-1/2 py-3 rounded-full transition-all ease duration-100 font-medium ${
            isLogin
              ? "bg-white/80 backdrop-blur-md shadow-md text-blue-600"
              : "bg-transparent text-gray-600 hover:bg-white/10"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => toggleForm("signup")}
          className={`w-1/2 py-3 rounded-full transition-all ease duration-100 font-medium ${
            !isLogin
              ? "bg-white/80 backdrop-blur-md shadow-md text-purple-600"
              : "bg-transparent text-gray-600 hover:bg-white/10"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Formulario */}
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl md:w-full w-[300px] max-w-md border border-white/50">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </h2>

        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nombre de Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChangeForm}
                  placeholder="Nombre de usuario"
                  className="pl-10 w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ease"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChangeForm}
                placeholder="Correo electrónico"
                className="pl-10 w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ease"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleChangeForm}
                placeholder="Contraseña"
                className="pl-10 w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ease"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="pic" className="text-sm font-medium text-gray-700">
                Imagen de perfil
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image size={18} className="text-gray-500" />
                </div>
                <input
                  type="file"
                  name="pic"
                  onChange={handleImage}
                  className="pl-10 w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ease"
                />
              </div>
              {user.pic && (
                <div className="mt-2 flex justify-center">
                  <img 
                    src={user.pic} 
                    alt="Perfil" 
                    className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                  />
                </div>
              )}
            </div>
          )}

          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 py-3 rounded-lg shadow-md transition-all duration-300 font-medium text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : 
              isLogin
                ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                : "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
            }`}
          >
            {loading ? "Procesando..." : (isLogin ? "Ingresar" : "Crear cuenta")}
          </button>
        </form>

        {isLogin ? (
          <p className="text-center mt-6 text-gray-600">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => toggleForm("signup")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Regístrate
            </button>
          </p>
        ) : (
          <p className="text-center mt-6 text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => toggleForm("login")}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Inicia sesión
            </button>
          </p>
        )}
      </div>
    </div>
  );
};