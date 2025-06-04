import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

const TelaBaseScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Base</Text>

      <Text style={styles.paragraph}>
        Essa é uma tela inicial base para começar seu conteúdo.
      </Text>

    </View>
  );
};

export default TelaBaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 24,
    color: '#444',
  },
  button: {
    alignSelf: 'flex-start',
  },
});
