import React, { useState } from 'react';
import { View, Button, Text, Alert, ScrollView } from 'react-native';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Cambia la importación de RNPrint a expo-print si decides usar expo-print
import * as Print from 'expo-print';

export default function AdminFeeScreen() {
  const [feeData, setFeeData] = useState(null);
  const [isFeeGenerated, setIsFeeGenerated] = useState(false);

  const handleGenerateFee = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se encontró el ID de usuario');
        return;
      }

      // Obtener las cuotas del usuario
      const response = await api.get(`/cuotas_administracion/user/${userId}`);

      console.log('Respuesta de la API:', response.data);

      if (response.data.response === 404) {
        Alert.alert('Sin Cuotas Disponibles', response.data.message);
        setFeeData(null); // Asegúrate de limpiar los datos previos
        setIsFeeGenerated(false);
      } else {
        setFeeData(response.data.data); // Asigna los datos de la cuota
        setIsFeeGenerated(true);
        Alert.alert('Cuota Encontrada', 'La cuota se ha cargado correctamente.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la cuota.');
      console.error('Error al obtener la cuota:', error);
    }
  };

  const handlePrintFee = async () => {
    if (feeData) {
      try {
        // Usa Print.printAsync si estás usando expo-print
        await Print.printAsync({
          html: `
            <h1>Cuota de Administración</h1>
            <p>Fecha del mes: ${feeData.FECHA_MES || 'No disponible'}</p>
            <p>Estado: ${feeData.ESTADO || 'No disponible'}</p>
            <p>Valor: ${feeData.VALOR || 'No disponible'}</p>
            <p>No Apto: ${feeData.NO_APTO || 'No disponible'}</p>
            <p>Fecha de Pago: ${feeData.FECHA_PAGO || 'No pagado'}</p>
          `,
        });
      } catch (error) {
        Alert.alert('Error', 'No se pudo imprimir la cuota.');
        console.error(error);
      }
    } else {
      Alert.alert('Error', 'No hay cuota para imprimir.');
    }
  };

  return (
    <ScrollView>
      <View>
        <Button title="Generar Cuota de Administración" onPress={handleGenerateFee} />

        {/* Solo mostrar los detalles de la cuota si hay datos */}
        {feeData ? (
          <View>
            <Text>Fecha del Mes: {feeData.FECHA_MES || 'No disponible'}</Text>
            <Text>Estado: {feeData.ESTADO || 'No disponible'}</Text>
            <Text>Valor: {feeData.VALOR || 'No disponible'}</Text>
            <Text>No de Apto: {feeData.NO_APTO || 'No disponible'}</Text>

            <Text>Fecha de Pago: {feeData.FECHA_PAGO || 'No pagado'}</Text>
          </View>
        ) : (
          <Text>No hay cuota disponible para mostrar.</Text>
        )}

        {/* Mostrar el botón "Imprimir Cuota" solo si se ha generado una cuota */}
        {isFeeGenerated && (
          <Button title="Imprimir Cuota" onPress={handlePrintFee} />
        )}
      </View>
    </ScrollView>
  );
}
