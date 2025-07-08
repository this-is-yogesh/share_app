import {View, Text, TextStyle, StyleSheet, Platform} from 'react-native';
import React from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../../utils/Constants';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7';
type PlatformType = 'android' | 'ios';

interface CustomTextProps {
  variant?: Variant;
  fontFamily?:
    | 'Okra-Bold'
    | 'Okra-Regular'
    | 'Okra-Black'
    | 'Okra-Light'
    | 'Okra-Medium';
  fontSize?: number;
  color?: string;
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
  numberOfLines?: number;
  onLayout?: (event: any) => void;
}

const CustomText: React.FC<CustomTextProps> = ({
  variant = 'h4',
  fontFamily = 'Okra-Regular',
  fontSize,
  color = '#000000',
  style,
  children,
  numberOfLines,
  onLayout,
  ...props
}) => {
  let computedFontSize: number =
    Platform.OS === 'android'
      ? RFValue(fontSize || 12)
      : RFValue(fontSize || 10);

  const getVariantFontSize = (variant: Variant): number => {
    switch (variant) {
      case 'h1':
        return 32;
      case 'h2':
        return 28;
      case 'h3':
        return 24;
      case 'h4':
        return 20;
      case 'h5':
        return 18;
      case 'h6':
        return 16;
      case 'h7':
        return 14;
      default:
        return 16;
    }
  };

  const textStyle: TextStyle = {
    fontFamily,
    fontSize: fontSize || getVariantFontSize(variant),
    color,
  };
  const fontSizeMap: Record<Variant, Record<PlatformType, number>> = {
    h1: {android: 24, ios: 22},
    h2: {android: 22, ios: 20},
    h3: {android: 20, ios: 18},
    h4: {android: 18, ios: 16},
    h5: {android: 16, ios: 14},
    h6: {android: 12, ios: 10},
    h7: {android: 10, ios: 8},
  };
  if (variant && fontSizeMap[variant]) {
    const defaultSize = fontSizeMap[variant][Platform.OS as PlatformType];
    computedFontSize = RFValue(fontSize || defaultSize);
  }

  const fontFamilyStyle = {
    fontFamily,
  };

  return (
    <Text
      onLayout={onLayout}
      style={[
        styles.text,
        {color: color || Colors.text, fontSize: computedFontSize},
        fontFamilyStyle,
        style,
      ]}
      numberOfLines={numberOfLines ?? undefined} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});
