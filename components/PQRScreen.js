import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';


export default function PQRScreen() {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);

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

  const handleSendPQR = () => {
    // Lógica para enviar PQR con archivos
    Alert.alert('PQR Enviado', 'Tu PQR ha sido enviado');
  };

  return (
    <View>
      <Text>Tipo de PQR:</Text>
      <TextInput placeholder="Tipo de PQR" value={type} onChangeText={setType} />
      <Text>Mensaje:</Text>
      <TextInput placeholder="Mensaje" value={message} onChangeText={setMessage} />
      <Button title="Cargar Archivos" onPress={handleSelectFiles} />
      <Button title="Enviar PQR" onPress={handleSendPQR} />
      <Button title="Volver" onPress={() => {/* Lógica para volver */ }} />
    </View>
  );
}
