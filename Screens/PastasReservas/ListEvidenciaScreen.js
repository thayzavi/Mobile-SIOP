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
import { Button } from 'react-native-paper';
import { Divider } from 'react-native-paper';

export default function EvidenciasScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { casoId } = route.params || {};

  const [evidencias, setEvidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const fetchEvidenciasDoCaso = async () => {
    try {
      setLoading(true);

      // Buscar o caso específico
      const casoRes = await axios.get(`https://backend-siop.onrender.com/api/cases/${casoId}`);

      // Acessar diretamente as evidências
      const evidenciasDoCaso = casoRes.data.evidencias || [];

      setEvidencias(evidenciasDoCaso);
      setError(null);
    } catch (err) {
      console.log('Erro ao buscar evidências do caso:', err);
      setError('Erro ao carregar evidências.');
    } finally {
      setLoading(false);
    }
  };

  fetchEvidenciasDoCaso();
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
            axios.get('https://backend-siop.onrender.com/api/evidences/')
              .then(res => {
                setEvidencias(res.data);
                setLoading(false);
              })
              .catch(() => setError('Erro ao carregar evidências.'));
          }}
        >
          Tentar Novamente
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Detalhes do caso:
      </Text>

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
          3 Vitímas
        </Button>
      </View>


      <Divider style={{ marginVertical: 12, backgroundColor: '#145da0' }} />

      <Button
        mode="contained"
        style={styles.editButton}
        onPress={() => navigation.navigate('Evidencia', { casoId })}
      >
        Adicionar Evidência
      </Button>

      <Text style={[styles.tituloVisualizar, { fontSize: 16, marginBottom: 8 }]}>
        Visualizar {"\n"}
        <Text style={{ fontWeight: 'bold' }}>Evidências</Text>
      </Text>

    {evidencias.length > 0 && (
  <View style={[styles.card, { borderColor: '#145da0', borderWidth: 1 }]}>
    <View style={[styles.cardContent, { alignItems: 'flex-start' }]}>
      <MaterialCommunityIcons name="download" size={24} color="#CCCCCC" style={{ marginTop: 4 }} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {(evidencias[0].tipo && evidencias[0].tipo !== 'Texto') ? evidencias[0].tipo : 'Documento'}
        </Text>
        <Text style={{ marginTop: 4 }}>
          <Text style={{ fontWeight: 'bold' }}>Descrição: </Text>{evidencias[0].descricao || 'Sem descrição'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('DetalhesEvidencia', { evidenciaId: evidencias[0]._id })}>
          <Text style={{ color: '#145da0', marginTop: 8 }}>Ver detalhes</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => Alert.alert('Excluir', 'Deseja excluir esta evidência?')}>
        <MaterialCommunityIcons name="trash-can" size={24} color="#145da0" />
      </TouchableOpacity>
    </View>
  </View>
)}


      <FlatList
        data={evidencias}
        keyExtractor={(item) => item._id || item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <MaterialCommunityIcons name="download" size={24} color="#CCCCCC" />
              <Text style={styles.cardText}>
                <Text style={{ fontWeight: 'bold' }}>
                  {(item.tipo && item.tipo !== 'Texto') ? item.tipo : 'Documento'}:{' '}
                </Text>
                {item.descricao || 'Vitíma Presumida'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Download', `Baixar evidência: ${item.descricao}`);

                }}
              >

              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma evidência encontrada.</Text>
        }
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <TouchableOpacity
          style={{ padding: 8 }}
          onPress={() => navigation.navigate('DetalhesCaso', { casoId })}
        >
        </TouchableOpacity>

        <TouchableOpacity
          style={{ padding: 8 }}
          onPress={() => navigation.navigate('Vitimas', { casoId })}
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
    marginBootom: 8,
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
