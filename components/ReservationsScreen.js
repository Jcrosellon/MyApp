import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import api from '../api/axios'; // Importa Axios

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('/reservations'); // Endpoint de ejemplo
        setReservations(response.data);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar las reservas');
        console.error(error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <View>
      {reservations.map((reservation, index) => (
        <View key={index}>
          <Text>{reservation.name}</Text>
          <Button title="Reserve" onPress={() => {/* lógica para reservar */}} />
        </View>
      ))}
    </View>
  );
}
