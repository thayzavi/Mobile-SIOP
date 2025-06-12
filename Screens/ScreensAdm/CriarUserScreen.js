import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

export default function CriarUsuarioScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('Perito');

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const abrirMenu = () => setMenuVisible(true);
  const fecharMenu = () => setMenuVisible(false);

  const criarUsuario = async () => {
    if (!nome || !email || !senha || !cargo) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://backend-siop.onrender.com/api/users/register', {
        nome,
        email,
        senha,
        role: cargo,
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Usuário criado com sucesso!');
        // Limpar campos
        setNome('');
        setEmail('');
        setSenha('');
        setCargo('Perito');
      } else {
        Alert.alert('Erro', 'Falha ao criar usuário.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao criar usuário. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Criar usuário</Text>

        {/* Ícone de perfil */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Icon name="person" size={60} color="#aaa" />
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <Icon name="edit" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Campos de entrada */}
        <TextInput
          placeholder="Nome"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />
        <TextInput
          placeholder="E-mail"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Senha"
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {/* Dropdown de cargo */}
        <Menu
          visible={menuVisible}
          onDismiss={fecharMenu}
          anchor={
            <TouchableOpacity onPress={abrirMenu} style={styles.dropdown}>
              <Text>{cargo}</Text>
              <Icon name="arrow-drop-down" size={24} color="#555" />
            </TouchableOpacity>
          }
        ><Menu.Item onPress={() => { setCargo('perito'); fecharMenu(); }} title="Perito" />
        <Menu.Item onPress={() => { setCargo('admin'); fecharMenu(); }} title="Administrador" />
        <Menu.Item onPress={() => { setCargo('assistente'); fecharMenu(); }} title="Assistente" />
        </Menu>

        {/* Botão Criar usuário */}
        <Button
          mode="contained"
          style={styles.button}
          onPress={criarUsuario}
          loading={loading}
          disabled={loading}
        >
          Criar usuário
        </Button>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafa',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#154c79',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: '38%',
    backgroundColor: '#154c79',
    borderRadius: 15,
    padding: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    elevation: 1,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 5,
    marginVertical: 8,
    elevation: 1,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#154c79',
  },
});
