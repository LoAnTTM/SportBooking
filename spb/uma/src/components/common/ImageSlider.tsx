import React, { FC, useCallback, useContext, useRef, useState } from 'react';
import {
  Animated, Dimensions, NativeScrollEvent, NativeSyntheticEvent, StyleProp, StyleSheet, View,
  ViewStyle
} from 'react-native';

import { IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

type ImageSliderProps = {
  image: string[];
  containerStyle?: StyleProp<ViewStyle>;
  imageWrapperStyle?: StyleProp<ViewStyle>;
};

const ImageSlider: FC<ImageSliderProps> = ({
  image,
  containerStyle,
  imageWrapperStyle,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const keyExtractor = useCallback(
    (_: any, index: number) => index.toString(),
    []
  );
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: WINDOW_WIDTH,
      offset: WINDOW_WIDTH * index,
      index,
    }),
    []
  );

  const renderImage = ({
    item: imageUrl,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    const inputRange = [
      (index - 1) * WINDOW_WIDTH,
      index * WINDOW_WIDTH,
      (index + 1) * WINDOW_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <View style={[styles.imageWrapper, imageWrapperStyle]}>
        <Animated.Image
          source={{ uri: imageUrl }}
          style={[
            styles.image,
            {
              transform: [{ scale }],
            },
          ]}
          resizeMode="cover"
        />
      </View>
    );
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideIndex = Math.round(
          event.nativeEvent.contentOffset.x / WINDOW_WIDTH
        );
        if (slideIndex !== currentIndex) {
          setCurrentIndex(slideIndex);
        }
      },
    }
  );

  const renderDots = () => {
    if (!image || image.length <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        {image.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * WINDOW_WIDTH,
              index * WINDOW_WIDTH,
              (index + 1) * WINDOW_WIDTH,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity,
                  backgroundColor:
                    index === currentIndex
                      ? theme.backgroundLight
                      : theme.backgroundDark,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.imageOuterContainer, containerStyle]}>
      <Animated.FlatList
        data={image}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        snapToInterval={WINDOW_WIDTH}
        onScroll={handleScroll}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
      />
      {renderDots()}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    imageOuterContainer: {
      height: hp(22),
      width: '100%',
      overflow: 'hidden',
      borderRadius: Radius.lg,
    },
    imageWrapper: {
      width: WINDOW_WIDTH,
      height: hp(22),
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    paginationContainer: {
      position: 'absolute',
      bottom: hp(1.5),
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: wp(1),
    },
    dot: {
      width: wp(2),
      height: wp(2),
      borderRadius: wp(1),
      backgroundColor: theme.backgroundDark,
    },
  });

export default ImageSlider;
