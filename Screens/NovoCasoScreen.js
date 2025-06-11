import React, { useEffect, useState } from 'react';
import {View,Text, Alert, TextInput, StyleSheet, ScrollView} from 'react-native';
import {Button } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import DataHora from './components/DataHora';
import LocalMap from './components/LocalMap';
import { casesAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const statusOptions = [
  { label: 'Aberto', value: 'Aberto' },
  { label: 'Fechado', value: 'Fechado' },
  { label: 'Em Análise', value: 'Em Análise' },
];

function CriarCasoScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [causaMorte, setCausaMorte] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [dataAbertura, setDataAbertura] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Carregar o ID do usuário logado
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Erro ao carregar ID do usuário:', error);
      }
    };

    loadUserId();
  }, []);

  const validateFields = () => {
    if (!titulo || !descricao || !status || !localizacao || !causaMorte || !instituicao) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return false;
    }
    if (!userId) {
      Alert.alert('Erro', 'Usuário não autenticado. Por favor, faça login novamente.');
      return false;
    }
    return true;
  };

  const criarCaso = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const caseData = {
        titulo,
        descricao,
        status,
        localizacao,
        responsavel: userId,
        causaMorte,
        instituicao,
        dataAbertura: dataAbertura.toISOString(),
        evidencias: [],
        relatorios: []
      };

      console.log('Dados do caso a serem enviados:', caseData);
      const newCase = await casesAPI.createCase(caseData);
      Alert.alert('Sucesso', 'Caso criado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro detalhado:', error);
      Alert.alert('Erro', error.message || 'Erro ao criar caso');
    } finally {
      setLoading(false);
    }
  };

  return(
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Criar caso</Text>



      {/* Status */}
      <View style={styles.dropdownContainer}>
      <Dropdown
        style={styles.dropdown}
        data={statusOptions}
        labelField="label"
        valueField="value"
        placeholder="Status do caso*"
        value={status}
        onChange={item => setStatus(item.value)}
      />
    </View>

      {/* Título do caso */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Título do caso:*</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título do caso"
        />
      </View>

      {/* Descrição */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição:*</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={4}
          placeholder="Descrição do caso"
        />
      </View>

      {/* Localização */}
      <View style={styles.section}>
        <Text style={styles.label}>Localização:*</Text>
        <LocalMap
          onLocationUpdate={(locationData) => {
            setLocalizacao(locationData.endereco);
          }}
          mapStyle={styles.map}
        />
      </View>

      {/* Instituição */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Instituição:*</Text>
        <TextInput
          style={styles.input}
          value={instituicao}
          onChangeText={setInstituicao}
          placeholder="Instituição responsável"
        />
      </View>

      {/* Causa da morte */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Causa da morte:*</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={causaMorte}
          onChangeText={setCausaMorte}
          multiline
          numberOfLines={4}
          placeholder="Causa da morte"
        />
      </View>

      {/* Data de abertura */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data de abertura:</Text>
        <DataHora
          mode="date"
          onDateChange={(newDate) => setDataAbertura(newDate)}
          initialDate={dataAbertura}
          containerStyle={styles.pickerContainer}
          buttonStyle={styles.dateTimeButton}
          textStyle={styles.dateTimeText}
        />
      </View>

      {/* Botão de criar */}
      <Button
        mode="contained"
        onPress={criarCaso}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        {loading ? 'Criando...' : 'Criar caso'}
      </Button>
    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#F2F4F8',
    padding: 16,
  },
  headerTitle:{
    fontSize: 24,
    fontWeight: 'bold',
    color: '#145da0',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#145da0',
    marginBottom: 8,
  },
  input:{
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea:{
    height: 100,
    textAlignVertical:'top',
  },
  section:{
    marginBottom: 16,
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginBottom: '40%',
  },
  dropdownContainer: {
    margin: 16,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 9,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: '#145da0',
  },
  dateTimeButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateTimeText: {
    color: '#145da0',
  },
});

export default CriarCasoScreen;