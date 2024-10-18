import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';

export default function AdminFeeScreen() {
  const [feeData, setFeeData] = useState(null);
  const [isFeeGenerated, setIsFeeGenerated] = useState(false);
  const [unidadResidencialId, setUnidadResidencialId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUnidadResidencialId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        console.log('User ID:', userId);

        if (!userId) throw new Error('No se encontró el ID de usuario en AsyncStorage.');

        // Asegúrate que el endpoint sea correcto
        const response = await api.get(`/unidades_residenciales/user/${userId}`);

        if (response.data && response.data.ID) {
          const id = response.data.ID;
          setUnidadResidencialId(id);
          await saveUnidadResidencialId(id);
          console.log('Response:', response.data);
        } else {
          throw new Error('No se encontró el ID de la unidad residencial.');
        }
      } catch (error) {
        console.error('Error al obtener el ID de la unidad residencial:', error.message);
        Alert.alert('Error', error.response?.data?.message || error.message);
      }
    };

    fetchUnidadResidencialId();
  }, []);

  const saveUnidadResidencialId = async (id) => {
    try {
      await AsyncStorage.setItem('unidadResidencialId', id.toString());
      console.log('Unidad Residencial ID guardado:', id);
    } catch (error) {
      console.error('Error al guardar Unidad Residencial ID:', error);
    }
  };

  const handleGenerateFee = async () => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID de usuario.');

      const response = await api.get(`/cuotas_administracion/user/${userId}`);
      console.log('Response de la API:', response.data); // Verifica la respuesta

      if (response.status === 200 && response.data && response.data.length > 0) {
        // Accede al primer elemento del arreglo
        setFeeData(response.data[0]); // Cambia según la estructura de tu respuesta
        setIsFeeGenerated(true);
      } else if (response.status === 404) {
        Alert.alert('Sin Cuotas Disponibles', 'No se encontró ninguna cuota asociada a este usuario.');
        setIsFeeGenerated(false);
      } else {
        throw new Error('Error inesperado al obtener la cuota.');
      }
    } catch (error) {
      console.error('Error al obtener la cuota:', error.message);
      Alert.alert('Error', error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
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
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : !isFeeGenerated ? (
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
            <Text style={styles.text}>Unidad Residencial ID: {feeData.UNIDAD_RESIDENCIAL_ID || 'No disponible'}</Text>
            <TouchableOpacity style={styles.button} onPress={handlePrintFee}>
              <Text style={styles.buttonText}>Imprimir Cuota</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => {
              setIsFeeGenerated(false);
              setFeeData(null); // Limpiar el feeData al cancelar
            }}>
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
