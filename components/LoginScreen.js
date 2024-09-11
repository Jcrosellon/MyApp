import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { saveToken } from '../services/authService'; // Ajusta la ruta según tu estructura
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Asegúrate de que esto esté al principio

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password,
      });
      const { token } = response.data;
      await saveToken(token);
      Alert.alert('Login Successful');
      navigation.navigate('Reservations'); // Navegar a la pantalla de reservas
    } catch (error) {
      Alert.alert('Error en el login', error.response?.data?.error || 'Unknown error');
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
