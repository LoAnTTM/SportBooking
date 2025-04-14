import React, { FC, useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';

import UnitCard from './UnitCard';

interface UnitSectionProps {
  title: string;
}

const UnitSection: FC<UnitSectionProps> = ({ title }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  // Mock data - replace with real data later
  const units = [
    {
      id: '1',
      title: 'Modern Apartment',
      address: '123 Main St, City',
      price: '$1,200/mo',
      image:
        'https://spb-clubs.s3.ap-southeast-1.amazonaws.com/san-bong-da-quyet-tam-2-2032207698+1.png',
      distance: '2.5 km',
    },
    {
      id: '2',
      title: 'Cozy Studio',
      address: '456 Oak Ave, Town',
      price: '$800/mo',
      image:
        'https://spb-clubs.s3.ap-southeast-1.amazonaws.com/san-bong-da-quyet-tam-2-2032207698+1.png',
      distance: '2.5 km',
    },
    {
      id: '3',
      title: 'Luxury Condo',
      address: '789 Pine Rd, Village',
      price: '$2,000/mo',
      image:
        'https://spb-clubs.s3.ap-southeast-1.amazonaws.com/san-bong-da-quyet-tam-2-2032207698+1.png',
      distance: '2.5 km',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={() => console.log('See all pressed')}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            title={unit.title}
            address={unit.address}
            price={unit.price}
            image={unit.image}
            distance={unit.distance}
            onPress={() => console.log('Unit pressed:', unit.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      paddingVertical: hp(2),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      marginBottom: hp(2),
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.textDark,
    },
    seeAll: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
    },
    scrollContent: {
      paddingHorizontal: wp(4),
      paddingBottom: hp(2),
    },
  });

export default UnitSection;
