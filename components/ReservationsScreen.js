import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import axios from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment-timezone';

const ReservationsScreen = () => {
    const [zonasComunes, setZonasComunes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [reservationDuration, setReservationDuration] = useState(2); // Duración en horas

    useEffect(() => {
        const fetchZonasComunes = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('/areas_comunes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setZonasComunes(response.data);
            } catch (error) {
                console.error('Error fetching areas comunes:', error.response || error);
                Alert.alert('Error', 'No se pudieron cargar las áreas comunes.');
            }
        };

        fetchZonasComunes();
    }, []);

    const handleDateConfirm = (date) => {
        setSelectedDate(date.toISOString().split('T')[0]);
        setDatePickerVisibility(false);
    };

    const handleTimeConfirm = (time) => {
        // Ajusta la hora a la zona horaria local de Bogotá
        const selectedTimeStr = time.toISOString().split('T')[1].slice(0, 5);
        setSelectedTime(selectedTimeStr);
        setTimePickerVisibility(false);
    };

    const handleReserve = async () => {
        if (!selectedDate || !selectedTime) {
            Alert.alert('Error', 'Debes seleccionar una fecha y una hora para la reserva.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const userId = await AsyncStorage.getItem('userId');
            const emailUsuario = await AsyncStorage.getItem('email');

            if (!userId || !emailUsuario) {
                Alert.alert('Error', 'No se han encontrado los datos del usuario.');
                return;
            }

            const estadoReservaId = 1; // ID fijo para "Pendiente"

            // Crear las fechas en el formato 'YYYY-MM-DD HH:mm:ss' en la zona horaria de Bogotá
            const startDateObj = moment.tz(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD HH:mm', 'America/Bogota').toDate();
            const endDateObj = new Date(startDateObj.getTime() + reservationDuration * 60 * 60 * 1000); // Sumar 2 horas

            const startDateTime = moment(startDateObj).format('YYYY-MM-DD HH:mm:ss');
            const endDateTime = moment(endDateObj).format('YYYY-MM-DD HH:mm:ss');

            // Asegurarse de que el email_usuario también se envíe al servidor
            const response = await axios.post(`/reservas/create`, {
                ID_AREA_COMUN: currentItemId,
                FECHA_RESERVA: startDateTime,
                FECHA_FIN: endDateTime,
                ID_ESTADO_RESERVA: estadoReservaId,
                ID_USUARIO: userId,
                VALOR: 100,
                email_usuario: emailUsuario // Enviar el email
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert('Reserva exitosa', 'Tu reserva ha sido realizada con éxito.');
            setSelectedDate(null);
            setSelectedTime(null);
            setModalVisible(false);
        } catch (error) {
            console.error('Error al realizar la reserva:', error.response || error);
            // Verifica si hay un error específico de la API
            if (error.response && error.response.data && error.response.data.error) {
                Alert.alert('Error de reserva', error.response.data.error);
            } else {
                Alert.alert('Error', 'Hubo un problema al realizar la reserva.');
            }
        }
    };


    const handleCancel = () => {
        setSelectedDate(null);
        setSelectedTime(null);
        setModalVisible(false);
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
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    setCurrentItemId(item.ID);
                    setModalVisible(true);
                }}
            >
                <Text style={styles.buttonText}>Reservar</Text>
            </TouchableOpacity>

            {/* Modal para selección de fecha y hora */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    handleCancel();
                }}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Selecciona la fecha y hora</Text>
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                        <Text style={styles.dateText}>{selectedDate || 'Seleccionar fecha'}</Text>
                    </TouchableOpacity>
                    {isDatePickerVisible && (
                        <DateTimePickerModal
                            isVisible={true}
                            mode="date"
                            onConfirm={handleDateConfirm}
                            onCancel={() => setDatePickerVisibility(false)}
                        />
                    )}
                    <TouchableOpacity onPress={() => setTimePickerVisibility(true)}>
                        <Text style={styles.dateText}>{selectedTime || 'Seleccionar hora'}</Text>
                    </TouchableOpacity>
                    {isTimePickerVisible && (
                        <DateTimePickerModal
                            isVisible={true}
                            mode="time"
                            onConfirm={handleTimeConfirm}
                            onCancel={() => setTimePickerVisibility(false)}
                        />
                    )}
                    {/* Mostrar horario inicial y final */}
                    <Text style={styles.dateText}>
                        Hora de inicio: {selectedTime} - Hora de fin: {selectedTime ? moment.tz(`${selectedDate} ${selectedTime}`, 'America/Bogota').add(reservationDuration, 'hours').format('HH:mm') : 'N/A'}
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={handleReserve}
                    >
                        <Text style={styles.textStyle}>Confirmar Reserva</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonCancel]}
                        onPress={handleCancel}
                    >
                        <Text style={styles.textStyle}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
        padding: 8,
        margin: 6,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 150,
        marginBottom: 8,
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#A6A6A6FF',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalView: {
        marginTop: 190,
        margin: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonClose: {
        backgroundColor: '#A6A6A6FF',
    },
    buttonCancel: {
        backgroundColor: '#A6A6A6FF', // Un color rojo para el botón de cancelar
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dateText: {
        fontSize: 16,
        marginVertical: 10,
    },
    modalText: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
});

export default ReservationsScreen;
