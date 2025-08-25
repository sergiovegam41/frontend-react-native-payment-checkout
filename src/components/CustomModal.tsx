import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Theme, createStyle } from '../theme';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttons?: {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }[];
  icon?: string;
}

const { width } = Dimensions.get('window');
const MODAL_WIDTH = width * 0.85;

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  buttons = [{ text: 'OK', onPress: onClose }],
  icon,
}) => {
  const handleBackdropPress = () => {
    // Only close on backdrop if there's a cancel button or single button
    if (buttons.length === 1 || buttons.some(b => b.style === 'cancel')) {
      onClose();
    }
  };

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case 'cancel':
        return [styles.button, styles.cancelButton];
      case 'destructive':
        return [styles.button, styles.destructiveButton];
      default:
        return [styles.button, styles.defaultButton];
    }
  };

  const getButtonTextStyle = (style?: string) => {
    switch (style) {
      case 'cancel':
        return [styles.buttonText, styles.cancelButtonText];
      case 'destructive':
        return [styles.buttonText, styles.destructiveButtonText];
      default:
        return [styles.buttonText, styles.defaultButtonText];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.modalContent}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.buttonsContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={getButtonStyle(button.style)}
                  onPress={() => {
                    button.onPress?.();
                    if (!button.onPress) {
                      onClose();
                    }
                  }}
                >
                  <Text style={getButtonTextStyle(button.style)}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Theme.colors.background.overlay,
    ...createStyle.layout.centerContent(),
    padding: Theme.spacing.layout.containerPadding,
  },
  modalContent: {
    backgroundColor: Theme.colors.background.surface,
    borderRadius: Theme.spacing.modal.borderRadius,
    padding: Theme.spacing.modal.padding,
    width: MODAL_WIDTH,
    maxWidth: 400,
    alignItems: 'center',
    ...Theme.shadows.lg,
  },
  icon: {
    fontSize: Theme.typography.fontSize['4xl'],
    marginBottom: Theme.spacing.base,
  },
  title: {
    ...createStyle.text.heading(3),
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  message: {
    ...Theme.typography.textStyles.body,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: Theme.typography.lineHeight.normal * Theme.typography.fontSize.base,
    marginBottom: Theme.spacing.xl,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.base,
    borderRadius: Theme.borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  defaultButton: {
    backgroundColor: Theme.colors.primary.main,
  },
  cancelButton: {
    backgroundColor: Theme.colors.neutral.gray[100],
    borderWidth: 1,
    borderColor: Theme.colors.border.main,
  },
  destructiveButton: {
    backgroundColor: Theme.colors.status.error,
  },
  buttonText: {
    ...Theme.typography.textStyles.button,
    textAlign: 'center',
  },
  defaultButtonText: {
    color: Theme.colors.text.inverse,
  },
  cancelButtonText: {
    color: Theme.colors.text.primary,
  },
  destructiveButtonText: {
    color: Theme.colors.text.inverse,
  },
});

export default CustomModal;