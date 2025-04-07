import React, { useState, useEffect, createContext, useContext } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ColorSchemeType = 'light' | 'dark' | null | undefined;

interface ColorSchemeContextType {
  colorScheme: ColorSchemeType;
  setColorScheme: (scheme: 'light' | 'dark') => void;
}

const THEME_PREFERENCE_KEY = '@theme_preference';

const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: 'light',
  setColorScheme: () => {},
});

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const deviceColorScheme = useDeviceColorScheme();
  const [colorScheme, setColorSchemeState] =
    useState<ColorSchemeType>(deviceColorScheme);

  // Carrega a preferência de tema salva e observa mudanças no tema do dispositivo
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedTheme) {
          setColorSchemeState(savedTheme as 'light' | 'dark');
        } else {
          // Se não houver tema salvo, usa o tema do dispositivo
          setColorSchemeState(deviceColorScheme);
        }
      } catch (error) {
        console.error('Erro ao carregar tema salvo:', error);
        // Em caso de erro, usa o tema do dispositivo
        setColorSchemeState(deviceColorScheme);
      }
    };

    loadSavedTheme();
  }, [deviceColorScheme]); // Adiciona deviceColorScheme como dependência

  // Salva a preferência de tema quando ela é alterada
  const setColorScheme = async (scheme: 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, scheme);
      setColorSchemeState(scheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorSchemeManager() {
  return useContext(ColorSchemeContext);
}

// Hook compatível com o useColorScheme original para manter compatibilidade
export function useColorScheme() {
  const { colorScheme } = useColorSchemeManager();
  return colorScheme;
}
