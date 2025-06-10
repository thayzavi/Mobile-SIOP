import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const DadosUsuario = ({ route, navigation }) => {
  const { usersId } = route.params;
  const [formData, setFormData] = useState({
    cro: '',
    cpf: '',
    name: '',
    email: '',
    senha: '',
    data: '',
    numero: '',
    endereco: '',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`https://backend-siop.onrender.com/api/users/${usersId}`);
      const user = response.data;

      setFormData({
        cro: user.cro || '',
        cpf: user.cpf || '',
        name: user.name || '',
        email: user.email || '',
        senha: user.senha || '',
        data: user.data || '',
        numero: user.numero || '',
        address: user.address || '',
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
        <Text style={styles.label}>CRO:</Text>
        <TextInput
          style={styles.cro}
          value={formData.cro}
          onChangeText={(text) => handleChange('cro', text)}
        />
       

      <Text style={styles.label}>CPF:</Text>
      <TextInput
        style={styles.input}
        value={formData.cpf}
        onChangeText={(text) => handleChange('cpf', text)}
      />

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <Text style={styles.label}>E-mail:</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        value={formData.senha}
        onChangeText={(text) => handleChange('senha', text)}
        secureTextEntry
      />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Data nascimento:</Text>
          <TextInput
            style={styles.input}
            value={formData.data}
            onChangeText={(text) => handleChange('data', text)}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.label}>Telefone:</Text>
          <TextInput
            style={styles.input}
            value={formData.telefone}
            onChangeText={(text) => handleChange('telefone', text)}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <Text style={styles.label}>Endereço:</Text>
      <TextInput
        style={styles.input}
        value={formData.endereco}
        onChangeText={(text) => handleChange('endereco', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Editar</Text>
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
    marginLeft: '89%',
    marginInlineEnd:'auto',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default DadosUsuario;
