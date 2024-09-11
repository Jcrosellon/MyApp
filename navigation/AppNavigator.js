import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../components/LoginScreen';
import ReservationsScreen from '../components/ReservationsScreen';
import AdminFeeScreen from '../components/AdminFeeScreen';
import PQRScreen from '../components/PQRScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Reservations" component={ReservationsScreen} />
      <Tab.Screen name="AdminFee" component={AdminFeeScreen} />
      <Tab.Screen name="PQR" component={PQRScreen} />
    </Tab.Navigator>
  );
}
