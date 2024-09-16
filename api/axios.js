import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // Asegúrate de que esta URL sea correcta
  timeout: 10000,
});

export default instance;
