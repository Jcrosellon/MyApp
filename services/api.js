// /Users/mariapaz/MyApp/services/api.js
import api from '../api/axios'; // Asegúrate de ajustar la ruta según tu estructura
import { getToken } from './authService';

// Función para obtener datos protegidos
export const fetchProtectedData = async () => {
  const token = await getToken();
  try {
    const response = await api.get('protected-endpoint', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Token expirado o inválido. Redirigiendo al usuario a la pantalla de login.");
      // Manejar la redirección al login
    } else {
      console.error("Error fetching protected data", error);
    }
  }
};
