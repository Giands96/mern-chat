import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Image } from "lucide-react";

export const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    pic: "",
  });

  const handleChangeForm = (e) => {
    const { name, value, files } = e.target;

    if (name === "pic" && files.length > 0) {
      setUser((prev) => ({
        ...prev,
        pic: URL.createObjectURL(files[0]),
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }))
      console.log(name,value);
    }
  };

  const toggleForm = (formType) => {
    setIsLogin(formType === "login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Header con logo */}
      <div className="text-center md:mb-8">
        <div className="md:w-20 md:h-20 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <span className="text-white md:text-2xl text-sm font-bold">MT</span>
        </div>
        <h1 className="md:text-4xl text-lg font-light text-gray-800">MyTalk App</h1>
        <p className="text-gray-600 mt-2 md:text-2xl text-sm mb-2">Conéctate y comunícate</p>
      </div>

      {/* Toggle buttons */}
      <div className="flex justify-center md:mb-6 mb-2 md:w-full w-[200px] max-w-md bg-white/20 backdrop-blur-md rounded-full p-1 shadow-inner">
        <button
          onClick={() => toggleForm("login")}
          className={`w-1/2 md:py-3 py-0 rounded-full transition-all ease duration-100 font-medium md:text-xl text-sm ${
            isLogin
              ? "bg-white/80 backdrop-blur-md shadow-md text-blue-600"
              : "bg-transparent text-gray-600 hover:bg-white/10"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => toggleForm("signup")}
          className={`w-1/2 md:py-3 py-0 rounded-full transition-all ease duration-100 font-medium ${
            !isLogin
              ? "bg-white/80 backdrop-blur-md shadow-md text-purple-600"
              : "bg-transparent text-gray-600 hover:bg-white/10"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Formulario */}
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/50">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </h2>
        <form className="flex flex-col gap-5">
          {!isLogin && (
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Nombre de Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={user.name}
                  onChange={handleChangeForm}
                  placeholder="Nombre de usuario"
                  className="pl-10 w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ease"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChangeForm}
                placeholder="Correo electrónico"
                className="pl-10 w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ease"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleChangeForm}
                value={user.password}
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
              <label
                htmlFor="pic"
                className="text-sm font-medium text-gray-700"
              >
                Imagen de perfil
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image size={18} className="text-gray-500" />
                </div>
                <input
                  type="file"
                  id="pic"
                  name="pic"
                  className="pl-10 w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ease"
                  onChange={handleChangeForm}
                />
              </div>
              {user.pic && (
                <img
                  src={user.pic}
                  alt="Imagen de perfil"
                  className="mt-4 rounded-full w-48 h-48 object-cover place-self-center"
                />
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
            className={`mt-2 py-3 rounded-lg shadow-md transition-all duration-300 font-medium text-white ${
              isLogin
                ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                : "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
            }`}
          >
            {isLogin ? "Ingresar" : "Crear cuenta"}
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
