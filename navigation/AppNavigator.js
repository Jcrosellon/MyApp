// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Importa tus pantallas
import LoginScreen from '../components/LoginScreen';
import ReservationsScreen from '../components/ReservationsScreen';
import AdminFeeScreen from '../components/AdminFeeScreen';
import PQRScreen from '../components/PQRScreen';

// Configura los navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Reservations" component={ReservationsScreen} />
      <Tab.Screen name="AdminFee" component={AdminFeeScreen} />
      <Tab.Screen name="PQR" component={PQRScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        {/* Puedes añadir más pantallas aquí */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
