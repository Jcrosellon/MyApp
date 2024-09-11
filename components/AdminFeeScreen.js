import React from 'react';
import { View, Button, Alert } from 'react-native';
import api from '../api/axios'; // Importa Axios

export default function AdminFeeScreen() {
  const handleGenerateFee = async () => {
    try {
      const response = await api.post('/generate-fee'); // Endpoint de ejemplo
      Alert.alert('Cuota Generada', 'La cuota de administración ha sido generada');
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar la cuota');
      console.error(error);
    }
  };

  const handlePrintFee = () => {
    // Lógica para imprimir cuota
    Alert.alert('Imprimir Cuota', 'Imprimiendo la cuota...');
  };

  return (
    <View>
      <Button title="Generar Cuota de Administración" onPress={handleGenerateFee} />
      <Button title="Imprimir Cuota" onPress={handlePrintFee} />
    </View>
  );
}
