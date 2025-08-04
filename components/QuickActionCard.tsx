import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

interface QuickActionCardProps {
  icon: React.ReactElement;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function QuickActionCard({ icon, title, subtitle, onPress }: QuickActionCardProps) {
  return (
    <TouchableOpacity style={globalStyles.quickActionCardContainer} onPress={onPress}>
      <View style={[globalStyles.quickActionCard, { backgroundColor: colors.main.deepBlueGray }]}>
        <View style={globalStyles.quickActionCardIconContainer}>
          {React.cloneElement(icon, {
            color: colors.main.deepBlueGray,
          } as any)}
        </View>
        <Text style={globalStyles.quickActionCardTitle}>{title}</Text>
        <Text style={globalStyles.quickActionCardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}