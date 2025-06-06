import React, { useState } from 'react';
import {View,Text,TextInput,StyleSheet,ScrollView,Image,Dimensions,} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {Button } from 'react-native-paper';
import Odontograma from './components/OdontogramaScreen';

function CriarCasoScreen({ navigation }) {
  const [nomeCaso, setNomeCaso] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [endereco, setEndereco] = useState('Rua aviador dos camarões, 158'); // Preenchido como no print
  const [informacoes, setInformacoes] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [sexoVitima, setSexoVitima] = useState('');
  const [causaMorte, setCausaMorte] = useState('');
  const [corPele, setCorPele] = useState('');
  const [identificacao, setIdentificacao] = useState('');
  const [OdontogramaData, setOdontogramaData] = useState({});

  return(
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Criar caso</Text>

      <View style={styles.pickerContainer}>
        <Picker
        selectedValue={identificacao}
        onValueChange={(itemValue) => setIdentificacao(itemValue)}
        style={styles.picker}
        dropdownIconColor="#fff">
          <Picker.Item label="Selecione" value=""/>
          <Picker.Item label="Identificado" value="identificado"/>
          <Picker.Item label="Não identificado" value="Não identificado"/>
        </Picker>
      </View>
    
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Nome do caso:</Text>
      <TextInput
      style={styles.input}
      value={nomeCaso}
      onChangeText={setNomeCaso}
      placeholder="Nome do caso"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Reponsável:</Text>
      <TextInput
      style={styles.input}
      value={responsavel}
      onChangeText={setResponsavel}
      placeholder="Resposável pelo caso"
      />
    </View>

    <View style={styles.section}>
      <View style={styles.inputGroup}>
      <Text style={styles.label}>Local:</Text>
      <TextInput
      style={styles.input}
      value={endereco}
      onChangeText={setEndereco}
      placeholder="Local do caso"
      />
    </View>
      <View style={styles.mapContainer}>
        {/* imagem do mapa */}
      </View>
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Informações:</Text>
      <TextInput
      style={[styles.input, styles.textArea]}
      value={informacoes}
      onChangeText={setInformacoes}
      multiline
      numberOfLines={4}
      placeholder="Informações do  caso"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
      style={styles.input}
      value={descricao}
      onChangeText={setResponsavel}
      placeholder="Descrição do  caso"
      />
    </View>

      <View style={styles.pickerContainer}>
        <Picker
        selectedValue={sexoVitima}
        onValueChange={(itemValue) => setSexoVitima(itemValue)}
        style={styles.picker}>
          <Picker.Item label="Sexo" value=""/>
          <Picker.Item label="Feminino" value="Feminino"/>
          <Picker.Item label="Masculino" value="Masculino"/>
          <Picker.Item label="Outro" value="Outro"/>
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
          <Picker
          selectedValue={corPele}
          onValueChange={(itemValue) => setCorPele(itemValue)}
          style={styles.picker}>
            <Picker.Item label="cor de pele" value=""/>
            <Picker.Item label="Branca" value="Branca"/>
            <Picker.Item label="Parda" value="Parda"/>
            <Picker.Item label="Preta" value="Preta"/>
            <Picker.Item label="Amarelo" value="Amarelo"/>
            <Picker.Item label="Indígena" value="Indígena"/>
            <Picker.Item label="Não identificada" value="Não identificada"/>
          </Picker>
        </View>
    
    <View style={styles.row}>

      <View style={[styles.inputGroup, styles.width]}>
        <Text style={styles.label}>Hora:</Text>
        <TextInput
        style={styles.input}
        value={hora}
        onChangeText={setHora}
        placeholder="HH:MM"
        keyboardType="numeric"
        />
      </View>

      <View style={[styles.inputGroup, styles.width]}>
        <Text style={styles.label}>Data:</Text>
        <TextInput
        style={styles.input}
        value={data}
        onChangeText={setData}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
        />
      </View>
    </View>

      <View style={styles.inputGroup}>
      <Text style={styles.label}> Causa da morte:</Text>
      <TextInput
      style={styles.input}
      value={causaMorte}
      onChangeText={setCausaMorte}
      placeholder="Causa da morte"
      />
    </View>

    <View style={styles.section}>
      <Odontograma odontograma={Odontograma} setOdontograma={setOdontogramaData} />
    </View>

    <Button
        mode="contained"
        onPress={() => navigation.navigate('Evidencia')}
        style={styles.add}
      >
        + Adiciona evidência
      </Button>
    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  headerTitle:{
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00000',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#00000',
    marginBottom: 5,
  },
  input:{
    backgroundColor: '#fff',
    color: '#00000',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  textArea:{
    height: 100,
    textAlignVertical:'top',
  },
  section:{
    marginBottom: 15,
  },
  sectionTitle:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00000',
    marginBottom: 10,
  },
  mapContainer:{
    backgroundColor: '#777777',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    height: 200,
    justifyContent: 'flex-end',
  },
  mapAddress:{
    color: '#00000',
    fontSize: 14,
    padding:10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    width:'100%',
  },
  row:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  width:{
    width:'40%',
  },
  pickerContainer: {
  backgroundColor: '#fff',
  borderRadius: 8,
  paddingHorizontal: 15,
  paddingVertical: 4,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4,
  marginBottom: 15,
},
picker: {
  color: '#000', // cor do texto
  height: 40,
  fontSize:14,
},
  add: {
    alignSelf: 'flex-end',
    marginVertical: 15,
    backgroundColor: '#145da0',
    marginEnd: 15,
  },
});
export default CriarCasoScreen;