import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import React, {FC} from 'react';

interface IconProps {
  color?: string;
  size: number;
  name: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons';
}
const Icon: FC<IconProps> = ({color, size, name, iconFamily}) => {
  return (
    <React.Fragment>
      {iconFamily === 'Ionicons' && (
        <Ionicons name={name} color={color} size={RFValue(size)} />
      )}
      {iconFamily === 'MaterialIcons' && (
        <MaterialIcons name={name} color={color} size={RFValue(size)} />
      )}
      {iconFamily === 'MaterialCommunityIcons' && (
        <MaterialCommunityIcons
          name={name}
          color={color}
          size={RFValue(size)}
        />
      )}
    </React.Fragment>
  );
};

export default Icon;
