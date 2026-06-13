import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { BUTTON_SIZE, CARD_SHADOW, COLORS, RADIUS } from '../styles/shared';

interface Props {
  top: number;
  onSearch: (query: string) => void;
}

export function SearchBar({ top, onSearch }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const query = value.trim();
    if (!query) return;
    onSearch(query);
  };

  return (
    <View style={[styles.container, { top }]}>
      <TextInput
        style={styles.input}
        placeholder="Search for a destination (address or postal code)"
        placeholderTextColor={COLORS.muted}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
        <MaterialIcons name="search" size={22} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    right: 130,
    zIndex: 10,
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.text,
    height: BUTTON_SIZE,
    ...CARD_SHADOW,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
});
