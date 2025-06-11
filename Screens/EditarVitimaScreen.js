import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, Menu } from 'react-native-paper';
import { casesAPI } from '../services/api';

const sexoOptions = ['Masculino', 'Feminino', 'Outro'];
const corEtniaOptions = ['Branco', 'Negro', 'Pardo', 'Indígena', 'Amarelo', 'Outro'];

export default function EditarVitimaScreen({ route, navigation }) {
  const { vitimaId, casoId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Campos do formulário
  const [nic, setNic] = useState('');
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [corEtnia, setCorEtnia] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');

  // Menus
  const [sexoMenuVisible, setSexoMenuVisible] = useState(false);
  const [corEtniaMenuVisible, setCorEtniaMenuVisible] = useState(false);

  useEffect(() => {
    const loadVitima = async () => {
      try {
        const vitimaData = await casesAPI.getVictimById(vitimaId);
        setNic(vitimaData.nic);
        setNome(vitimaData.nome);
        setSexo(vitimaData.sexo || '');
        setCorEtnia(vitimaData.corEtnia || '');
        setDataNascimento(vitimaData.dataNascimento ? new Date(vitimaData.dataNascimento).toISOString().split('T')[0] : '');
        setEndereco(vitimaData.endereco || '');
      } catch (error) {
        console.error('Erro ao carregar vítima:', error);
        setError('Erro ao carregar dados da vítima');
      } finally {
        setLoading(false);
      }
    };

    loadVitima();
  }, [vitimaId]);

  const validateForm = () => {
    if (!nic.trim()) {
      setError('NIC é obrigatório');
      return false;
    }
    if (!nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError('');
      setSuccess(false);

      const updatedVictim = {
        nic,
        nome,
        sexo,
        corEtnia,
        dataNascimento,
        endereco,
      };

      await casesAPI.updateVictim(vitimaId, updatedVictim);
      setSuccess(true);

      // Navegar de volta após 2 segundos
      setTimeout(() => {
        navigation.goBack();
      }, 2000);

    } catch (error) {
      console.error('Erro ao atualizar vítima:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Editar Vítima</Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {success ? (
          <Text style={styles.successText}>Vítima atualizada com sucesso!</Text>
        ) : null}

        <TextInput
          label="NIC"
          value={nic}
          onChangeText={setNic}
          style={styles.input}
        />

        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        <Menu
          visible={sexoMenuVisible}
          onDismiss={() => setSexoMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setSexoMenuVisible(true)}
              style={styles.menuButton}
            >
              {sexo || 'Selecione o Sexo'}
            </Button>
          }
        >
          {sexoOptions.map((s) => (
            <Menu.Item
              key={s}
              onPress={() => {
                setSexo(s);
                setSexoMenuVisible(false);
              }}
              title={s}
            />
          ))}
        </Menu>

        <Menu
          visible={corEtniaMenuVisible}
          onDismiss={() => setCorEtniaMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setCorEtniaMenuVisible(true)}
              style={styles.menuButton}
            >
              {corEtnia || 'Selecione a Cor/Etnia'}
            </Button>
          }
        >
          {corEtniaOptions.map((c) => (
            <Menu.Item
              key={c}
              onPress={() => {
                setCorEtnia(c);
                setCorEtniaMenuVisible(false);
              }}
              title={c}
            />
          ))}
        </Menu>

        <TextInput
          label="Data de Nascimento"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          style={styles.input}
          placeholder="YYYY-MM-DD"
        />

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
            loading={saving}
            disabled={saving}
            style={[styles.button, styles.saveButton]}
          >
            Salvar Alterações
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
            disabled={saving}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  menuButton: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  errorText: {
    color: '#B00020',
    marginBottom: 10,
  },
  successText: {
    color: '#4CAF50',
    marginBottom: 10,
  },
}); 