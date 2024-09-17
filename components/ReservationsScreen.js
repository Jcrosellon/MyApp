// components/ReservationsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, Button, Image, StyleSheet } from 'react-native';
import axios from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationsScreen = () => {
    const [zonasComunes, setZonasComunes] = useState([]);

    useEffect(() => {
        const fetchZonasComunes = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('/areas_comunes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setZonasComunes(response.data);
            } catch (error) {
                Alert.alert('Error', 'No se pudieron cargar las áreas comunes.');
            }
        };

        fetchZonasComunes();
    }, []);

    const handleReserve = async (id) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userId = await AsyncStorage.getItem('userId');

            console.log('Token:', token); // Verifica que el token esté disponible
            console.log('User ID:', userId); // Verifica que el ID de usuario esté disponible

            if (!userId) {
                Alert.alert('Error', 'No se ha encontrado el ID de usuario.');
                return;
            }

            const response = await axios.post(`/reservas/create`, {
                ID_AREA_COMUN: id,
                FECHA_RESERVA: new Date().toISOString().split('T')[0],
                ESTADO_RESERVA: 'Pendiente',
                ID_USUARIO: userId,
                VALOR: 100
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert('Reserva exitosa', 'Tu reserva ha sido realizada con éxito.');
        } catch (error) {
            console.error('Error al realizar la reserva:', error.response || error);
            Alert.alert('Error', 'Hubo un problema al realizar la reserva.');
        }
    };

    const renderZonaComun = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.NOMBRE}</Text>
            {item.IMAGEN_URL ? (
                <Image source={{ uri: item.IMAGEN_URL }} style={styles.image} />
            ) : (
                <Text>No hay imagen disponible</Text>
            )}
            <Text>{item.DESCRIPCION}</Text>
            <Text>Precio: {item.PRECIO}</Text>
            <Button title="Reservar" onPress={() => handleReserve(item.ID)} />
        </View>
    );

    return (
        <FlatList
            data={zonasComunes}
            renderItem={renderZonaComun}
            keyExtractor={(item) => item.ID.toString()}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 10,
        margin: 20,
        backgroundColor: '#fff',
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: 'black',
        shadowOffset: { width: 7, height: 13 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        borderRadius: 8,
    },
});

export default ReservationsScreen;
