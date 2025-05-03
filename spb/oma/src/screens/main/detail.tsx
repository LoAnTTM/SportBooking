import React, { FC, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

import HeaderWithBack from '@/components/common/HeaderWithBack';
import ImageSlider from '@/components/common/ImageSlider';
import DetailInfo from '@/components/detail/DetailInfo';
import { DEFAULT_ICON_SIZE, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import { logError } from '@/helpers/logger';
import { MainStackParamList } from '@/screens/main';
import Loading from '@/ui/Loading';
import { useLocationStore, useUnitStore } from '@/zustand';
import { RouteProp } from '@react-navigation/native';

type Props = {
  route?: RouteProp<MainStackParamList, 'Detail'>;
};

const Detail: FC<Props> = ({ route }) => {
  const unitId = route?.params?.unitId;

  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const fetchDetailUnit = useUnitStore((state) => state.fetchDetailUnit);
  const unit = useUnitStore(useShallow((state) => state.currentUnit));

  const { latitude, longitude } = useLocationStore(
    useShallow((s) => ({
      latitude: s.latitude,
      longitude: s.longitude,
    }))
  );

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        if (!unitId) return;
        await fetchDetailUnit(unitId, {
          longitude: longitude,
          latitude: latitude,
        });
      } catch (error) {
        logError(error as Error);
      }
    };

    fetchAPI();
  }, [fetchDetailUnit, unitId]);

  if (unit.id !== unitId) {
    return (
      <View style={styles.container}>
        <Loading color={theme.primary} size={DEFAULT_ICON_SIZE * 2}/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithBack title={unit.title} />
      <View style={styles.content}>
        <ImageSlider
          image={unit.image}
          containerStyle={styles.imageContainer}
          imageWrapperStyle={styles.imageWrapper}
        />
      </View>
      {unit.id && <DetailInfo unit={unit} />}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.backgroundDark,
      position: 'relative',
      flexDirection: 'column',
    },
    content: {
      paddingTop: hp(2),
    },
    imageContainer: {
      borderRadius: 0,
      height: hp(26),
    },
    imageWrapper: {
      height: hp(26),
    },
  });

export default React.memo(Detail);
