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
        locale="pt-br"
        theme={{
          todayButtonFontFamily: undefined,
          textDayFontFamily: undefined,
          textMonthFontFamily: undefined,
          textDayHeaderFontFamily: undefined,
          
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          monthNames: [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro'
          ],
          dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
          dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#007AFF',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#007AFF',
          selectedDotColor: '#ffffff',
          arrowColor: '#007AFF',
          indicatorColor: '#007AFF',
          todayButtonText: 'Hoje',
          monthTextColor: '#2d4150',
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