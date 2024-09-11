// /Users/mariapaz/MyApp/services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para guardar el token
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error("Error saving token", error);
  }
};

// Función para obtener el token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error("Error retrieving token", error);
  }
};
