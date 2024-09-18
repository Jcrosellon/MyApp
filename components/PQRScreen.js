import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import api from '../api/axios';

export default function PQRScreen() {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [pqrTypes, setPqrTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchPqrTypes = async () => {
      try {
        const response = await api.get('/pqr_tipos');
        setPqrTypes(response.data.data);
      } catch (error) {
        console.error('Error fetching PQR types:', error);
      }
    };

    fetchPqrTypes();
  }, []);

  const handleSelectFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ multiple: true });
      if (result.type === 'success') {
        setFiles(result.files);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendPQR = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('DETALLE', message);
      formData.append('ESTADO_ID', 1);
      formData.append('USUARIO_ID', 1);
      formData.append('PQR_TIPO_ID', selectedType);
      formData.append('FECHA_SOLICITUD', new Date().toISOString());
      formData.append('FECHA_RESPUESTA', '');
      formData.append('RESPUESTA', '');

      files.forEach((file, index) => {
        formData.append(`file_${index}`, {
          uri: file.uri,
          name: file.name,
          type: file.mimeType
        });
      });

      await api.post('/pqr/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // Reset fields after sending PQR
      setMessage('');
      setFiles([]);
      setSelectedType('');
      Alert.alert('PQR Enviado', 'Tu PQR ha sido enviado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la PQR');
      console.error(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.card}>
        <Text style={styles.title}>Tipo de PQR:</Text>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
        >
          {pqrTypes.map((type) => (
            <Picker.Item key={type.ID} label={type.NOMBRE} value={type.ID} />
          ))}
        </Picker>
        <Text style={styles.title}>Mensaje:</Text>
        <TextInput style={styles.input} placeholder="Mensaje" value={message} onChangeText={setMessage} />
        <Button title="Cargar Archivos" onPress={handleSelectFiles} />
        <Button title="Enviar PQR" onPress={handleSendPQR} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 30,
    margin: 30,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    marginBottom: -10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 40,
    marginTop: 20,
    marginBottom: 10,
  },
});
