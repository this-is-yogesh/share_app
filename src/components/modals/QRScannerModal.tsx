import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {FC, useState, useEffect} from 'react';
import {modalStyles} from '../../styles/modalStyles';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../global/CustomText';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import Icon from '../global/Icon';
import {useTCP} from '../../service/TCPProvider';
// import {useCameraDevice, Camera, CodeScanner} from 'react-native-vision-camera';
import DeviceInfo from 'react-native-device-info';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}
const QRScannerModal: FC<ModalProps> = ({visible, onClose}) => {
  const [codeFound, setCodeFound] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  // const useGetCameraDevice = DeviceInfo.isEmulatorSync()
  //   ? () => undefined
  //   : useCameraDevice;
  //const device = useGetCameraDevice('back');
  const shimmerTranslateX = useSharedValue(-300);
  const [loading, setLoading] = useState(true);
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{translateX: shimmerTranslateX.value}],
  }));

  const {connectToServer, isConnected} = useTCP();

  useEffect(() => {
    const checkCameraPermission = async () => {
      // const cameraPermission = await Camera.requestCameraPermission();
      // setHasPermission(cameraPermission === 'granted');
    };
    checkCameraPermission();
    if (visible) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [visible]);
  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(300, {duration: 1500, easing: Easing.linear}),
      -1,
      false,
    );
  }, [shimmerTranslateX]);

  const handleScan = (data: any) => {
    const [connectionData, deviceName] = data.replace('tcp://', '').split('|');
    const [host, port] = connectionData?.split(':');

    connectToServer(host, parseInt(port, 10), deviceName);
  };

  // const codeScanner = useMemo<CodeScanner>(
  //   () => ({
  //     codeTypes: ['qr', 'codabar'],
  //     onCodeScanned: codes => {
  //       if (codeFound) {
  //         return;
  //       }
  //       console.log(`Scanned ${codes?.length} codes!`);
  //       if (codes?.length > 0) {
  //         const scannedData = codes[0].value;
  //         console.log(scannedData);
  //         setCodeFound(true);
  //         handleScan(scannedData);
  //       }
  //     },
  //   }),
  //   [codeFound],
  // );
  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      presentationStyle="formSheet"
      onRequestClose={onClose}
      animationType="slide">
      <View style={modalStyles.modalContainer}>
        <TouchableOpacity
          onPress={() => onClose()}
          style={modalStyles.closeButton}>
          <Icon name="close" iconFamily="Ionicons" size={24} color="#000" />
        </TouchableOpacity>
        <View style={modalStyles.qrContainer}>
          {loading ? (
            <View style={modalStyles.skeleton}>
              <Animated.View style={[modalStyles.shimmerOverlay, shimmerStyle]}>
                <LinearGradient
                  colors={['#f3f3f3', '#fff', '#f3f3f3']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={modalStyles.shimmerGradient}
                />
              </Animated.View>
            </View>
          ) : (
            <>
              {hasPermission ? (
                <View style={modalStyles.skeleton}>
                  <Image
                    source={require('../../assets/images/no_camera.png')}
                    style={modalStyles.noCameraImage}
                  />
                </View>
              ) : (
                <View style={modalStyles.skeleton}>
                  {/* <Camera
                    style={modalStyles.camera}
                    isActive={visible}
                    device={device}
                    codeScanner={codeScanner}
                  /> */}
                </View>
              )}
            </>
          )}
        </View>
      </View>
      <View style={modalStyles.info}>
        <CustomText style={modalStyles.infoText1}>
          Ensure you're on the same Wi-Fi network.
        </CustomText>
        <CustomText style={modalStyles.infoText2}>
          Ask the receiver to show a QR code to connect and transfer files.
        </CustomText>

        <ActivityIndicator
          size="small"
          color="#000"
          style={{alignSelf: 'center'}}
        />
      </View>
    </Modal>
  );
};

export default QRScannerModal;
