import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import UserCard from '../components/UserCard';

const GerenciamentoUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://backend-siop.onrender.com/api/users');
      setUsers(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://backend-siop.onrender.com/api/users/${userId}`);
      fetchUsers(); // deleta o usuario
      Alert.alert('Sucesso', 'Usuário deletado com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar o usuário');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('CriarUsuario')}
      >
        <Text style={styles.buttonText}>Criar Usuário</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#000"/>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({item}) => (
          <UserCard
            id={item._id}
            name={item.name}
            cro={item.cro}
            role={item.role}
            onDelete={() => handleDelete(item._id)}
            onDetails={() => navigation.navigate('Dados usuario', { usersId: item._id })}
          />  
        )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
    marginTop: 30,
  },
  title: { 
    fontSize: 20,
    fontWeight: 'bold', 
    marginTop: 40
  },
  button: {
    backgroundColor: '#0a4c85',
    padding: 10,
    alignSelf: 'flex-end',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
});

export default GerenciamentoUser;