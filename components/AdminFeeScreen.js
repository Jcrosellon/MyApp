import React, { useState } from 'react';
import { View, Button, Text, Alert, ScrollView, StyleSheet } from 'react-native';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

      const response = await api.get(`/cuotas_administracion/user/${userId}`);
      if (response.data.response === 404) {
        Alert.alert('Sin Cuotas Disponibles', response.data.message);
        setFeeData(null);
        setIsFeeGenerated(false);
      } else {
        setFeeData(response.data.data);
        setIsFeeGenerated(true);

      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la cuota.');
      console.error('Error al obtener la cuota:', error);
    }
  };

  const handlePrintFee = async () => {
    if (feeData) {
      try {
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

      }
    } else {
      Alert.alert('Error', 'No hay cuota para imprimir.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.card}>
        <Button style={styles.button} title="Generar Cuota de Administración" onPress={handleGenerateFee} />
        {feeData ? (
          <View>
            <Text style={styles.text}>Fecha del Mes: {feeData.FECHA_MES || 'No disponible'}</Text>
            <Text style={styles.text}>Estado: {feeData.ESTADO || 'No disponible'}</Text>
            <Text style={styles.text}>Valor: {feeData.VALOR || 'No disponible'}</Text>
            <Text style={styles.text}>No de Apto: {feeData.NO_APTO || 'No disponible'}</Text>
            <Text style={styles.text}>Fecha de Pago: {feeData.FECHA_PAGO || 'No pagado'}</Text>
          </View>
        ) : (
          <Text></Text>
        )}
        {isFeeGenerated && (
          <Button style={styles.button} title="Imprimir Cuota" onPress={handlePrintFee} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 80,
    margin: 30,
    marginTop: 70,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    fontSize: 38,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});
