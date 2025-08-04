import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  titleColor?: string;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
}

export function SettingsItem({
  icon,
  title,
  titleColor = colors.text.primary,
  showChevron = false,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      style={globalStyles.settingsItemContainer}
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={globalStyles.settingsItemIconContainer}>
        {icon}
      </View>
      <Text style={[globalStyles.settingsItemTitle, { color: titleColor }]}>{title}</Text>
      <View style={globalStyles.settingsItemRightSection}>
        {showSwitch && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
                    trackColor={{ false: colors.border.light, true: colors.background.tertiary }}
        thumbColor={switchValue ? colors.main.deepBlueGray : colors.background.primary}
        ios_backgroundColor={colors.border.light}
          />
        )}
        {showChevron && (
                      <ChevronRight size={20} color={colors.text.tertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
}