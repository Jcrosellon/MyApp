import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import axios from '../api/axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  // Cargar datos almacenados al iniciar
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedRememberMe = await AsyncStorage.getItem('rememberMe');

        if (storedEmail !== null) setEmail(storedEmail);
        if (storedRememberMe !== null) setRememberMe(storedRememberMe === 'true');
      } catch (error) {
        console.error('Error al cargar datos almacenados:', error);
      }
    };

    loadStoredData();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('/users/login', { email, password });
      const { token, userId } = response.data;

      if (rememberMe) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        // Elimina los datos almacenados si "Recordarme" no está seleccionado
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('rememberMe');
      }

      navigation.navigate('ADMIRED');
    } catch (error) {
      Alert.alert('Error de autenticación', 'Usuario o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.rememberMeContainer}>
        <Switch value={rememberMe} onValueChange={setRememberMe} />
        <Text style={styles.rememberMeText}>Recordarme</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 29,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMeText: {
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#A6A6A6FF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
