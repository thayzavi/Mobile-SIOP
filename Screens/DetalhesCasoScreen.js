import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Menu,
  Divider,
} from 'react-native-paper';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const { width } = Dimensions.get('window');
const heightMap = 900; 

const DetalhesDoCasoScreen = ({ route, navigation }) => {
  const { casoId } = route.params;
  const [caso, setCaso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState('');

  useEffect(() => {
    const fetchCaso = async () => {
      try {
        const response = await axios.get(`https://backend-siop.onrender.com/api/cases/${casoId}`);
        setCaso(response.data);
        setStatusSelecionado(response.data.status);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do caso.');
      } finally {
        setLoading(false);
      }
    };

    fetchCaso();
  }, [casoId]);

  const atualizarStatus = async (novoStatus) => {
    try {
      await axios.put(`https://backend-siop.onrender.com/api/cases/${casoId}`, {
        status: novoStatus,
      });
      setStatusSelecionado(novoStatus);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    } finally {
      setStatusMenuVisible(false);
    }
  };

  const gerarMapaHTML = (local) => {
    const encodedLocation = encodeURIComponent(local);
    return `
      <iframe
        width="100%"
        height="${heightMap}"
        frameborder="0"
        style="border:0"
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps?q=${encodedLocation}&output=embed"
        allowfullscreen>
      </iframe>
    `;
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#145da0" />
      </View>
    );
  }

  if (!caso) {
    return (
      <View style={styles.error}>
        <Text>Erro ao carregar os dados.</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Detalhes do Caso:</Text>

      <View style={styles.tabs}>
        <Button mode="text" onPress={() => navigation.navigate('Detalhes caso', { casoId })} style={styles.tabButton} labelStyle={styles.tabText}>
          1 Informações Básicas
        </Button>
        <Button mode="text" onPress={() => navigation.navigate('Lista de evidência', { casoId })} style={styles.tabButton} labelStyle={styles.tabText}>
          2 Evidências
        </Button>
        <Button mode="text" onPress={() => navigation.navigate('Lista de vitima', { casoId })} style={styles.tabButton} labelStyle={styles.tabText}>
          3 Vítimas
        </Button>
      </View>

      <Divider style={{ marginVertical: 4, backgroundColor: '#145da0' }} />

      <Button mode="contained" style={styles.editButton} onPress={() => navigation.navigate('Novo caso', { casoId })}>
        Editar caso
      </Button>

      {caso.caseImageUrl && (
        <Image source={{ uri: caso.caseImageUrl }} style={styles.image} />
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text>Identificação: {caso._id}</Text>
          <Text>Instituição: {caso.instituicao}</Text>
          <Text>Responsável: {caso.responsavel?.nome}</Text>
          <Text>Data do caso: {new Date(caso.dataAbertura).toLocaleDateString()}</Text>
          <Text>Local do incidente: {caso.localizacao}</Text>
          <Text>Causa da morte: {caso.causaMorte}</Text>

          <Text>Status:</Text>
          <Menu
            visible={statusMenuVisible}
            onDismiss={() => setStatusMenuVisible(false)}
            anchor={
              <Button mode="outlined" onPress={() => setStatusMenuVisible(true)} style={{ marginTop: 8 }}>
                {statusSelecionado}
              </Button>
            }
          >
            <Menu.Item onPress={() => atualizarStatus('Aberto')} title="Aberto" />
            <Menu.Item onPress={() => atualizarStatus('Fechado')} title="Fechado" />
            <Menu.Item onPress={() => atualizarStatus('Em análise')} title="Em análise" />
          </Menu>
        </Card.Content>
      </Card>

      {caso.vitima?.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Informações da vítima" />
          <Card.Content>
            <Text>NIC: {caso.vitima[0]?.NIC || 'N/A'}</Text>
            <Text>Nome: {caso.vitima[0]?.nome || 'N/A'}</Text>
            <Text>Documento: {caso.vitima[0]?.documento || 'N/A'}</Text>
            <Text>
              Data de nascimento:{' '}
              {caso.vitima[0]?.dataNascimento ? new Date(caso.vitima[0].dataNascimento).toLocaleDateString() : 'N/A'}
            </Text>
            <Text>Sexo da vítima: {caso.vitima[0]?.sexo || 'N/A'}</Text>
            <Text>Cor/Etnia: {caso.vitima[0]?.corEtnia || 'N/A'}</Text>
          </Card.Content>
          
        </Card>
      )}


        <Card.Title title="Localização no mapa" />
     
          {Platform.OS === 'web' ? (
            <iframe
              title="Mapa dinâmico"
              src={`https://www.google.com/maps?q=${encodeURIComponent(caso.localizacao)}&output=embed`}
              width="100%"
              height={heightMap}
              style={{ border: 0, borderRadius: 8 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            
          ) : (
            
            <WebView
              source={{ html: gerarMapaHTML(caso.localizacao) }}
              style={{ width: '100%', height: heightMap, borderRadius: 8 }}
              originWhitelist={['*']}
              javaScriptEnabled
              domStorageEnabled
              scalesPageToFit
              
            />
            
          )}
         
       
    

      <Card style={styles.card}>
        <Card.Title title="Anotação dentária" />
        <Card.Content style={styles.dentalNote}>
          <View style={styles.dentalRow}>
            <Text style={{ fontWeight: 'bold' }}>Dente</Text>
            <Text style={{ fontWeight: 'bold' }}>Anotação</Text>
          </View>
          <Divider style={{ marginVertical: 4 }} />
          {(caso.anotacoesDentarias || [
            { dente: '14', anotacao: 'Ausente' },
            { dente: '31', anotacao: 'Restauração' },
            { dente: '21', anotacao: 'Fratura' },
            { dente: '20', anotacao: 'Implante' },
          ]).map((item, index) => (
            <View key={index} style={styles.dentalRow}>
              <Text>{item.dente}</Text>
              <Text>{item.anotacao}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default DetalhesDoCasoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabButton: {
    flex: 1,
  },
  tabText: {
    fontSize: 14,
    color: '#145da0',
    fontWeight: 'bold',
  },
  editButton: {
    height: 36,
    marginBottom: 12,
    backgroundColor: '#145da0',
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 6,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  mapaContainer: {
    width: '100%',
    height: heightMap,
    overflow: 'hidden',
    borderRadius: 8,
  },
  mapText: {
    marginTop: 8,
    marginLeft: 12,
    fontStyle: 'italic',
    color: '#555',
  },
  dentalNote: {
    marginTop: 8,
  },
  dentalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
