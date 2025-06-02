import { Platform } from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';

// Configurar o momento para usar o português brasileiro
moment.locale('pt-br');

// Função para formatar datas em português
export const formatDate = (date: Date): string => {
  return moment(date).format('DD [de] MMMM [de] YYYY');
};

// Função para formatar horários em português
export const formatTime = (date: Date): string => {
  return moment(date).format('HH:mm');
};

// Configurações específicas para cada plataforma
export const getDateTimePickerConfig = () => {
  return {
    locale: 'pt-BR',
    is24Hour: true,
    // Adicione outras configurações específicas da plataforma se necessário
    ...(Platform.OS === 'android' ? { timeZoneOffsetInMinutes: 0 } : {}),
  };
};