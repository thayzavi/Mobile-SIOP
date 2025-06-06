import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Button } from 'react-native-paper';

export default function EvidenciaScreen() {
  const [titulo, setTitulo] = useState('');
  const [origem, setOrigem] = useState('');
  const [dataColeta, setDataColeta] = useState(new Date());
  const [responsavel, setResponsavel] = useState('Dra. Sam Hang-Yun');
  const [categoria, setCategoria] = useState('');
  const [condicao, setCondicao] = useState('');
  const [vitima, setVitima] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleTakePhoto = async() => {
    const premission = await Camera.requestCameraPermissionsAsync();
    if(premission.granted){
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  const handleDataChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate){setDataColeta(selectedDate);

    }
  };
  return(
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Numero da Evidência: <Text style={styles.link}>01</Text></Text>
      <Text style={styles.title}>Tipo de Evidência: <Text style={styles.link}>Foto</Text></Text>

      <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
        <Text style={styles.buttonText}>Tirar Foto</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{uri: image}} style={styles.image}/>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Título:</Text>
      <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      </View>

      <View style={styles.row}>
        <View style={styles.whidth}>
          <Text style={styles.label}>Origem:</Text>
          <TextInput style={styles.input} placeholder="Origem" value={origem} onChangeText={setOrigem} />
        </View>

        <View style={styles.whidth}>
        <Text style={styles.label}>Data da coleta:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{dataColeta.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
          value={dataColeta}
          mode="datetime"
          display={Platform.OS ==='ios' ? 'inline' : 'default'}
          onChange={handleDataChange}
          />
        )}
        
      </View>
      </View>


      <View style={styles.row}>
        <View style={styles.whidth}>
          <Text style={styles.label}>Resposável:</Text>
          <TextInput style={styles.input} placeholder="responsavel" value={responsavel} onChangeText={setResponsavel} />
        </View>
        <View style={styles.whidth}>
          <Text style={styles.label}>Categoria:</Text>
          <TextInput style={styles.input} placeholder="categoria" value={categoria} onChangeText={setCategoria} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.whidth}>
          <Text style={styles.label}>Condição:</Text>
          <View style={styles.picker}>
            <Picker
            selectedValue={condicao}
            onValueChange={setCondicao}
            style={styles.bp}>

              <Picker.Item label="Selecione"value=""/>
              <Picker.Item label="Bem Conservada"value=""/>
              <Picker.Item label="Danificada"value="Danificada"/>
              <Picker.Item label="Parcial"value="Parcial"/>
            </Picker>
          </View>
        </View>
        <View style={styles.whidth}>
          <Text style={styles.label}>Vítima:</Text>
          <TextInput style={styles.input} value={vitima} onChangeText={setVitima} />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Local:</Text>
      <TextInput style={styles.input} value={local} onChangeText={setLocal} />
      </View>

      <Text style={styles.input}>Descrição detalhada:</Text>
      <TextInput
      style={styles.text}
      multiline
      value={descricao}
      onChangeText={setDescricao}
      />

      <Text style={styles.input}>Observações Técnicas:</Text>
      <TextInput
      style={styles.text}
      multiline
      value={observacoes}
      onChangeText={setObservacoes}
      />


      <Button
        mode="contained"
        onPress={() => navigation.navigate('Casos em andamento')}
        style={styles.button}
      >
        + Criar novo caso
      </Button>

    </ScrollView>
  )
}

const styles= StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  inputGroup:{
    marginBottom: 15,
    display: 'flex',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  label:{
    fontSize:16,
    color:'#000',
    marginBottom: 5,
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
  text:{
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  row:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  whidth:{
    width: '48%',
  },
  picker:{
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 4,
    shadowColor:'#000',
    shadowRadius: 0.2,
    shadowRadius: 4,
    marginBottom: 15,
  },
  bp:{
    color:'#000',
    height:40,
    fontSize:14,
  },
  button: {
  backgroundColor: '#145da0',
  paddingVertical: 10,
  paddingHorizontal: 16,
  height: 50,
  width: '30%',
  borderRadius: 8,
  marginTop: 20,
  alignItems: 'center',
  alignSelf: 'flex-end',
  justifyContent: 'center',
  },

});