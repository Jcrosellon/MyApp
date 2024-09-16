import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Actualizado
import api from '../api/axios'; // Asegúrate de importar el axios correctamente

export default function PQRScreen() {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [pqrTypes, setPqrTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(''); // Estado para el tipo seleccionado

  useEffect(() => {
    // Fetch PQR types from the server
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
      formData.append('ESTADO_ID', 1);  // Cambia esto según el estado necesario
      formData.append('USUARIO_ID', 1);  // Cambia esto según el usuario necesario
      formData.append('PQR_TIPO_ID', selectedType);  // Usa el tipo seleccionado
      formData.append('FECHA_SOLICITUD', new Date().toISOString());
      formData.append('FECHA_RESPUESTA', '');  // Cambia esto si es necesario
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

      Alert.alert('PQR Enviado', 'Tu PQR ha sido enviado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la PQR');
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Tipo de PQR:</Text>
      <Picker
        selectedValue={selectedType}
        onValueChange={(itemValue) => setSelectedType(itemValue)}
      >
        {pqrTypes.map((type) => (
          <Picker.Item key={type.ID} label={type.NOMBRE} value={type.ID} />
        ))}
      </Picker>
      <Text>Mensaje:</Text>
      <TextInput placeholder="Mensaje" value={message} onChangeText={setMessage} />
      <Button title="Cargar Archivos" onPress={handleSelectFiles} />
      <Button title="Enviar PQR" onPress={handleSendPQR} />
      <Button title="Volver" onPress={() => {/* Lógica para volver */ }} />
    </View>
  );
}
