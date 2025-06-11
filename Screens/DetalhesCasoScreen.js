import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { View, StyleSheet, ScrollView, Image, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Chip, Divider, Portal, IconButton } from 'react-native-paper';
import { casesAPI } from '../services/api';

const corStatus = {
  'Fechado': '#C76565',
  'Em Análise': '#E4A37B',
  'Concluído': '#91AF96',
  'Aberto': '#F7C04A',
};

const DetailModal = ({ visible, onDismiss, data, type, onEdit }) => {
  if (!data) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {type === 'vitima' ? 'Detalhes da Vítima' : 'Detalhes da Evidência'}
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={onDismiss}
              />
            </View>

            <ScrollView style={styles.modalBody}>
              {type === 'vitima' ? (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>NIC:</Text>
                    <Text style={styles.detailValue}>{data.nic}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Nome:</Text>
                    <Text style={styles.detailValue}>{data.nome}</Text>
                  </View>
                  {data.sexo && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Sexo:</Text>
                      <Text style={styles.detailValue}>{data.sexo}</Text>
                    </View>
                  )}
                  {data.corEtnia && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Cor/Etnia:</Text>
                      <Text style={styles.detailValue}>{data.corEtnia}</Text>
                    </View>
                  )}
                  {data.dataNascimento && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Data de Nascimento:</Text>
                      <Text style={styles.detailValue}>
                        {new Date(data.dataNascimento).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  )}
                  {data.endereco && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Endereço:</Text>
                      <Text style={styles.detailValue}>{data.endereco}</Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  {data.imagemURL && (
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: data.imagemURL }}
                        style={styles.evidenceImage}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tipo:</Text>
                    <Text style={styles.detailValue}>{data.tipo}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Categoria:</Text>
                    <Text style={styles.detailValue}>{data.categoria}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Origem:</Text>
                    <Text style={styles.detailValue}>{data.origem}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Condição:</Text>
                    <Text style={styles.detailValue}>{data.condicao}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={styles.detailValue}>{data.status}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Localização:</Text>
                    <Text style={styles.detailValue}>{data.localizacao}</Text>
                  </View>
                  {data.observacoesTecnicas && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Observações Técnicas:</Text>
                      <Text style={styles.detailValue}>{data.observacoesTecnicas}</Text>
                    </View>
                  )}
                  {data.descricaoDetalhada && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Descrição Detalhada:</Text>
                      <Text style={styles.detailValue}>{data.descricaoDetalhada}</Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                mode="contained"
                onPress={() => onEdit(data)}
                style={styles.editButton}
              >
                Editar {type === 'vitima' ? 'Vítima' : 'Evidência'}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default function DetalhesCasoScreen({ route, navigation }) {
  const { casoId } = route.params;
  const [caso, setCaso] = useState(null);
  const [vitimas, setVitimas] = useState([]);
  const [evidencias, setEvidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const fetchCasoData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar dados do caso
        const casoData = await casesAPI.getCaseById(casoId);
        setCaso(casoData);

        // Buscar vítimas
        const vitimasData = await casesAPI.getCaseVictims(casoId);
        setVitimas(vitimasData);

        // Buscar evidências
        const evidenciasData = await casesAPI.getCaseEvidences(casoId);
        setEvidencias(evidenciasData);
      } catch (error) {
        console.error('Erro ao carregar dados do caso:', error);
        setError('Não foi possível carregar os dados do caso');
      } finally {
        setLoading(false);
      }
    };

    fetchCasoData();
  }, [casoId]);

  const handleItemPress = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
    setModalVisible(true);
  };

  const handleEdit = (item) => {
    setModalVisible(false);
    if (selectedType === 'vitima') {
      navigation.navigate('Editar Vítima', { vitimaId: item._id, casoId });
    } else {
      navigation.navigate('Editar Evidência', { evidenciaId: item._id, casoId });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error || !caso) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error || 'Não foi possível carregar os detalhes do caso'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho com imagem e status */}
      <View style={styles.header}>
        <Image
          source={{ uri: caso.caseImageUrl || 'https://via.placeholder.com/400x200' }}
          style={styles.caseImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{caso.titulo}</Text>
          <Chip
            style={[styles.statusChip, { backgroundColor: corStatus[caso.status] || '#ccc' }]}
            textStyle={styles.statusText}
          >
            {caso.status}
          </Chip>
        </View>
      </View>

      {/* Informações principais */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Data de Abertura:</Text>
            <Text style={styles.value}>
              {new Date(caso.dataAbertura).toLocaleDateString('pt-BR')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Localização:</Text>
            <Text style={styles.value}>{caso.localizacao}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Responsável:</Text>
            <Text style={styles.value}>{caso.responsavel.nome}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Instituição:</Text>
            <Text style={styles.value}>{caso.instituicao}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Descrição */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{caso.descricao}</Text>
        </Card.Content>
      </Card>

      {/* Causa da Morte */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Causa da Morte</Text>
          <Text style={styles.description}>{caso.causaMorte}</Text>
        </Card.Content>
      </Card>

      {/* Vítimas */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Vítimas</Text>
          {vitimas.map((vitima, index) => (
            <TouchableOpacity
              key={`vitima-${vitima._id}`}
              onPress={() => handleItemPress(vitima, 'vitima')}
              style={styles.vitimaItem}
            >
              <View style={styles.vitimaHeader}>
                <Text style={styles.vitimaTitle}>Vítima {index + 1}</Text>
                <IconButton
                  icon="chevron-right"
                  size={24}
                  onPress={() => handleItemPress(vitima, 'vitima')}
                />
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>NIC:</Text>
                <Text style={styles.value}>{vitima.nic}</Text>
              </View>
              {vitima.sexo && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Sexo:</Text>
                  <Text style={styles.value}>{vitima.sexo}</Text>
                </View>
              )}
              {vitima.corEtnia && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Cor/Etnia:</Text>
                  <Text style={styles.value}>{vitima.corEtnia}</Text>
                </View>
              )}
              {index < vitimas.length - 1 && <Divider style={styles.divider} />}
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>

      {/* Evidências */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Evidências</Text>
          {evidencias.map((evidencia, index) => (
            <TouchableOpacity
              key={`evidencia-${evidencia._id}`}
              onPress={() => handleItemPress(evidencia, 'evidencia')}
              style={styles.evidenciaItem}
            >
              <View style={styles.evidenciaHeader}>
                <Text style={styles.evidenciaTitle}>Evidência {index + 1}</Text>
                <IconButton
                  icon="chevron-right"
                  size={24}
                  onPress={() => handleItemPress(evidencia, 'evidencia')}
                />
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.value}>{evidencia.tipo}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Categoria:</Text>
                <Text style={styles.value}>{evidencia.categoria}</Text>
              </View>
              {evidencia.imagemURL && (
                <Image
                  source={{ uri: evidencia.imagemURL }}
                  style={styles.evidenceThumbnail}
                />
              )}
              {index < evidencias.length - 1 && <Divider style={styles.divider} />}
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>

      {/* Botões de ação */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Editar Caso', { casoId, caso })}
          style={[styles.button, styles.editButton]}
          icon="pencil"
        >
          Editar Caso
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Nova Vítima', { casoId })}
          style={[styles.button, styles.addButton]}
          icon="account-plus"
        >
          Adicionar Vítima
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Nova Evidência', { casoId })}
          style={[styles.button, styles.addButton]}
          icon="file-plus"
        >
          Adicionar Evidência
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Voltar
        </Button>
      </View>

      <DetailModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        data={selectedItem}
        type={selectedType}
        onEdit={handleEdit}
      />
    </ScrollView>
  );
}
=======
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
>>>>>>> 4ef7ea74283fed7ad9ff0ac1042b64fb8aed286b

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#F2F4F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: 'white',
    paddingBottom: 15,
  },
  caseImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  headerInfo: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
=======
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
>>>>>>> 4ef7ea74283fed7ad9ff0ac1042b64fb8aed286b
    fontWeight: 'bold',
    color: '#145da0',
    flex: 1,
  },
<<<<<<< HEAD
  statusChip: {
    height: 35,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#145da0',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  value: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  vitimaItem: {
    marginBottom: 15,
  },
  vitimaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#145da0',
    marginBottom: 10,
  },
  evidenciaItem: {
    marginBottom: 15,
  },
  evidenciaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#145da0',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#ddd',
  },
  actions: {
    padding: 15,
    marginBottom: 20,
    gap: 10,
  },
  button: {
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#145da0',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#145da0',
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
  },
  imageContainer: {
    marginBottom: 16,
  },
  evidenceImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  evidenceThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 4,
    marginTop: 8,
  },
  vitimaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  evidenciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
=======
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
>>>>>>> 4ef7ea74283fed7ad9ff0ac1042b64fb8aed286b
  },
});
