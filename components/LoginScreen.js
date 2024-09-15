// components/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from '../api/axios'; // Archivo axios.js
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para manejar el token

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Para navegar a la pantalla de pestañas

  const handleLogin = async () => {
    try {
      const response = await axios.post('/users/login', { email, password });
      const { token } = response.data;

      // Almacenar token
      await AsyncStorage.setItem('token', token);

      // Redirigir a la pantalla de pestañas
      navigation.navigate('MainTabs');
    } catch (error) {
      Alert.alert('Error de autenticación', 'Usuario o contraseña incorrectos');
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
