// This file is a fallback for using MaterialIcons on Android and web.

import { MaterialIcons } from '@expo/vector-icons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'checklist': 'checklist',
  'calendar': 'date-range',
  'gear': 'settings',
  'checkmark.circle': 'check-circle',
  'checkmark': 'check',
  'plus': 'add',
  'list.bullet': 'format-list-bulleted',
  'exclamationmark.circle': 'error',
  'exclamationmark.triangle': 'warning',
  'circle': 'radio-button-unchecked',
} as const;

export type IconSymbolName = keyof typeof MAPPING;

interface Props {
  name: IconSymbolName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({ name, size = 24, color = '#000', style }: Props) {
  // Se não houver mapeamento específico, usa o mesmo nome
  const materialIconName = MAPPING[name] || name.replace(/\./g, '-') as keyof typeof MaterialIcons.glyphMap;
  
  return (
    <MaterialIcons
      name={materialIconName}
      size={size}
      color={color}
      style={style}
    />
  );
}
