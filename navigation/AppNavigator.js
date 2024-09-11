import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../components/LoginScreen';
import ReservationsScreen from '../components/ReservationsScreen';
import AdminFeeScreen from '../components/AdminFeeScreen';
import PQRScreen from '../components/PQRScreen';


const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Reservations" component={ReservationsScreen} />
      <Stack.Screen name="AdminFee" component={AdminFeeScreen} />
      <Stack.Screen name="PQR" component={PQRScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
