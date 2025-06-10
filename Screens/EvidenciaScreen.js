import React, { useState, useEffect } from 'react';
import { View, Text, TextInput,StyleSheet, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import DataHora from './components/DataHora';
import LocalMap from './components/LocalMap';


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
  const [tipo, setTipo] = useState('');
  const [image, setImage] = useState(null);

  //integração com o back 
  const handleSubmit = async() => {
    try{
      const formData = new FormData(); //formData suporta envio tanto dos dados quanto das imagens
      // campos
      formData.append('titulo', titulo);
      formData.append('origem', origem);
      formData.append('dataColeta', dataColeta.toISOString());
      formData.append('responsavel', responsavel);
      formData.append('categoria', categoria);
      formData.append('condicao', condicao);
      formData.append('vitima', vitima);
      formData.append('localizacao', local);
      formData.append('descricaoDetalhada', descricao);
      formData.append('observacoesTecnicas', observacoes);
      formData.append('tipo', tipo);

      // Adiciona a imagem se ela existir
      if (image){// verifica a imagem foi ou não adicionada
        const filename = image.split('/').pop();//extrai o nome do arquivo, pega o último elemento do array.
       const match = /\.(\w+)$/.exec(filename || '');//diferencia o nome dos arquivos
       const type = match ? `image/${match[1]}` : 'image';// verifica se a imagem existe, se não retorna a fallback

       formData.append('image', {//adiciona a imagem no formData
        uri: image,
        name: filename,
        type,
       });
      }
      const response = await fetch(`https://backend-siop.onrender.com/api/cases/${caseId}/evidences/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok){
        Alert.alert('Evidência cadastrada');
      } else {
        throw new Error(data.message || 'Erro ao cadastra a evidência');
      }
    } catch (error){
      Alert.alert('Erro', error.message);
      console.error('Erro ao enviar evidência:', error)
    }
  };

  //função para coletar a imagem 
  const handleTakePhoto = async() => {
    const premission = await Camera.requestCameraPermissionsAsync();

      if(premission.granted){
          const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect:[4,3],
          quality:1,
        });

        if (!result.canceled && result.assets.length > 0){
          setImage(result.assets[0].uri);
        }
      } else { 
      Alert.alert('Permissão negada')
    }
  };

  return(
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Numero da Evidência: <Text style={styles.link}>01</Text></Text>
      <Text style={styles.title}>Tipo de Evidência: <Text style={styles.link}>Foto</Text></Text>

      <Button
      icon="camera" 
      style={styles.button} 
      labelStyle={styles.buttonText}
      onPress={handleTakePhoto}>Captura Evidência
      </Button>

      {image && (
        <Image source={{uri: image}} style={styles.image}/>
      )}

       <View style={styles.whidth}>
          <Text style={styles.label}>Tipo Evidência</Text>
          <View style={styles.picker}>
            <Picker
            selectedValue={tipo}
            onValueChange={setTipo}
            mode="dropdown"
            style={styles.bp}>

              <Picker.Item label="Selecione o tipo de evidência"value=""/>
              <Picker.Item label="Foto"value="foto"/>
              <Picker.Item label="Texto"value="texto"/>
              <Picker.Item label="Arquivo"value="arquivo"/>
            </Picker>
          </View>
       </View>

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
          <DataHora
            mode="date"
            onDateChange={(newDate) => setDataColeta(newDate)}
            initialDate={dataColeta}
            containerStyle={styles.pickerContainer}
            buttonStyle={styles.dateTimeButton}
            textStyle={styles.dateTimeText}
          />
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
            mode="dropdown"
            style={styles.bp}>

              <Picker.Item label="Selecione"value=""/>
              <Picker.Item label="Bem Conservada"value="Bem Conservada"/>
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

   <View style={styles.section}>
        <LocalMap
          onLocationUpdate={(locationData) => {
            setLocal(locationData.endereco);
          }}
          mapStyle={styles.map}
        />
      </View>

    <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição detalhada:</Text>
      <TextInput style={styles.input} multiline value={descricao} 
      onChangeText={setDescricao} />
    </View>

    <View style={styles.inputGroup}>
        <Text style={styles.label}>Observações Técnicas:</Text>
      <TextInput style={styles.input} multiline value={observacoes} onChangeText={setObservacoes} />
    </View>



    <Button style={styles.button} 
      labelStyle={styles.buttonText}
      onPress={handleSubmit}
      > + Salvar Evidência
    </Button>

    <Button style={styles.button} 
      labelStyle={styles.buttonText}
      > Gerar Laudo
    </Button>

    </ScrollView>
  )
}

const styles= StyleSheet.create({
  container:{
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title:{
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  inputGroup:{
    marginBottom: 15,
    display: 'flex',
  },
  label:{
    fontSize:16,
    color:'#000',
    marginBottom: 5,
  },
  input:{
    backgroundColor: '#fff',
    colo: '#000',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical:12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius:4,
    elevation: 4,
  },
  link:{
    color: '#0A4A81',
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
  buttonText:{
    color: '#fff',
  },
  whidth:{
    width: '48%',
  },
  picker:{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  bp:{
    color:'#000',
    height: 55,
    fontSize:14,
  },
  button: {
    backgroundColor: '#145da0',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 8,
    marginTop: 40,
    alignSelf: 'flex-end',
  },
  image:{
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },

});