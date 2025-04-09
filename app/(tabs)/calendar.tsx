import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { styles } from '@/assets/styles/calendar.styles';

export default function CalendarScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Calendário</ThemedText>
      <ThemedView style={styles.separator} />
      <ThemedText style={styles.text}>Aqui você poderá visualizar seus eventos e compromissos.</ThemedText>
    </ThemedView>
  );
}