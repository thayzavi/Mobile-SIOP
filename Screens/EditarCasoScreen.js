import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { TextInput, Button, Text, HelperText, Menu } from 'react-native-paper';
import { casesAPI } from '../services/api';
import Odontograma from './components/Odontograma';
import * as ImagePicker from 'expo-image-picker';

const statusOptions = ['Aberto', 'Em Análise', 'Concluído', 'Fechado'];

export default function EditarCasoScreen({ route, navigation }) {
  const { casoId, caso } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(caso.caseImageUrl);

  // Campos do formulário
  const [titulo, setTitulo] = useState(caso.titulo);
  const [descricao, setDescricao] = useState(caso.descricao);
  const [causaMorte, setCausaMorte] = useState(caso.causaMorte);
  const [localizacao, setLocalizacao] = useState(caso.localizacao);
  const [status, setStatus] = useState(caso.status);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [odontograma, setOdontograma] = useState(caso.odontograma || {});

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
    if (!titulo.trim()) {
      setError('Título é obrigatório');
      return false;
    }
    if (!descricao.trim()) {
      setError('Descrição é obrigatória');
      return false;
    }
    if (!localizacao.trim()) {
      setError('Localização é obrigatória');
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

      // Se houver uma nova imagem, faz o upload primeiro
      if (image) {
        const photoResponse = await casesAPI.uploadCasePhoto(casoId, image);
        setImageUrl(photoResponse.caseImageUrl);
      }

      const updatedCase = {
        titulo,
        descricao,
        causaMorte,
        localizacao,
        status,
        odontograma,
      };

      await casesAPI.updateCase(casoId, updatedCase);
      setSuccess(true);

      // Navegar de volta após 2 segundos
      setTimeout(() => {
        navigation.goBack();
      }, 2000);

    } catch (error) {
      console.error('Erro ao atualizar caso:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Editar Caso</Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {success ? (
          <Text style={styles.successText}>Caso atualizado com sucesso!</Text>
        ) : null}

        {/* Upload de Imagem */}
        <View style={styles.imageContainer}>
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
        </View>

        <TextInput
          label="Título"
          value={titulo}
          onChangeText={setTitulo}
          style={styles.input}
        />

        <TextInput
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
          multiline
          numberOfLines={4}
        />

        <TextInput
          label="Causa da Morte"
          value={causaMorte}
          onChangeText={setCausaMorte}
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        <TextInput
          label="Localização"
          value={localizacao}
          onChangeText={setLocalizacao}
          style={styles.input}
        />

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
          {statusOptions.map((s) => (
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

        <Odontograma Odontograma={odontograma} setOdontograma={setOdontograma} />

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={[styles.button, styles.saveButton]}
          >
            Salvar Alterações
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
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