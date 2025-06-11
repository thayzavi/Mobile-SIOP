import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { casesAPI } from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NovaVitimaScreen({ route, navigation }) {
  const { casoId } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Campos do formulário
  const [nic, setNic] = useState('');
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [corEtnia, setCorEtnia] = useState('');
  const [documento, setDocumento] = useState('');
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [endereco, setEndereco] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Validação
  const [nicError, setNicError] = useState('');
  const [nomeError, setNomeError] = useState('');

  const validateForm = () => {
    let isValid = true;

    if (!nic.trim()) {
      setNicError('NIC é obrigatório');
      isValid = false;
    } else {
      setNicError('');
    }

    if (!nome.trim()) {
      setNomeError('Nome é obrigatório');
      isValid = false;
    } else {
      setNomeError('');
    }

    return isValid;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDataNascimento(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const victimData = {
        nic,
        nome,
        sexo,
        corEtnia,
        documento,
        dataNascimento: dataNascimento.toISOString(),
        endereco,
      };

      await casesAPI.createVictim(casoId, victimData);
      setSuccess(true);
      
      // Limpar formulário
      setNic('');
      setNome('');
      setSexo('');
      setCorEtnia('');
      setDocumento('');
      setDataNascimento(new Date());
      setEndereco('');

      // Navegar de volta após 2 segundos
      setTimeout(() => {
        navigation.goBack();
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nova Vítima</Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {success ? (
          <Text style={styles.successText}>Vítima adicionada com sucesso!</Text>
        ) : null}

        <TextInput
          label="NIC *"
          value={nic}
          onChangeText={setNic}
          style={styles.input}
          error={!!nicError}
        />
        <HelperText type="error" visible={!!nicError}>
          {nicError}
        </HelperText>

        <TextInput
          label="Nome *"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          error={!!nomeError}
        />
        <HelperText type="error" visible={!!nomeError}>
          {nomeError}
        </HelperText>

        <View style={styles.row}>
          <TextInput
          label="Sexo"
          value={sexo}
          onChangeText={setSexo}
          style={styles.inputt}
        />

        <TextInput
          label="Cor/Etnia"
          value={corEtnia}
          onChangeText={setCorEtnia}
          style={styles.inputt}
        />
        </View>

        <TextInput
          label="Documento"
          value={documento}
          onChangeText={setDocumento}
          style={styles.input}
        />

        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          Data de Nascimento: {dataNascimento.toLocaleDateString('pt-BR')}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={dataNascimento}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <TextInput
          label="Endereço"
          value={endereco}
          onChangeText={setEndereco}
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Adicionar Vítima
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.btn}
            disabled={loading}
          >
            Cancelar
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F8',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#145da0',
    marginBottom: 20,
  },
   row: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 10,
  },
  input: {
    marginBottom: 5,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    height: 55,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateButton: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    marginBottom: 10,
    backgroundColor: '#154c79',
  },
  errorText: {
    color: '#B00020',
    marginBottom: 10,
  },
  successText: {
    color: '#4CAF50',
    marginBottom: 10,
  },
  inputt:{
    width: '50%',
    marginBottom: 5,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    height: 55,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
}); 