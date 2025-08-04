import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

const { width } = Dimensions.get('window');

export function HealthTrendChart() {
  // Mock data for the chart
  const chartData = [
    { day: 'Mon', score: 75 },
    { day: 'Tue', score: 80 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 85 },
    { day: 'Fri', score: 82 },
    { day: 'Sat', score: 88 },
    { day: 'Sun', score: 85 },
  ];

  const maxScore = 100;
  const chartHeight = 120;
  const chartWidth = width - 80;

  return (
    <View style={globalStyles.healthTrendChartContainer}>
      <View style={globalStyles.healthTrendChart}>
        <View style={globalStyles.healthTrendChartYAxis}>
          <Text style={globalStyles.healthTrendChartAxisLabel}>100</Text>
          <Text style={globalStyles.healthTrendChartAxisLabel}>75</Text>
          <Text style={globalStyles.healthTrendChartAxisLabel}>50</Text>
          <Text style={globalStyles.healthTrendChartAxisLabel}>25</Text>
          <Text style={globalStyles.healthTrendChartAxisLabel}>0</Text>
        </View>
        
        <View style={globalStyles.healthTrendChartArea}>
          {/* Chart bars */}
          <View style={globalStyles.healthTrendChartBarsContainer}>
            {chartData.map((item, index) => (
              <View key={index} style={globalStyles.healthTrendChartBarColumn}>
                <View
                  style={[
                    globalStyles.healthTrendChartBar,
                    {
                      height: (item.score / maxScore) * chartHeight,
                      backgroundColor: colors.main.deepBlueGray,
                    },
                  ]}
                />
                <Text style={globalStyles.healthTrendChartDayLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      <View style={globalStyles.healthTrendChartLegend}>
        <View style={globalStyles.healthTrendChartLegendItem}>
                      <View style={[globalStyles.healthTrendChartLegendDot, { backgroundColor: colors.main.deepBlueGray }]} />
          <Text style={globalStyles.healthTrendChartLegendText}>Health Score</Text>
        </View>
      </View>
    </View>
  );
}