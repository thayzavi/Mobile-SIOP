import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Divider } from 'react-native-paper';

export default function VitimasScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { casoId } = route.params || {};

  const [vitimas, setVitimas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVitimasDoCaso = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://backend-siop.onrender.com/api/cases/${casoId}`);
        console.log('Resposta da API:', res.data);

        const caso = res.data;

        
        if (caso && caso._id === casoId) {
          setVitimas(caso.vitima || []);
        } else {
          setVitimas([]);
          setError('Caso não encontrado.');
        }
      } catch (err) {
        console.log('Erro ao buscar vítimas do caso:', err.message);
        setError('Erro ao carregar vítimas.');
      } finally {
        setLoading(false);
      }
    };

    fetchVitimasDoCaso();
  }, [casoId]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#145da0" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text>{error}</Text>
        <Button
          onPress={() => {
            setLoading(true);
            setError(null);
            axios.get(`https://backend-siop.onrender.com/api/cases/${casoId}`)
              .then(res => {
                const caso = res.data;
                setVitimas(caso?.vitima || []);
                setLoading(false);
              })
              .catch(() => setError('Erro ao carregar vítimas.'));
          }}
        >
          Tentar Novamente
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalhes do caso:</Text>

      <View style={styles.tabs}>
        <Button
          mode="text"
          onPress={() => navigation.navigate('Detalhes caso', { casoId })}
          style={styles.tabButton}
          labelStyle={styles.tabText}
        >
          1 Informações Básicas
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.navigate('Lista de evidência', { casoId })}
          style={styles.tabButton}
          labelStyle={styles.tabText}
        >
          2 Evidências
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.navigate('Lista de vitima', { casoId })}
          style={styles.tabButton}
          labelStyle={styles.tabText}
        >
          3 Vítimas
        </Button>
      </View>

      <Divider style={{ marginVertical: 12, backgroundColor: '#145da0' }} />

      <Button
        mode="contained"
        style={styles.editButton}
        onPress={() => navigation.navigate('Novo caso', { casoId })}
      >
        Adicionar Vítima
      </Button>

      <Text style={[styles.tituloVisualizar, { fontSize: 16, marginBottom: 8 }]}>
        Visualizar {"\n"}
        <Text style={{ fontWeight: 'bold' }}>Vítimas</Text>
      </Text>

      <FlatList
        data={vitimas}
        keyExtractor={(item) => item._id || item.id?.toString()}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: '#145da0', borderWidth: 1 }]}>
            <View style={[styles.cardContent, { alignItems: 'flex-start' }]}>
              <MaterialCommunityIcons name="account" size={24} color="#CCCCCC" style={{ marginTop: 4 }} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {item.nome || 'Nome não informado'}
                </Text>
                <Text style={{ marginTop: 4 }}>
                  <Text style={{ fontWeight: 'bold' }}>Descrição: </Text>{item.descricao || 'Sem descrição'}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('DetalhesVitima', { vitimaId: item._id })}>
                  <Text style={{ color: '#145da0', marginTop: 8 }}>Ver detalhes </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Excluir', 'Deseja excluir esta vítima?')}>
                <MaterialCommunityIcons name="trash-can" size={24} color="#145da0" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma vítima encontrada.</Text>
        }
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <TouchableOpacity
          style={{ padding: 8 }}
          onPress={() => navigation.navigate('DetalhesCaso', { casoId })}
        >
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    textAlign: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tituloVisualizar: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#145da0',
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
  },
  cardText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
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
});
