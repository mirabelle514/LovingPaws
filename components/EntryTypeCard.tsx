import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

interface EntryType {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: readonly string[];
}

interface EntryTypeCardProps {
  type: EntryType;
  isSelected: boolean;
  onSelect: () => void;
}

export function EntryTypeCard({ type, isSelected, onSelect }: EntryTypeCardProps) {
  return (
    <TouchableOpacity style={globalStyles.entryTypeCardContainer} onPress={onSelect}>
      <View
        style={[
          globalStyles.entryTypeCard,
          { backgroundColor: isSelected ? colors.main.deepBlueGray : colors.background.secondary },
          isSelected && globalStyles.entryTypeCardSelected,
          !isSelected && globalStyles.entryTypeCardUnselected,
        ]}
      >
        <View
          style={[
            globalStyles.entryTypeCardIconContainer,
            {
              backgroundColor: isSelected
                ? colors.overlay.light
                : `${colors.main.deepBlueGray}20`,
            },
          ]}
        >
          {React.cloneElement(type.icon as React.ReactElement, {
            color: isSelected ? colors.text.inverse : colors.text.primary,
          } as any)}
        </View>
        <Text style={[globalStyles.entryTypeCardTitle, { color: isSelected ? colors.text.inverse : colors.text.primary }]}>
          {type.title}
        </Text>
        <Text
          style={[
            globalStyles.entryTypeCardSubtitle,
            { color: isSelected ? colors.text.inverse : colors.text.secondary, opacity: isSelected ? 0.9 : 1 },
          ]}
        >
          {type.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}