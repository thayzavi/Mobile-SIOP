import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

export default function CriarUsuarioScreen() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [cro, setCro] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('Perito');
  const [menuVisible, setMenuVisible] = useState(false);


  const criarUsuario = async () => {

    if (!nome || !email || !cpf || !cro || !senha || !dataNascimento || !telefone) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    try {
      const response = await axios.post('https://backend-siop.onrender.com/api/users', {
        nome,
        email,
        cpf,
        cro,
        senha,
        dataNascimento,
        telefone,
        cargo,
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Usuário criado com sucesso!');
        // Navegação ou outra ação após sucesso
        // Exemplo: navigation.navigate('ListaUsuarios');
      } else {
        Alert.alert('Erro', 'Falha ao criar usuário.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao criar usuário. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
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
        <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
        <TextInput placeholder="E-mail" style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput placeholder="CPF" style={styles.input} keyboardType="numeric" value={cpf} onChangeText={setCpf} />

        <View style={styles.row}>
          <TextInput placeholder="CRO" style={[styles.input, styles.halfInput]} value={cro} onChangeText={setCro} />
          <TextInput placeholder="Senha" style={[styles.input, styles.halfInput]} secureTextEntry value={senha} onChangeText={setSenha} />
        </View>

        <View style={styles.row}>
          <TextInput placeholder="Data nascimento" style={[styles.input, styles.halfInput]} value={dataNascimento} onChangeText={setDataNascimento} />
          <TextInput placeholder="Telefone" style={[styles.input, styles.halfInput]} keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
        </View>

        {/* Cargo dropdown */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.dropdown}>
              <Text style={{ color: cargo ? '#000' : '#aaa' }}>
                {cargo || 'Selecione o cargo'}
              </Text>
              <Icon name="arrow-drop-down" size={24} />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => setCargo('Perito')} title="Perito" />
          <Menu.Item onPress={() => setCargo('Administrador')} title="Administrador" />
        </Menu>

        {/* Botão Criar usuário */}
        <Button mode="contained" style={styles.button} onPress={criarUsuario}>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 5,
    marginVertical: 8,
    elevation: 1,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#154c79',
  },
});
