import React, { useState } from 'react';
import { View, Button, Text, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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
            <h1>ADMIRED</h1>
            <h2>Cuota de Administración</h2>
            <p><strong>Fecha del mes:</strong> ${feeData.FECHA_MES || 'No disponible'}</p>
            <p><strong>Estado:</strong> ${feeData.ESTADO || 'No disponible'}</p>
            <p><strong>Valor:</strong> ${feeData.VALOR || 'No disponible'}</p>
            <p><strong>No de Apto:</strong> ${feeData.NO_APTO || 'No disponible'}</p>
            <p><strong>Fecha de Pago:</strong> ${feeData.FECHA_PAGO || 'No pagado'}</p>
            <p><strong>Unidad Residencial ID:</strong> ${feeData.UNIDAD_RESIDENCIAL_ID || 'No disponible'}</p>
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {!isFeeGenerated ? (
          <>
            <Text style={styles.instructionText}>
              Si deseas generar tu cuota de administración, oprime el botón "Generar Cuota".
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleGenerateFee}>
              <Text style={styles.buttonText}>Generar Cuota de Administración</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View>
            <Text style={styles.title}>ADMIRED</Text>
            <Text style={styles.title}>Cuota de Administración</Text>
            <Text style={styles.text}>Fecha del Mes: {feeData.FECHA_MES || 'No disponible'}</Text>
            <Text style={styles.text}>Estado: {feeData.ESTADO || 'No disponible'}</Text>
            <Text style={styles.text}>Valor: {feeData.VALOR || 'No disponible'}</Text>
            <Text style={styles.text}>No de Apto: {feeData.NO_APTO || 'No disponible'}</Text>
            <Text style={styles.text}>Fecha de Pago: {feeData.FECHA_PAGO || 'No pagado'}</Text>
            <Text style={styles.text}>Unidad Residencial: {feeData.UNIDAD_RESIDENCIAL_ID || 'No disponible'}</Text>
            <TouchableOpacity style={styles.button} onPress={handlePrintFee}>
              <Text style={styles.buttonText}>Imprimir Cuota</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsFeeGenerated(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    fontFamily: 'monserrat',
  },
  card: {
    marginBottom: 50,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#A6A6A6FF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
    pointerEvents: 'auto',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#A6A6A6FF',
  },
});
