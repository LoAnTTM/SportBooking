import React, { FC, useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import UnitCard from '@/components/home/UnitCard';
import UnitCardSkeleton from '@/components/home/UnitCardSkeleton';
import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { MainStackParamList } from '@/screens/main';
import { UnitCard as UnitCardObject } from '@/services/types';
import { UnitRenderTypes } from '@/zustand';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface UnitSectionProps {
  title: string;
  units: UnitCardObject[];
  unitRenderType: UnitRenderTypes;
  handleSeeAll?: () => void;
}

const UnitSection: FC<UnitSectionProps> = ({
  title,
  units,
  unitRenderType,
  handleSeeAll,
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleOnPress = (unitId: string) => {
    navigation.navigate('Detail', {
      unitId: unitId,
    });
  };

  const handleOnPressLocation = (id: string, unitType: UnitRenderTypes) => {
    //@ts-ignore
    navigation.navigate('Tabs', {
      screen: 'Map',
      params: {
        unitId: id,
        renderType: unitType,
      },
    });
  };

  const isLoading = units === undefined || units.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {handleSeeAll && (
          <Pressable onPress={handleSeeAll}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading && <UnitCardSkeleton />}
        {units?.map((unit) => (
          <UnitCard
            key={unit.id}
            unitCard={unit}
            unitRenderType={unitRenderType}
            onPress={() => handleOnPress(unit.id)}
            onPressLocation={(id, unitType) =>
              handleOnPressLocation(id, unitType)
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      paddingTop: hp(3),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      marginBottom: hp(2),
    },
    title: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.lg,
      color: theme.textDark,
    },
    seeAll: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.primary,
    },
    scrollContent: {
      paddingHorizontal: wp(4),
      paddingBottom: hp(2),
    },
  });

export default UnitSection;
