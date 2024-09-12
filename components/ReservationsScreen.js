import React, { useEffect, useState } from 'react'; // Asegúrate de importar useEffect y useState
import { View, Text, Button, FlatList, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../api/axios';


const ReservationsScreen = ({ navigation }) => {
    const [reservas, setReservas] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

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
        // Lógica para manejar la reserva
        // Por ejemplo, mostrar un selector de fecha
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setSelectedDate(selectedDate);
            // Lógica para manejar la fecha seleccionada
        }
    };

    return (
        <View>
            <FlatList
                data={reservas}
                renderItem={renderReserva}
                keyExtractor={item => item.ID.toString()}
            />
            {showDatePicker && (
                <DateTimePicker
                    mode="date"
                    value={selectedDate}
                    onChange={onDateChange}
                />
            )}
        </View>
    );
};

export default ReservationsScreen;
