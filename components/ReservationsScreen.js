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
            const response = await axios.post(`/areas_comunes/reservar/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Alert.alert('Reserva exitosa', 'Tu reserva ha sido realizada con éxito.');
        } catch (error) {
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
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
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
