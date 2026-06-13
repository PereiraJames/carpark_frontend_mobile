import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
        placeholderTextColor="#888"
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Go</Text>
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
    gap: 6,
  },
  input: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 14,
    justifyContent: 'center',
    minHeight: 44,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  buttonText: {
    fontSize: 15,
  },
});
