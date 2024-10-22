import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import api from '../api/axios';

export default function PQRScreen() {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [pqrTypes, setPqrTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchPqrTypes = async () => {
      try {
        const response = await api.get('/pqr_tipo');
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
        setFiles(result.selected); // Cambia result.files a result.selected
      }
    } catch (error) {
      console.error('Error selecting files:', error);
    }
  };


  const handleSendPQR = async () => {
    if (!selectedType || !message) {
      Alert.alert('Error', 'Por favor selecciona el tipo de PQR y escribe tu mensaje.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        Alert.alert('Error', 'El ID del usuario no está disponible.');
        return;
      }

      // Asignación de IDs
      const estadoId = 1; // Este ID debe existir en la tabla de estados
      const usuarioId = parseInt(userId); // Asegúrate de que sea un número
      const pqrTipoId = parseInt(selectedType); // Asegúrate de que sea un número

      const formData = new FormData();
      formData.append('DETALLE', message);
      formData.append('ESTADO_ID', estadoId);
      formData.append('USUARIO_ID', usuarioId);
      formData.append('PQR_TIPO_ID', pqrTipoId);
      formData.append('FECHA_SOLICITUD', new Date().toISOString());
      formData.append('RESPUESTA', '');

      // Solo agregar archivos si existen
      if (files.length > 0) {
        files.forEach((file, index) => {
          if (file) {
            formData.append(`file_${index}`, {
              uri: file.uri,
              name: file.name,
              type: file.mimeType || 'application/octet-stream',
            });
          }
        });
      } else {
        console.log('No se seleccionaron archivos para enviar.');
      }

      // Log de los datos a enviar
      console.log('Datos enviados:', {
        DETALLE: message,
        ESTADO_ID: estadoId,
        USUARIO_ID: usuarioId,
        PQR_TIPO_ID: pqrTipoId,
        FECHA_SOLICITUD: new Date().toISOString(),
        RESPUESTA: '',
        files: files.length > 0 ? files : 'No se enviaron archivos',
      });

      const response = await api.post('/pqr/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Respuesta del servidor:', response);

      if (response.data.message) {
        Alert.alert('Éxito', response.data.message);
        // Limpieza de estado
        setMessage('');
        setFiles([]);
        setSelectedType('');
      } else {
        Alert.alert('Error', 'No se recibió respuesta del servidor');
      }

    } catch (error) {
      console.error('Error al enviar PQR:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        const errorMessage = error.response.data.message || 'No se pudo enviar la PQR';
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', 'No se pudo enviar la PQR');
      }
    }
  };



  return (
    <ScrollView>
      <View style={styles.card}>
        <Text style={styles.infoText}>
          Si tienes peticiones, quejas, reclamos o sugerencias, llena los datos y da clic en "Enviar PQR".
        </Text>

        <Text style={styles.title}>Tipo de PQR</Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedType}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
        >
          {pqrTypes.length > 0 ? (
            pqrTypes.map((type) => (
              <Picker.Item key={type.ID} label={type.NOMBRE} value={type.ID} />
            ))
          ) : (
            <Picker.Item label="Cargando tipos..." value="" />
          )}
        </Picker>

        <Text style={styles.title}>Mensaje</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Escribe tu mensaje aquí"
          value={message}
          multiline={true}
          numberOfLines={6}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.button} onPress={handleSelectFiles}>
          <Text style={styles.buttonText}>Cargar Archivos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSendPQR}>
          <Text style={styles.buttonText}>Enviar PQR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    margin: 10,
    marginTop: -10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  infoText: {
    fontSize: 22,
    lineHeight: 24,
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    marginTop: -10,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  picker: {
    marginTop: -50,
    padding: 10,
    marginBottom: -30,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    height: 120,
    marginTop: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#A6A6A6FF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
