import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabBar: Platform.select({
    ios: {
      position: 'absolute',
    },
    default: {},
  }),
});
