import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {FC, useState, useEffect} from 'react';
import {modalStyles} from '../../styles/modalStyles';
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../global/CustomText';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import {multiColor} from '../../utils/Constants';
import Icon from '../global/Icon';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}
const QRGeneratorModal: FC<ModalProps> = ({visible, onClose}) => {
  const shimmerTranslateX = useSharedValue(-300);
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{translateX: shimmerTranslateX.value}],
  }));

  // useEffect(() => {
  //   if (visible) {
  //     setLoading(true);
  //     const timer = setTimeout(() => setLoading(false), 400);
  //     return () => clearTimeout(timer);
  //   }
  // }, [visible]);

  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(300, {duration: 1500, easing: Easing.linear}),
      -1,
      false,
    );
  }, [visible, shimmerTranslateX]);
  const [loading, setLoading] = useState(true);
  const [qrValue, setQrValue] = useState('Dheeraj');
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
          {loading || !qrValue ? (
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
            <QRCode
              value={qrValue}
              size={250}
              logoSize={60}
              logoBackgroundColor="#fff"
              logoMargin={2}
              logoBorderRadius={10}
              logo={require('../../assets/images/profile2.jpg')}
              linearGradient={multiColor}
              enableLinearGradient
            />
          )}
        </View>
      </View>
      <View style={modalStyles.info}>
        <CustomText style={modalStyles.infoText1}>
          Ensure you're on the same Wi-Fi network.
        </CustomText>
        <CustomText style={modalStyles.infoText2}>
          Ask the sender to scan this QR code to connect and transfer files.
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

export default QRGeneratorModal;
