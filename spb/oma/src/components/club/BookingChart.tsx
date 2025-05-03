import React, { FC, useState, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { getBookingStats } from '@/mock/booking_stats';

interface BookingChartProps {
  theme: IColorScheme;
}

type PeriodType = 'day' | 'week' | 'month';

const BookingChart: FC<BookingChartProps> = ({ theme }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('day');
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const styles = createStyles(theme);
  
  const bookingStats = getBookingStats(selectedPeriod);
  const screenWidth = Dimensions.get('window').width - wp(8);
  
  // Get labels and data for the selected unit
  const getChartData = () => {
    const unitData = bookingStats[selectedUnitIndex];
    if (!unitData) return { labels: [], data: [] };
    
    let labels: string[] = [];
    let data: number[] = [];
    
    switch (selectedPeriod) {
      case 'day':
        labels = unitData.bookings.map(b => b.date.split('-')[2]); // Get day part
        data = unitData.bookings.map(b => b.count);
        break;
      case 'week':
        labels = unitData.bookings.map(b => b.week.replace('Week ', 'W'));
        data = unitData.bookings.map(b => b.count);
        break;
      case 'month':
        labels = unitData.bookings.map(b => b.month);
        data = unitData.bookings.map(b => b.count);
        break;
    }
    
    return { labels, data };
  };
  
  const { labels, data } = getChartData();
  
  const chartData = {
    labels,
    datasets: [
      {
        data,
        color: (opacity = 1) => theme.primary,
        strokeWidth: 2
      }
    ],
    legend: [`${bookingStats[selectedUnitIndex]?.unitName || 'Unit'} Bookings`]
  };
  
  const chartConfig = {
    backgroundGradientFrom: theme.white,
    backgroundGradientTo: theme.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(254, 119, 67, ${opacity})`,
    labelColor: (opacity = 1) => theme.textDark,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.primary
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Booking Statistics</Text>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'day' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('day')}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'day' && styles.periodButtonTextActive]}>
              Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.unitSelector}>
        {bookingStats.map((unit, index) => (
          <TouchableOpacity
            key={unit.unitId}
            style={[styles.unitButton, selectedUnitIndex === index && styles.unitButtonActive]}
            onPress={() => setSelectedUnitIndex(index)}
          >
            <Text style={[styles.unitButtonText, selectedUnitIndex === index && styles.unitButtonTextActive]}>
              {unit.unitName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: IColorScheme) => StyleSheet.create({
  container: {
    backgroundColor: theme.white,
    borderRadius: Radius.md,
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  title: {
    ...fontFamily.RALEWAY_BOLD,
    fontSize: fontSize.lg,
    color: theme.textDark,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundLight,
    borderRadius: Radius.full,
    padding: wp(1),
  },
  periodButton: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: Radius.full,
  },
  periodButtonActive: {
    backgroundColor: theme.primary,
  },
  periodButtonText: {
    ...fontFamily.POPPINS_MEDIUM,
    fontSize: fontSize.xs,
    color: theme.textMedium,
  },
  periodButtonTextActive: {
    color: theme.white,
  },
  unitSelector: {
    flexDirection: 'row',
    marginBottom: hp(2),
    flexWrap: 'wrap',
  },
  unitButton: {
    backgroundColor: theme.backgroundLight,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: Radius.full,
    marginRight: wp(2),
    marginBottom: hp(1),
  },
  unitButtonActive: {
    backgroundColor: theme.primary,
  },
  unitButtonText: {
    ...fontFamily.POPPINS_MEDIUM,
    fontSize: fontSize.xs,
    color: theme.textMedium,
  },
  unitButtonTextActive: {
    color: theme.white,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: hp(1),
    borderRadius: Radius.md,
  },
});

export default BookingChart;
