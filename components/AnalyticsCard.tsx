import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

interface AnalyticsData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  gradient: readonly string[];
}

interface AnalyticsCardProps {
  data: AnalyticsData;
}

export function AnalyticsCard({ data }: AnalyticsCardProps) {
  const getTrendIcon = () => {
    if (data.trend === 'up') {
      return <TrendingUp size={16} color={colors.main.deepBlueGray} />;
    }
    if (data.trend === 'down') {
      return <TrendingDown size={16} color={colors.main.deepBlueGray} />;
    }
    return null;
  };

  return (
    <TouchableOpacity style={globalStyles.analyticsCardContainer}>
      <View style={[globalStyles.analyticsCard, { backgroundColor: colors.main.deepBlueGray }]}>
        <View style={globalStyles.analyticsCardHeader}>
          <View style={globalStyles.analyticsCardIconContainer}>
            {data.icon}
          </View>
          {getTrendIcon()}
        </View>
        <Text style={globalStyles.analyticsCardTitle}>{data.title}</Text>
        <Text style={globalStyles.analyticsCardValue}>{data.value}</Text>
        <Text style={globalStyles.analyticsCardChange}>{data.change}</Text>
      </View>
    </TouchableOpacity>
  );
}