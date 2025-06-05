import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Chip } from 'react-native-paper';

const corStatus = {
  'Fechado': '#C76565',
  'Em andamento': '#E4A37B',
  'Concluído': '#91AF96',
  'Aberto': '#F7C04A',
};

export default function CasosScreen({ navigation }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('https://backend-siop.onrender.com/api/cases');
        const data = await response.json();
        console.log('Casos recebidos:', data);
        setCases(data);
      } catch (error) {
        console.error('Erro ao buscar casos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.conteudo}>
        <Image source={{ uri: item.caseImageUrl }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{item.titulo}</Text>
          <Text style={styles.data}>{new Date(item.dataAbertura).toLocaleDateString()}</Text>
          <Text style={styles.descricao}>{item.descricao}</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Detalhes caso', { casoId: item._id })}
            style={styles.detalhes}
          >
            <Text style={{ color: '#145da0' }}>Ver detalhes</Text>
          </TouchableOpacity>
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Carregando...</Text>
        </View>
      ) : (
        <FlatList
          data={cases}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
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
    backgroundColor: '#ccc',
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
    color: '#000',
  },
  chip: {
    alignSelf: 'flex-start',
    height: 30,
    marginLeft: 10,
  },
  textChip: {
    color: '#fff'
  },
  detalhes: {
    marginTop: 8,
  },
});
