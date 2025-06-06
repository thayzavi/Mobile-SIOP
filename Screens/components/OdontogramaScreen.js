import React, { use, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Text, Button, RadioButton, useTheme } from 'react-native-paper';

const dentesNumeros = [
  [18,17,16,15,14,13,12,11], 
  [48,47,46,45,44,43,42,41] 
];

const statusOptions = [
  'Saudável',
  'Cárie',
  'Quebrado',
  'Extraído',
  'Tratado',
];

export default function Odontograma(){
  const {colors} = useTheme();

  const [modalVisible, setModallVisible] = useState(false);
  const [denteSelecionado, setDenteSelecionado] = useState(null);
  const [statusSelecionado , setSelecionado] = useState('');
  const [statusDosDentes, setStatusDentes] = useState({});

  function abriModal(dente){
    setDenteSelecionado(dente);
    setSelecionado(statusDosDentes[dente] || '');
    setModallVisible(true);
  }

  function confimarStatus(){
    setStatusDentes(prev => ({ ...prev, [denteSelecionado]: statusSelecionado }));
    setModallVisible(false);
    setDenteSelecionado(null);
    setSelecionado('');
  }

  return(
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, {color: colors.primary}]}>Odontograma</Text>

      {dentesNumeros.map((linha, i) => (
        <View key={i} style={styles.linhaDentes}>
          {linha.map(dente => (
            <TouchableOpacity
            key={dente}
            style={[
              styles.dente,
              {
                borderColor: statusDosDentes[dente] ? colors.primary: '#ccc',
                backgroundColor: statusDosDentes[dente] ? '#def' : '#fff',
              }
            ]}
            onPress={() => abriModal(dente)}>
              <Text style={styles.numeroDente}>{dente}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalfundo}>
        <View style={styles.modalContent}>
          <RadioButton.Group
            onValueChange={value => setSelecionado(value)}
            value={statusSelecionado}>
              {statusOptions.map(Option =>
                <View key={Option} style={styles.radio}>
                  <RadioButton value={Option}/>
                  <Text>{Option}</Text>
                </View>
              )}
            </RadioButton.Group>
          <Button
          mode="contained"
          onPress={confimarStatus}
          disabled={!statusSelecionado}
          style={{ marginTop: 20}}>Confirmar
          </Button>

          <Button onPress={() => setModallVisible(false)} style={{marginTop:10}}>
            Cancelar
          </Button>
        </View>
      </View>
    </Modal>

    <View style={styles.statusLista}>
      <Text style={styles.statusTitle}>Status Confirmado:</Text>
      {Object.entries(statusDosDentes).map(([dente, status]) => (
        <View key={dente} style={styles.statusItem}>
          <Text style={{ color: '#000'}}>Dente {dente} - {status}</Text>
        </View>
      ))}
      {Object.keys(statusDosDentes).length === 0 && (
        <Text style={{fontStyle: 'italic', color:'#000'}}>Nenhum status adicionado ainda </Text>
      )}
    </View>
    </ScrollView>
  );
} 

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 60,
    },
    title:{
      fontSize: 24,
      fontWeight:'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    linhaDentes:{
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 15,
    },
    dente: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      color: '#000',
    },
    modalfundo:{
      flex: 1,
      backgroundColor: 'rgba(184, 184, 184, 0.5)',
      justifyContent:'center',
      alignItems:'center',
    },
    modalContent:{
      width: '80%',
      borderRadius:12,
      padding:20,
      elevation: 5,
      backgroundColor: '#145da0',
    },
    numeroDente:{
      fontWeight: 'bold',
      color: '#000',
    },
    title:{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
      color: '#000',
    },
    radio:{
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 6,
    },
    statusLista:{
      marginTop: 30,
    },
    statusTitle:{
      fontSize:18,
      fontWeight: '600',
      marginBottom: 10,
      color: '#000',
    },
    statusItem:{
      padding:8,
      borderBottomColor: '#ddd',
      borderBottomWidth: 1,
    },

  });

