import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { Text} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


export default function Config () {

  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [cro, setCro] = useState('');

  const handleLogout = () => {
    navigation.replace('Login'); // Redireciona para tela de login
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}> Configuração</Text>
      <View style={styles.img}>
        <Image
        source={require('../assets/img.jpeg')}
        style={styles.avatar}/>
      </View>

      <View style={styles.row}>
        <View style={styles.whidth}>
          <Text style={styles.label}>CRO:</Text>
             <TextInput style={styles.input} placeholder="SP 123456" 
             value={cro} 
             onChangeText={setCro} />
        </View>
      </View>


      <View style={styles.section}>
             <View style={styles.inputGroup}>
               <Text style={styles.label}>Nome:</Text>
               <TextInput
                 style={styles.input}
                 value={nome}
                 onChangeText={setNome}
                 placeholder="nome perito"
              />
             </View>
          </View>
      
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Endereço:</Text>
          <TextInput style={styles.input} 
          value={endereco} 
           onChangeText={setEndereco} />
        </View>
      
        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail:</Text>
          <TextInput style={styles.input}
           value={email} 
           onChangeText={setEmail} />
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: '30%',
    fontWeight: 'bold',
    color: '#000',
  },
  inputGroup:{
    marginBottom: 15,
    display: 'flex',
  },
 input:{
    backgroundColor: '#fff',
    colo: '#0000',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical:12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius:4,
    elevation: 4,
  },
  label:{
    fontSize:16,
    color:'#000',
    marginBottom: 5,
  },
  row:{
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
    marginInlineEnd: 'auto',
    marginLeft: '85%',
  },
});
