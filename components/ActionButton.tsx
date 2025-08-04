import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
}

export function ActionButton({ title, onPress, variant }: ActionButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity style={globalStyles.actionButtonContainer} onPress={onPress}>
        <View style={[globalStyles.actionButtonPrimary, { backgroundColor: colors.main.deepBlueGray }]}>
          <Text style={globalStyles.actionButtonPrimaryText}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={globalStyles.actionButtonSecondary} onPress={onPress}>
      <Text style={globalStyles.actionButtonSecondaryText}>{title}</Text>
    </TouchableOpacity>
  );
}