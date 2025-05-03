import React, { FC, useEffect, useRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import SliderItem from '@/ui/slider/SliderItem';

type RenderItemProps<T> = {
  item: T;
  index: number;
};

type SliderProps<T> = {
  data: T[];
  containerStyle: StyleProp<ViewStyle>;
  width: number;
  initialScrollIndex: number;
  renderItem: FC<RenderItemProps<T>>;
  onSlideSelected: (index: number) => void;
};

function Slider<T>({
  data,
  containerStyle,
  width,
  renderItem,
  initialScrollIndex,
  onSlideSelected,
}: SliderProps<T>) {
  const flatListRef = useRef<Animated.FlatList<T>>(null);

  const scrollX = useSharedValue(0);
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  useEffect(() => {
    if (
      flatListRef.current &&
      ((data.length > 0 && initialScrollIndex >= 0) || initialScrollIndex >= 1)
    ) {
      flatListRef.current.scrollToIndex({
        index: initialScrollIndex,
        animated: true,
      });
    }
  }, [initialScrollIndex, data]);

  return (
    <View style={containerStyle}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item, index }) => (
          <SliderItem index={index} scrollX={scrollX} width={width}>
            {React.createElement(renderItem, { item, index })}
          </SliderItem>
        )}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={3}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width}
        onScroll={onScrollHandler}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        removeClippedSubviews={false}
        onMomentumScrollEnd={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const selectedIndex = Math.round(offsetX / width);
          onSlideSelected(selectedIndex);
        }}
      />
    </View>
  );
}

export default Slider;
