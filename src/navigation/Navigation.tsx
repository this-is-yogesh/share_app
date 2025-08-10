import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '../utils/NavigationUtil';
import {FC} from 'react';
import ConnectionScreen from '../screens/ConnectionScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import SendScreen from '../screens/SendScreen';
import ReceiveScreen from '../screens/ReceiveScreen';
import { TCPProvider } from '../service/TCPProvider';

const Stack = createNativeStackNavigator();
const Navigation: FC = () => {
  return (
    <TCPProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="ConnectionScreen" component={ConnectionScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} />

          <Stack.Screen name="SendScreen" component={SendScreen} />
          <Stack.Screen name="ReceiveScreen" component={ReceiveScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TCPProvider>
  );
};

export default Navigation;
