import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const DadosUsuario = ({ route, navigation }) => {
  const { usersId } = route.params;
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    role: '',
    senha: '', 
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`https://backend-siop.onrender.com/api/users/${usersId}`);
      const user = response.data;

      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        senha: '', 
        role: user.role || '',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://backend-siop.onrender.com/api/users/${usersId}`, formData);
      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar usuário.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={formData.nome}
        onChangeText={(text) => handleChange('nome', text)}
      />

      <Text style={styles.label}>E-mail:</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Cargo:</Text>
      <TextInput
        style={styles.input}
        value={formData.role}
        onChangeText={(text) => handleChange('role', text)}
      />

      {/* Se quiser permitir redefinir senha */}
      <Text style={styles.label}>Nova Senha:</Text>
      <TextInput
        style={styles.input}
        value={formData.senha}
        onChangeText={(text) => handleChange('senha', text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { 
    fontWeight: 'bold',
     marginBottom: 5,
  },

  cro:{
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    height:50,
    width: '50%',
   },

  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    height:50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0a4c85',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    marginLeft: '60%',
    marginInlineEnd:'auto',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default DadosUsuario;
