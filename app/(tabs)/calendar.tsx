import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function CalendarScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Calendário</ThemedText>
      <ThemedView style={styles.separator} />
      <ThemedText style={styles.text}>Aqui você poderá visualizar seus eventos e compromissos.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  separator: {
    height: 1,
    width: '80%',
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});