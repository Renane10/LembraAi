import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { styles } from '@/assets/styles/calendar.styles';
import { Calendar } from '@/components/Calendar';

export default function CalendarScreen() {
  return (
    <ThemedView>
      <Calendar />
    </ThemedView>
  );
}