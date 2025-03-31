import React, { FC, PropsWithChildren, useContext, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';

export interface IInformModalProps {
  visible: boolean;
  onClose: () => void;
}

const BaseModal: FC<PropsWithChildren<IInformModalProps>> = ({
  visible,
  onClose,
  children,
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  useEffect(() => {
    console.log('visible: ', visible);
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.content}>{children}</View>
    </Modal>
  );
};

const createStyles = (_: IColorScheme) =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  });

export default BaseModal;
