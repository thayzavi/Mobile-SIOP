import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { TextInput, Button, Text, HelperText, Menu, Divider } from 'react-native-paper';
import { casesAPI } from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import LocalMap from '../Screens/components/LocalMap';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tiposEvidencia = [
 'Imagem',
 'Texto'
];

const categoriasEvidencia = [
  'Física',
  'Biológica',
  'Química',
  'Documental',
  'Digital',
  'Outra'
];

const origensEvidencia = [
  'Local do Crime',
  'Vítima',
  'Suspeito',
  'Testemunha',
  'Outra'
];

const condicoesEvidencia = [
  'Intacta',
  'Danificada',
  'Fragmentada',
  'Contaminada',
  'Outra'
];

const statusEvidencia = [
  'Em Análise',
  'Analisada',
  'Arquivada',
  'Destruída',
  'Outro'
];

export default function NovaEvidenciaScreen({ route, navigation }) {
  const { casoId } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [vitimas, setVitimas] = useState([]);

  // Campos do formulário
  const [tipo, setTipo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [origem, setOrigem] = useState('');
  const [condicao, setCondicao] = useState('');
  const [status, setStatus] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [observacoesTecnicas, setObservacoesTecnicas] = useState('');
  const [descricaoDetalhada, setDescricaoDetalhada] = useState('');
  const [vitimaId, setVitimaId] = useState('');

  // Menus
  const [tipoMenuVisible, setTipoMenuVisible] = useState(false);
  const [categoriaMenuVisible, setCategoriaMenuVisible] = useState(false);
  const [vitimaMenuVisible, setVitimaMenuVisible] = useState(false);
  const [origemMenuVisible, setOrigemMenuVisible] = useState(false);
  const [condicaoMenuVisible, setCondicaoMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);

  useEffect(() => {
    const loadUserAndVictims = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);

        const victimsData = await casesAPI.getCaseVictims(casoId);
        setVitimas(victimsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados necessários');
      }
    };

    loadUserAndVictims();
  }, [casoId]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      setError('Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImage({
        uri: selectedAsset.uri,
        type: 'image/jpeg',
        fileName: selectedAsset.uri.split('/').pop()
      });
    }
  };

  const validateForm = () => {
    if (!tipo) {
      setError('Tipo é obrigatório');
      return false;
    }
    if (!categoria) {
      setError('Categoria é obrigatória');
      return false;
    }
    if (!vitimaId) {
      setError('Vítima é obrigatória');
      return false;
    }
    if (!userId) {
      setError('Erro ao identificar o usuário');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const evidenceData = {
        tipo,
        coletadoPor: userId,
        vitima: vitimaId,
        categoria,
        origem,
        condicao,
        status,
        localizacao,
        conteudo,
        observacoesTecnicas,
        descricaoDetalhada,
      };

      let response;
      if (image) {
        console.log('Enviando imagem:', image);
        response = await casesAPI.uploadEvidenceImage(casoId, image, evidenceData);
      } else {
        response = await casesAPI.createEvidence(casoId, evidenceData);
      }

      setSuccess(true);
      
      // Limpar formulário
      setTipo('');
      setCategoria('');
      setOrigem('');
      setCondicao('');
      setStatus('');
      setLocalizacao('');
      setConteudo('');
      setObservacoesTecnicas('');
      setDescricaoDetalhada('');
      setVitimaId('');
      setImage(null);

      // Navegar de volta após 2 segundos
      setTimeout(() => {
        navigation.goBack();
      }, 2000);

    } catch (error) {
      console.error('Erro ao submeter evidência:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  console.log(Array.isArray(vitimas));  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nova Evidência</Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {success ? (
          <Text style={styles.successText}>Evidência adicionada com sucesso!</Text>
        ) : null}

        {/* Upload de Imagem */}
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text>Nenhuma imagem selecionada</Text>
            </View>
          )}
          <Button
            mode="outlined"
            onPress={pickImage}
            style={styles.imageButton}
          >
            Selecionar Imagem
          </Button>
        </View>

        {/* Tipo */}
        <Menu
          visible={tipoMenuVisible}
          onDismiss={() => setTipoMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setTipoMenuVisible(true)}
              style={styles.menuButton}
            >
              {tipo || 'Selecione o Tipo'}
            </Button>
          }
        >
          {tiposEvidencia.map((t) => (
            <Menu.Item
              key={t}
              onPress={() => {
                setTipo(t);
                setTipoMenuVisible(false);
              }}
              title={t}
            />
          ))}
        </Menu>

        {/* Categoria */}
        <Menu
          visible={categoriaMenuVisible}
          onDismiss={() => setCategoriaMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setCategoriaMenuVisible(true)}
              style={styles.menuButton}
            >
              {categoria || 'Selecione a Categoria'}
            </Button>
          }
        >
          {categoriasEvidencia.map((c) => (
            <Menu.Item
              key={c}
              onPress={() => {
                setCategoria(c);
                setCategoriaMenuVisible(false);
              }}
              title={c}
            />
          ))}
        </Menu>

        {/* Vítima */}
        <Menu
          visible={vitimaMenuVisible}
          onDismiss={() => setVitimaMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setVitimaMenuVisible(true)}
              style={styles.menuButton}
            >
              {vitimas.find(v => v._id === vitimaId)?.nome || 'Selecione a Vítima'}
            </Button>
          }
        >
          {vitimas.map((v) => (
            <Menu.Item
              key={v._id}
              onPress={() => {
                setVitimaId(v._id);
                setVitimaMenuVisible(false);
              }}
              title={v.nome}
            />
          ))}
        </Menu>

        <View style={styles.section}>
        <Text style={styles.label}>Localização:*</Text>
        <LocalMap
          onLocationUpdate={(locationData) => {
            setLocalizacao(locationData.endereco);
          }}
          mapStyle={styles.map}
        />
      </View>

        {/* Origem */}
        <Menu
          visible={origemMenuVisible}
          onDismiss={() => setOrigemMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setOrigemMenuVisible(true)}
              style={styles.menuButton}
            >
              {origem || 'Selecione a Origem'}
            </Button>
          }
        >
          {origensEvidencia.map((o) => (
            <Menu.Item
            
              key={o}
              onPress={() => {
                setOrigem(o);
                setOrigemMenuVisible(false);
              }}
              title={o}
            />
          ))}
        </Menu>


        {/* Condição */}
        <Menu
          visible={condicaoMenuVisible}
          onDismiss={() => setCondicaoMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setCondicaoMenuVisible(true)}
              style={styles.menuButton}
            >
              {condicao || 'Selecione a Condição'}
            </Button>
          }
        >
          {condicoesEvidencia.map((c) => (
            <Menu.Item
              key={c}
              onPress={() => {
                setCondicao(c);
                setCondicaoMenuVisible(false);
              }}
              title={c}
            />
          ))}
        </Menu>

        {/* Status */}
        <Menu
          visible={statusMenuVisible}
          onDismiss={() => setStatusMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setStatusMenuVisible(true)}
              style={styles.menuButton}
            >
              {status || 'Selecione o Status'}
            </Button>
          }
        >
          {statusEvidencia.map((s) => (
            <Menu.Item
              key={s}
              onPress={() => {
                setStatus(s);
                setStatusMenuVisible(false);
              }}
              title={s}
            />
          ))}
        </Menu>


        <TextInput
          label="Conteúdo"
          value={conteudo}
          onChangeText={setConteudo}
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        <TextInput
          label="Observações Técnicas"
          value={observacoesTecnicas}
          onChangeText={setObservacoesTecnicas}
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        <TextInput
          label="Descrição Detalhada"
          value={descricaoDetalhada}
          onChangeText={setDescricaoDetalhada}
          style={styles.input}
          multiline
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Adicionar Evidência
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
  input: {
   flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    height: 50,
  },
  menuButton: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 9,
    backgroundColor: 'white',
    marginBottom:10,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    marginBottom: 10,
    backgroundColor: '#2A5D90'
  },
  errorText: {
    color: '#B00020',
    marginBottom: 10,
  },
  successText: {
    color: '#4CAF50',
    marginBottom: 10,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  imageButton: {
    marginBottom: 10,
  },
  map:{
    marginBottom:10,
  },
}); 