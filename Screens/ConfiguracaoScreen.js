import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Config() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    navigation.replace('Login'); // Redireciona para tela de login
  };

  useEffect(() => {
    const fetchUser = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (!id) return;

      try {
        const res = await fetch(`https://backend-siop.onrender.com/api/users/${id}`);
        const data = await res.json();
        setUser(data);
        setNome(data.nome || '');
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A4A81" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configuração</Text>

      <View style={styles.img}>
        <Image
          source={{
            uri: user.profileImageUrl || 'https://via.placeholder.com/120',
          }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.whidth}>
          <Text style={styles.label}>Cargo:</Text>
          <TextInput
            style={styles.input}
            value={user.role}
            editable={false}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do perito"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          style={styles.input}
          value={user.email}
          editable={false}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={{ color: '#fff' }}
      >
        Sair
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 16,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#C0392B',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0A4A81',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
