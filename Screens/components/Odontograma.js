import React, {  useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Text, Button, RadioButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const dentesNumeros = [
  [18,17,16,15,14,13,12,11], 
  [21,22,23,24,25,26,27,28],
  [48,47,46,45,44,43,42,41],
  [31,32,33,34,35,36,37,38]
];

const statusOptions = [//status do dente
  'Saudável',
  'Cárie',
  'Quebrado',
  'Extraído',
  'Tratado',
];

export default function ({Odontograma ,setOdontograma}){
  const {colors} = useTheme();

  

  const [modalVisible, setModallVisible] = useState(false);
  const [denteSelecionado, setDenteSelecionado] = useState(null);
  const [statusSelecionado , setSelecionado] = useState('');


  const [statusDosDentes, setStatusDentes] = useState({});

  function abrirModal(dente){
    setDenteSelecionado(dente);
    setSelecionado(statusDosDentes[dente] || '');
    setModallVisible(true);
  }

  function confirmarStatus(){
  const novoStatus = {...statusDosDentes, [denteSelecionado]: statusSelecionado};
  setStatusDentes(novoStatus);
  setModallVisible(false);
  setOdontograma(novoStatus);
  setDenteSelecionado(null);
  setSelecionado('');
}

  return(
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, {color: "#000"}]}>Informações dentaria</Text>


        {/* array que percorre as fileiras dos dentes {i}=indice de cada linha */}
       {dentesNumeros.map((linha, i) => ( 
        <View key={i} style={styles.linhaDentes}>
            {/* tranformando cada número clicável */}
          {linha.map(dente => (
            <TouchableOpacity
            key={dente}
            style={[
              styles.dente,
              { //altera a cor de fundo quando um dente e selecionado 
                borderColor: statusDosDentes[dente] ? colors.primary: '#ccc',
                backgroundColor: statusDosDentes[dente] ? '#def' : '#fff',
              }
            ]}
            // Abre o madal para adiciona o status
            onPress={() => abrirModal(dente)}>
              <View style={styles.iconDente}>
                <Icon name="tooth" size={24} color="#8c8c8c"/>
                <Text style={styles.numeroDente}>{dente}</Text>
              </View>
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
          onPress={confirmarStatus}
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
    linhaDentes:{
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 15,
    },
    dente: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
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
      backgroundColor: 'rgb(0, 88, 170)',
    },
    numeroDente:{
      fontWeight: 'bold',
      color: '#000',
    },
    iconDente:{
      justifyContent:'center',
      alignItems: 'center',
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

