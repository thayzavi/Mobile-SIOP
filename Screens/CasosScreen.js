import React, { useEffect, useState } from "react";
import { Alert, View, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Button, Card, Chip } from 'react-native-paper';
import { casesAPI } from '../services/api';

const corStatus = {
  'Fechado': '#C76565',
  'Em andamento': '#E4A37B',
  'Concluído': '#91AF96',
  'Aberto': '#F7C04A',
};

export default function CasosScreen({ navigation }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCases = async () => {
    try {
      const data = await casesAPI.getCases();
      setCases(data);
    } catch (error) {
      console.error('Erro ao buscar casos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os casos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCases();
  };

  const handleDelete = async (id) => {
    try {
      await casesAPI.deleteCase(id);
      setCases((prevCases) => prevCases.filter((caso) => caso._id !== id));
      Alert.alert('Sucesso', 'Caso excluído com sucesso');
    } catch (error) {
      console.error('Erro ao deletar caso:', error);
      Alert.alert('Erro', 'Não foi possível excluir o caso');
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este caso?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => handleDelete(id), style: "destructive" }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.conteudo}>
        <Image 
          source={{ uri: item.caseImageUrl || 'https://via.placeholder.com/60' }} 
          style={styles.image} 
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{item.titulo}</Text>
          <Text style={styles.data}>
            {new Date(item.dataAbertura).toLocaleDateString('pt-BR')}
          </Text>
          <Text style={styles.descricao} numberOfLines={2}>
            {item.descricao}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Detalhes caso', { casoId: item._id })}
              style={styles.detalhes}
            >
              <Text style={styles.btnDetalhes}>Ver detalhes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => confirmDelete(item._id)}
              style={styles.deletar}
            >
              <Text style={styles.btnDeletar}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Chip
          style={[styles.chip, { backgroundColor: corStatus[item.status] || '#ccc' }]}
          textStyle={styles.textChip}
        >
          {item.status}
        </Chip>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Novo caso')}
        style={styles.add}
      >
        + Criar novo caso
      </Button>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Carregando...</Text>
        </View>
      ) : (
        <FlatList
          data={cases}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#145da0']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum caso encontrado</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F8',
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  add: {
    alignSelf: 'flex-end',
    marginVertical: 15,
    backgroundColor: '#145da0',
    marginEnd: 15,
  },
  lista: {
    paddingBottom: 10,
  },
  card: {
    marginVertical: 6,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  conteudo: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'flex-start',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  data: {
    fontSize: 12,
    color: '#0A4A81',
    fontWeight: "600",
    marginBottom: 10,
  },
  descricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detalhes: {
    flex: 1,
  },
  deletar: {
    marginLeft: 10,
  },
  btnDetalhes: {
    color: '#145da0',
    fontWeight: '500',
  },
  btnDeletar: {
    color: '#C0392B',
    fontWeight: '500',
  },
  chip: {
    alignSelf: 'flex-start',
    height: 35,
    marginLeft: 10,
  },
  textChip: {
    color: '#fff',
    fontSize: 12,
  },
});
