import { StyleSheet, Switch, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme, useColorSchemeManager } from '@/hooks/useColorSchemeManager';
import { Colors } from '../../constants/Colors';

const REPEAT_COUNT_KEY = '@repeat_count_preference';
const REMINDER_BEFORE_KEY = '@reminder_before_preference';
const REMINDER_AFTER_KEY = '@reminder_after_preference';

export default function SettingsScreen() {
  const { colorScheme } = useColorSchemeManager();
  const optionContainerStyle = {
    ...styles.optionContainer,
    borderBottomColor: Colors[colorScheme ?? 'light'].icon,
  };

  const [repeatCount, setRepeatCount] = useState('5');
  const [reminderBefore, setReminderBefore] = useState('30');
  const [reminderAfter, setReminderAfter] = useState('30');

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const [savedCount, savedBefore, savedAfter] = await Promise.all([
          AsyncStorage.getItem(REPEAT_COUNT_KEY),
          AsyncStorage.getItem(REMINDER_BEFORE_KEY),
          AsyncStorage.getItem(REMINDER_AFTER_KEY)
        ]);

        if (savedCount) setRepeatCount(savedCount);
        if (savedBefore) setReminderBefore(savedBefore);
        if (savedAfter) setReminderAfter(savedAfter);
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    };
    loadPreferences();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.light.background, dark: Colors.dark.background }}
      headerImage={
        <IconSymbol
          color={Colors[colorScheme ?? 'light'].icon}
          size={310}
          name="gear"
          style={getHeaderImageStyle(colorScheme)}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Configurações</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Preferências</ThemedText>

        {/* Opção de Quantidade de Repetições */}
        <ThemedView style={optionContainerStyle}>
          <ThemedView style={styles.optionTextContainer}>
            <IconSymbol 
              name="repeat" 
              size={24} 
              color={Colors[colorScheme ?? 'light'].icon} 
            />
            <ThemedText style={styles.optionText}>Quantidade de Repetições</ThemedText>
          </ThemedView>
          <Picker
            selectedValue={repeatCount}
            style={{ width: 100 }}
            onValueChange={async (itemValue) => {
              setRepeatCount(itemValue);
              try {
                await AsyncStorage.setItem(REPEAT_COUNT_KEY, itemValue);
              } catch (error) {
                console.error('Erro ao salvar contagem de repetições:', error);
              }
            }}
          >
            <Picker.Item label="5" value="5" />
            <Picker.Item label="7" value="7" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="15" value="15" />
            <Picker.Item label="30" value="30" />
          </Picker>
        </ThemedView>

        {/* Opção de Lembrete Antes do Prazo */}
        <ThemedView style={optionContainerStyle}>
          <ThemedView style={styles.optionTextContainer}>
            <IconSymbol 
              name="bell" 
              size={24} 
              color={Colors[colorScheme ?? 'light'].icon} 
            />
            <ThemedText style={styles.optionText}>Lembrete Antes do Prazo (minutos)</ThemedText>
          </ThemedView>
          <Picker
            selectedValue={reminderBefore}
            style={{ width: 100 }}
            onValueChange={async (itemValue) => {
              setReminderBefore(itemValue);
              try {
                await AsyncStorage.setItem(REMINDER_BEFORE_KEY, itemValue);
              } catch (error) {
                console.error('Erro ao salvar tempo de lembrete:', error);
              }
            }}
          >
            <Picker.Item label="15" value="15" />
            <Picker.Item label="30" value="30" />
            <Picker.Item label="60" value="60" />
            <Picker.Item label="120" value="120" />
          </Picker>
        </ThemedView>

        {/* Opção de Lembrete Após o Prazo */}
        <ThemedView style={optionContainerStyle}>
          <ThemedView style={styles.optionTextContainer}>
            <IconSymbol 
              name="bell.badge" 
              size={24} 
              color={Colors[colorScheme ?? 'light'].icon} 
            />
            <ThemedText style={styles.optionText}>Lembrete Após o Prazo (minutos)</ThemedText>
          </ThemedView>
          <Picker
            selectedValue={reminderAfter}
            style={{ width: 100 }}
            onValueChange={async (itemValue) => {
              setReminderAfter(itemValue);
              try {
                await AsyncStorage.setItem(REMINDER_AFTER_KEY, itemValue);
              } catch (error) {
                console.error('Erro ao salvar tempo de lembrete:', error);
              }
            }}
          >
            <Picker.Item label="15" value="15" />
            <Picker.Item label="30" value="30" />
            <Picker.Item label="60" value="60" />
            <Picker.Item label="120" value="120" />
          </Picker>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Sobre</ThemedText>
        <ThemedText style={styles.aboutText}>
          LembraAi é um aplicativo de gerenciamento de tarefas e lembretes que ajuda você a organizar seu dia a dia.
        </ThemedText>
        <ThemedText style={styles.versionText}>Versão 1.0.0</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
  },
  aboutText: {
    marginBottom: 8,
    lineHeight: 22,
  },
  versionText: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
});

// Função para obter o estilo dinâmico do headerImage
const getHeaderImageStyle = (scheme: string | null | undefined) => ({
  ...styles.headerImage,
  color: Colors[scheme as keyof typeof Colors]?.icon ?? Colors.light.icon,
});
