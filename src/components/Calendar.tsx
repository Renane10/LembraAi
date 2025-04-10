import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { ThemedView } from './ThemedView';

interface CalendarProps {
  onDayPress?: (date: any) => void;
  markedDates?: any;
}

export const Calendar: React.FC<CalendarProps> = ({ onDayPress, markedDates }) => {
  const [selected, setSelected] = useState('');

  const handleDayPress = (day: any) => {
    setSelected(day.dateString);
    if (onDayPress) {
      onDayPress(day);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <RNCalendar
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          [selected]: {
            selected: true,
            selectedColor: '#007AFF',
          },
        }}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: '#000000',
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#007AFF',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#007AFF',
          selectedDotColor: '#ffffff',
          arrowColor: '#007AFF',
          monthTextColor: '#000000',
          indicatorColor: '#007AFF',
        }}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
}); 