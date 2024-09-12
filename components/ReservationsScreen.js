import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, FlatList, Alert } from 'react-native';
import axios from '../api/axios'; // Archivo axios.js
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para obtener el token

const ReservationsScreen = () => {
    const [zonasComunes, setZonasComunes] = useState([]);

    useEffect(() => {
        const fetchZonasComunes = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('/zonas_comunes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setZonasComunes(response.data);
            } catch (error) {
                Alert.alert('Error', 'No se pudieron cargar las zonas comunes.');
            }
        };

        fetchZonasComunes();
    }, []);

    const renderZonaComun = ({ item }) => (
        <View>
            <Image source={{ uri: item.IMAGEN_URL }} style={{ width: 100, height: 100 }} />
            <Text>{item.NOMBRE}</Text>
            <Text>{item.DESCRIPCION}</Text>
            <Text>Precio: {item.PRECIO}</Text>
            <Button title="Reservar" onPress={() => handleReserva(item.ID)} />
        </View>
    );

    const handleReserva = async (idZonaComun) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post('/reservas', {
                ID_ZONA_COMUN: idZonaComun,
                FECHA_RESERVA: new Date().toISOString().split('T')[0],
                ID_USUARIO: 1, // Aquí debes usar el ID del usuario logueado
                ESTADO_RESERVA: 'Pendiente',
                OBSERVACION_ENTREGA: '',
                OBSERVACION_RECIBE: '',
                VALOR: 0 // Puedes ajustar el valor de acuerdo al precio de la zona
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert('Reserva exitosa', 'Tu reserva ha sido creada.');
        } catch (error) {
            Alert.alert('Error', 'No se pudo realizar la reserva.');
        }
    };

    return (
        <View>
            <Text>Zonas Comunes Disponibles</Text>
            <FlatList
                data={zonasComunes}
                renderItem={renderZonaComun}
                keyExtractor={(item) => item.ID.toString()}
            />
        </View>
    );
};

export default ReservationsScreen;
