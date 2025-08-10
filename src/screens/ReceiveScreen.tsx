import {View, Text, Platform, TouchableOpacity, Image} from 'react-native';
import React, {FC, useEffect, useState, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {sendStyles} from '../styles/sendStyles';
import {SafeAreaView} from 'react-native';
import Icon from '../components/global/Icon';
import CustomText from '../components/global/CustomText';
import BreakerText from '../components/ui/BreakerText';
import {Colors} from '../utils/Constants';
import LottieView from 'lottie-react-native';
import QRGeneratorModal from '../components/modals/QRGeneratorModal';
import DeviceInfo from 'react-native-device-info';
import {useTCP} from '../service/TCPProvider';
import {getBroadcastIPAddress, getLocalIPAddress} from '../utils/networkUtils';
import dgram from 'react-native-udp';
import {goBack, navigate} from '../utils/NavigationUtil';

const ReceiveScreen: FC = () => {
  const [scannerVisible, setIsScannerVisible] = useState(false);
  const {startServer, server, isConnected} = useTCP();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [qrValue, setQrValue] = useState('');

  const setupServer = async () => {
    const deviceName = await DeviceInfo.getDeviceName();
    const ip = await getLocalIPAddress();
    const port = 4000;
    if (!server) {
      startServer(port);
    }

    setQrValue(`tcp://${ip}:${port}|${deviceName}`);
    console.log(`Server info:${ip} :${port} `);
  };

  const sendDiscoverySignal = async () => {
    const deviceName = await DeviceInfo.getDeviceName();
    const broadcastAddress = await getBroadcastIPAddress();
    const targetAddress = broadcastAddress || '255.255.255.255';
    const port = 57143;

    const client = dgram.createSocket({
      type: 'udp4',
      reusePort: true,
    });

    client.bind(() => {
      try {
        if (Platform.OS === 'ios') {
          client.setBroadcast(true);
        }
        client.send(
          `${qrValue}`,
          0,
          `${qrValue}`.length,
          port,
          targetAddress,
          err => {
            if (err) {
              console.log('Error sending discovery signal', err);
            } else {
              console.log(
                `${deviceName} Discovery Signal Sent To ${targetAddress}`,
              );
            }
            client.close();
          },
        );
      } catch (error) {
        console.log('Failed To set broadCast or send', error);
        client.close();
      }
    });
  };

  useEffect(() => {
    if (!qrValue) return;

    sendDiscoverySignal();
    intervalRef.current = setInterval(sendDiscoverySignal, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [qrValue]);

  
  useEffect(() => {
    if (isConnected) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      navigate('ConnectionScreen');
    }
  }, [isConnected]);

  useEffect(() => {
    setupServer();
  }, []);

  function handleGoBack() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    goBack();
  }
  return (
    <LinearGradient
      colors={['#FFFFFF', '#4DA0DE', '#3387C5']}
      style={sendStyles.container}
      start={{x: 0, y: 1}}
      end={{x: 0, y: 0}}>
      <SafeAreaView />
      <View style={sendStyles.mainContainer}>
        <View style={sendStyles.infoContainer}>
          <Icon
            name="blur-on"
            iconFamily="MaterialIcons"
            color="#fff"
            size={40}
          />
          <CustomText
            fontFamily="Okra-Bold"
            color="#fff"
            fontSize={16}
            style={{marginTop: 20}}>
            Receiving from nearby Devices
          </CustomText>
          <CustomText
            fontFamily="Okra-Medium"
            color="#fff"
            fontSize={12}
            style={{textAlign: 'center'}}>
            Ensure your device is connected to the sender's hotspot network
          </CustomText>
          <BreakerText text="or" />
          <TouchableOpacity
            style={sendStyles.qrButton}
            onPress={() => setIsScannerVisible(true)}>
            <Icon
              name="qrcode"
              iconFamily="MaterialCommunityIcons"
              color={Colors.primary}
              size={16}
            />
            <CustomText fontFamily="Okra-Bold" color={Colors.primary}>
              Show QR
            </CustomText>
          </TouchableOpacity>
        </View>
        <View style={sendStyles.animationContainer}>
          <View style={sendStyles.lottieContainer}>
            <LottieView
              style={sendStyles.lottie}
              source={require('../assets/animations/scan2.json')}
              autoPlay
              loop={true}
              hardwareAccelerationAndroid
            />
          </View>
          <Image
            source={require('../assets/images/profile2.jpeg')}
            style={sendStyles.profileImage}
          />
        </View>

        <TouchableOpacity onPress={handleGoBack} style={sendStyles.backButton}>
          <Icon
            name="arrow-back"
            iconFamily="Ionicons"
            size={16}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      {scannerVisible && (
        <QRGeneratorModal
          visible={scannerVisible}
          onClose={() => setIsScannerVisible(false)}
        />
      )}
    </LinearGradient>
  );
};

export default ReceiveScreen;
