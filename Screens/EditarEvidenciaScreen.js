import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { TextInput, Button, Text, HelperText, Menu } from 'react-native-paper';
import { casesAPI } from '../services/api';
import LocalMap from '../Screens/components/LocalMap'
import * as ImagePicker from 'expo-image-picker';

const tiposEvidencia = ['Imagem', 'Texto'];
const categoriasEvidencia = ['Física', 'Biológica', 'Química', 'Documental', 'Digital', 'Outra'];
const origensEvidencia = ['Local do Crime', 'Vítima', 'Suspeito', 'Testemunha', 'Outra'];
const condicoesEvidencia = ['Bem conservada', 'Danificada', 'Parcial'];
const statusEvidencia = ['Aberto', 'Em Análise', 'Fechado'];

export default function EditarEvidenciaScreen({ route, navigation }) {
  const { evidenciaId, casoId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
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
  const [origemMenuVisible, setOrigemMenuVisible] = useState(false);
  const [condicaoMenuVisible, setCondicaoMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [vitimaMenuVisible, setVitimaMenuVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar evidência
        const evidenciaData = await casesAPI.getEvidenceById(evidenciaId);
        setTipo(evidenciaData.tipo);
        setCategoria(evidenciaData.categoria);
        setOrigem(evidenciaData.origem);
        setCondicao(evidenciaData.condicao);
        setStatus(evidenciaData.status);
        setLocalizacao(evidenciaData.localizacao);
        setConteudo(evidenciaData.conteudo || '');
        setObservacoesTecnicas(evidenciaData.observacoesTecnicas || '');
        setDescricaoDetalhada(evidenciaData.descricaoDetalhada || '');
        setVitimaId(evidenciaData.vitima);
        setImageUrl(evidenciaData.imagemURL);
        
        // Preservar campos específicos de imagem
        if (evidenciaData.tipo === 'Imagem') {
          setImage({
            uri: evidenciaData.imagemURL,
            type: 'image/jpeg',
            fileName: evidenciaData.publicId
          });
        }

        // Carregar vítimas
        const vitimasData = await casesAPI.getCaseVictims(casoId);
        setVitimas(vitimasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados da evidência');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [evidenciaId, casoId]);

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
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError('');
      setSuccess(false);

      // Se houver uma nova imagem, faz o upload primeiro
      if (image && image.uri !== imageUrl) {
        const photoResponse = await casesAPI.uploadEvidenceImage(casoId, image, {
          tipo,
          categoria,
          origem,
          condicao,
          status,
          localizacao,
          conteudo,
          observacoesTecnicas,
          descricaoDetalhada,
          vitima: vitimaId,
        });
        setImageUrl(photoResponse.imagemURL);
      } else {
        // Atualiza apenas os dados da evidência
        const updatedEvidence = {
          tipo,
          categoria,
          origem,
          condicao,
          status,
          localizacao,
          conteudo,
          observacoesTecnicas,
          descricaoDetalhada,
          vitima: vitimaId,
          // Preservar campos de imagem se for do tipo Imagem
          ...(tipo === 'Imagem' && {
            imagemURL: imageUrl,
            publicId: image?.fileName
          })
        };

        await casesAPI.updateEvidence(evidenciaId, updatedEvidence);
      }

      setSuccess(true);

      // Navegar de volta após 2 segundos
      setTimeout(() => {
        navigation.goBack();
      }, 2000);

    } catch (error) {
      console.error('Erro ao atualizar evidência:', error);
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
        <Text style={styles.title}>Editar Evidência</Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {success ? (
          <Text style={styles.successText}>Evidência atualizada com sucesso!</Text>
        ) : null}

        {/* Upload de Imagem */}
        <View style={styles.imageContainer}>
            <View style={styles.row}>
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
    </View>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
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
            {imageUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
          </Button>

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
        </View>
      <View style={styles.row}>
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
      </View>
        <TextInput
          label="Conteúdo"
          value={conteudo}
          onChangeText={setConteudo}
          style={styles.input}
          multiline
          numberOfLines={3}
        />
  
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
    marginBottom: 16,
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
   row: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  menuButton: {
    margin: 5,
    minWidth: 150,
    flexShrink: 1,
    backgroundColor: '#fff',
    borderColor: '#fff',
    shadowColor: '#000',
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
}); 