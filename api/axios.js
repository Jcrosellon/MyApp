import axios from 'axios';

// Crea una instancia de Axios con la configuración base
const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // Asegúrate de que esta URL sea correcta
  timeout: 10000,
});

// Función para crear una PQR
export const createPQR = async (datos) => {
  try {
    const response = await instance.post('/pqr/create', datos);
    console.log('Respuesta del servidor:', response.data);
    return response.data; // Retorna la respuesta si necesitas usarla en otra parte
  } catch (error) {
    console.error('Error al enviar PQR:', error.response);
    throw error; // Opcional: lanza el error para manejarlo más adelante
  }
};

export default instance;
