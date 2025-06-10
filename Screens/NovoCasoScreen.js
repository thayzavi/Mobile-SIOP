import React, { useEffect, useState } from 'react';
import {View,Text, Alert, TextInput, StyleSheet, ScrollView, Platform, TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {Button } from 'react-native-paper';
import Odontograma from './components/Odontograma';
import DataHora from './components/DataHora';
import LocalMap from './components/LocalMap';



function CriarCasoScreen({ navigation }) {
  const [NIC, setNIC] = useState('');
  const [nomeCaso, setNomeCaso] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [informacoes, setInformacoes] = useState('');
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [sexoVitima, setSexoVitima] = useState('');
  const [causaMorte, setCausaMorte] = useState('');
  const [corPele, setCorPele] = useState('');
  const [statusCaso , setstatusCaso] = useState('');
  const [identificacao, setIdentificacao] = useState('');
  const [hora, setHora] = useState(new Date());
  const [data, setData] = useState(new Date());

  const [OdontogramaData, setOdontogramaData] = useState({});


  

  const criarCaso = async () => {
  const novoCaso = {
    NIC,
    nomeCaso,
    responsavel,
    informacoes,
    descricao,
    endereco,
    data: data.toISOString(),
    hora: hora.toString().slice(0, 5),
    sexoVitima,
    causaMorte,
    corPele,
    statusCaso,
    identificacao,
    odontograma: OdontogramaData,
  };
  
  try {
    const response = await fetch('https://backend-siop.onrender.com/api/cases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoCaso),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar caso');
    }

    const data = await response.json();
    console.log('Caso criado com sucesso:', data);

  } catch (error) {
    console.error('Erro ao criar caso:', error);
    alert('Erro ao criar caso. Tente novamente.');
  }
};
  return(
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Criar caso</Text>


    {/* campo identificação */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={identificacao}
          onValueChange={setIdentificacao}
          style={styles.picker}>

          <Picker.Item label="Identificação" value="" />
          <Picker.Item label="Identificado" value="identificado" />
          <Picker.Item label="Não identificado" value="nao_identificado" />
        </Picker>
      </View>
      {/* NIC da vitima */}

    <View style={styles.inputGroup}>
      <Text style={styles.label}>NIC:</Text>
      <TextInput
      style={styles.input}
      value={NIC}
      onChangeText={setNIC}
      placeholder="NIC da vitíma"
      />
    </View>
    
    {/* campo nome do caso */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Nome do caso:</Text>
      <TextInput
      style={styles.input}
      value={nomeCaso}
      onChangeText={setNomeCaso}
      placeholder="Nome do caso"
      />
    </View>

    {/* responsavel */}
    <View style={styles.inputGroup}>
      
      <Text style={styles.label}>Reponsável:</Text>
      <TextInput
      style={styles.input}
      value={responsavel}
      onChangeText={setResponsavel}
      placeholder="Resposável pelo caso"
      />
    </View>

    {/* local */}
  <View style={styles.section}>
  <LocalMap
    onLocationUpdate={(locationData) => {
      setEndereco(locationData.endereco);
    }}
    mapStyle={styles.map}
  />
</View>

    {/* informações */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Informações:</Text>
      <TextInput
      style={[styles.input, styles.textArea]}
      value={informacoes}
      onChangeText={setInformacoes}
      multiline
      numberOfLines={4}
      placeholder="Informações do caso"
      />
    </View>

    {/* descrição */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
      style={styles.input}
      value={descricao}
      onChangeText={setDescricao}
      numberOfLines={4}
      placeholder="Descrição do caso"
      />
    </View>

    {/* sexo da vitima */}
      <View style={styles.pickerContainer}>
        <Picker
        selectedValue={sexoVitima}
        onValueChange={(itemValue) => setSexoVitima(itemValue)}
        mode="dropdown"
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
          mode="dropdown"
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
    
    {/* div data e hora */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.width]}>
          <DataHora
            mode="date"
            onDateChange={(newDate) => setData(newDate)}
            initialDate={data}
            containerStyle={styles.pickerContainer}
            buttonStyle={styles.dateTimeButton}
            textStyle={styles.dateTimeText}
          />
        </View>
  
        <View style={[styles.inputGroup, styles.width]}>
            <DataHora
              mode="time"
              onTimeChange={(newTime) => setHora(newTime)}
              initialDate={hora}
              containerStyle={styles.pickerContainer}
              buttonStyle={styles.dateTimeButton}
              textStyle={styles.dateTimeText}
            />
          </View>
      </View>
            
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={statusCaso}
          onValueChange={setstatusCaso}
          mode="dropdown"
          style={styles.picker}>
          
          <Picker.Item label="Status do caso" value="" />
          <Picker.Item label="Aberto" value="Aberto" />
          <Picker.Item label="Fechado" value="Fechado" />
          <Picker.Item label="Em andamento" value="Em_andamento" />
          <Picker.Item label="Concluído" value="Concluído" />

        </Picker>
      </View>


      {/* causa da morte */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}> Causa da morte:</Text>
      <TextInput
      style={styles.input}
      value={causaMorte}
      onChangeText={setCausaMorte}
      placeholder="Causa da morte"
      numberOfLines={4}
      />
    </View>


    {/* componente odontograma */}
    <View style={styles.section}>
      <Odontograma odontograma={OdontogramaData} setOdontograma={setOdontogramaData} />
    </View>

    {/* btn */}
    <Button
        mode="contained"
        onPress={criarCaso}
        style={styles.add}
      >
        + Criar novo caso
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
  row:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  width:{
    width:'40%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    color: '#000', // cor do texto visível
    height: 60,
    width: '100%',
  },
  add: {
    alignSelf: 'flex-end',
    marginVertical: 15,
    backgroundColor: '#145da0',
    marginEnd: 15,
  },
});

export default CriarCasoScreen;