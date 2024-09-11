// /Users/mariapaz/MyApp/components/ReservationsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import axios from '../api/axios';

const ReservationsScreen = ({ navigation }) => {
    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        axios.get('/reserva')
            .then(response => {
                setReservas(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const renderReserva = ({ item }) => (
        <View>
            <Text>{`Fecha: ${item.FECHA_RESERVA}`}</Text>
            <Text>{`Estado: ${item.ESTADO_RESERVA}`}</Text>
            <Text>{`Valor: ${item.VALOR}`}</Text>
            <Button title="Reservar" onPress={() => handleReserva(item.ID)} />
        </View>
    );

    const handleReserva = (id) => {
        // lógica para manejar la reserva
    };

    return (
        <FlatList
            data={reservas}
            renderItem={renderReserva}
            keyExtractor={item => item.ID.toString()}
        />
    );
};

export default ReservationsScreen;
