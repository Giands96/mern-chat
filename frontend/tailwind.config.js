/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class', // Usa 'class' para controlar manualmente el modo oscuro
    theme: {
      extend: {
        colors: {
          // Aquí puedes personalizar tus colores
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            // ...más tonos si los necesitas
            500: '#0ea5e9',
            900: '#0c4a6e',
          },
          // Puedes añadir más paletas personalizadas
        },
        // Extender otras configuraciones como spacing, typography, etc.
      },
    },
    plugins: [],
  }