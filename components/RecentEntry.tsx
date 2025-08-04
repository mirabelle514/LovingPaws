import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Activity, Pill, Calendar } from 'lucide-react-native';
import { globalStyles } from '../styles/globalStyles';

interface Entry {
  id: string;
  petName: string;
  type: string;
  title: string;
  time: string;
  icon: string;
  color: string;
}

interface RecentEntryProps {
  entry: Entry;
}

export function RecentEntry({ entry }: RecentEntryProps) {
  const getIcon = () => {
    switch (entry.icon) {
      case 'pill':
        return <Pill size={20} color={entry.color} />;
      case 'activity':
        return <Activity size={20} color={entry.color} />;
      case 'calendar':
        return <Calendar size={20} color={entry.color} />;
      default:
        return <Activity size={20} color={entry.color} />;
    }
  };

  return (
    <TouchableOpacity style={globalStyles.recentEntryContainer}>
      <View style={[globalStyles.recentEntryIconContainer, { backgroundColor: `${entry.color}20` }]}>
        {getIcon()}
      </View>
      <View style={globalStyles.recentEntryContent}>
        <Text style={globalStyles.recentEntryTitle}>{entry.title}</Text>
        <Text style={globalStyles.recentEntryDetails}>
          {entry.petName} • {entry.type}
        </Text>
        <Text style={globalStyles.recentEntryTime}>{entry.time}</Text>
      </View>
    </TouchableOpacity>
  );
}