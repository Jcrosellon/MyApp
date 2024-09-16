import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import api from '../api/axios';

export default function AdminFeeScreen() {
  const [fee, setFee] = useState(null);

  const handleGenerateFee = async () => {
    try {
      const response = await api.post('/cuotas_administracion/generate');
      setFee(response.data.fee); // Asegúrate de que `fee` sea el campo correcto
      Alert.alert('Cuota Generada', `La cuota de administración es ${response.data.fee}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar la cuota');
      console.error(error);
    }
  };

  const handlePrintFee = () => {
    if (fee) {
      Alert.alert('Imprimir Cuota', `Imprimiendo la cuota de ${fee}`);
    } else {
      Alert.alert('Error', 'No hay cuota para imprimir');
    }
  };

  return (
    <View>
      <Button title="Generar Cuota de Administración" onPress={handleGenerateFee} />
      <Button title="Imprimir Cuota" onPress={handlePrintFee} />
    </View>
  );
}
