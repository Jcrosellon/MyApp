import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function PQRScreen() {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);

  const handleSendPQR = () => {
    // Lógica para enviar PQR
    Alert.alert('PQR Enviado', 'Tu PQR ha sido enviado');
  };

  return (
    <View>
      <Text>Tipo de PQR:</Text>
      <TextInput value={type} onChangeText={setType} />
      <Text>Mensaje:</Text>
      <TextInput value={message} onChangeText={setMessage} />
      <Button title="Cargar Archivos" onPress={() => {/* Lógica para cargar archivos */}} />
      <Button title="Enviar PQR" onPress={handleSendPQR} />
      <Button title="Volver" onPress={() => {/* Lógica para volver */}} />
    </View>
  );
}
