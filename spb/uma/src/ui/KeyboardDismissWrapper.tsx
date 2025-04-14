import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEventStore } from '@/zustand';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  safe?: boolean;
}
const KeyboardDismissWrapper: React.FC<Props> = ({
  children,
  style,
  scrollable = false,
  safe = true,
}) => {
  const styles = createStyles();
  const Wrapper = safe ? SafeAreaView : View;
  const setFocus = useEventStore.use.setFocus();

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setFocus(false);
  };

  const content = (
    <TouchableWithoutFeedback onPress={handleOutsidePress} accessible={false}>
      <View style={[styles.content, style]}>{children}</View>
    </TouchableWithoutFeedback>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Wrapper>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </Wrapper>
    </KeyboardAvoidingView>
  );
};

const createStyles = () =>
  StyleSheet.create({
    content: {
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
    },
    scrollViewContainer: {
      flexGrow: 1,
    },
  });

export default KeyboardDismissWrapper;
