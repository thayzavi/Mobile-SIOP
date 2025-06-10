import React, { useState, useEffect } from 'react';
import { Alert, View, StyleSheet, TextInput, Text } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const LocalizacaoMapa = ({ onLocationUpdate, mapStyle }) => {
  const [endereco, setEndereco] = useState('');//pega a localização atual e preenche o campo automaticamente 
  const [enderecoEditavel, setEnderecoEditavel] = useState('');
  const [region, setRegion] = useState({
    latitude: -23.5505, // Coordenadas padrão (ex: São Paulo)
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function obterLocalizacao() {
    try {
      setCarregando(true);
      setErrorMsg(null);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar localização foi negada.');
        setCarregando(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);

      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const place = geocode[0];
        const enderecoCompleto = `${place.formattedAddress}`;
        setEndereco(enderecoCompleto);
        setEnderecoEditavel(enderecoCompleto);
        
        onLocationUpdate?.({
          coordenadas: { latitude, longitude },
          endereco: enderecoCompleto,
          regiao: newRegion
        });
      }
    } catch (error) {
      setErrorMsg('Erro ao obter localização: ' + error.message);
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  async function buscarEnderecoPorTexto() {//formata o texto e converte para o endereço. exemplo: 50110005 retorna ao nome completo da rua
    try {
      setCarregando(true);
      setErrorMsg(null);
    
      const geocode = await Location.geocodeAsync(enderecoEditavel);
      if (geocode.length > 0) {
        const { latitude, longitude } = geocode[0];
        
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setRegion(newRegion);
        
        // Atualiza o endereço formatado
        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          const enderecoFormatado = `${place.formattedAddress}`;
          setEndereco(enderecoFormatado);
          setEnderecoEditavel(enderecoFormatado);
          
          onLocationUpdate?.({
            coordenadas: { latitude, longitude },
            endereco: enderecoFormatado,
            regiao: newRegion
          });
        }
      } else {
        setErrorMsg('Endereço não encontrado');
      }
    } catch (error) {
      setErrorMsg('Erro ao buscar endereço: ' + error.message);
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    obterLocalizacao();
  }, []);

  return (
    <View style={[styles.container, mapStyle]}>
      {/* Campo de endereço editável */}
      <View style={styles.enderecoContainer}>
        <Text style={styles.label}>Localização</Text>
        <TextInput
          style={styles.input}
          value={enderecoEditavel}
          onChangeText={setEnderecoEditavel}
          placeholder="Digite o endereço ou toque no mapa"
          onSubmitEditing={buscarEnderecoPorTexto}
          editable={!carregando}
        />
        {carregando && <Text style={styles.carregando}>Carregando...</Text>}
      </View>

      {errorMsg ? (
        <Text style={styles.erro}>{errorMsg}</Text>
      ) : (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          onPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setRegion({
              ...region,
              latitude,
              longitude,
            });
            // Busca o endereço para a nova localização
            Location.reverseGeocodeAsync({ latitude, longitude })
              .then(geocode => {
                if (geocode.length > 0) {
                  const place = geocode[0];
                  const enderecoCompleto = `${place.street || ''}, ${place.city || ''}, ${place.region || ''}, ${place.country || ''}`.replace(/,\s*,/g, ',').trim();
                  setEndereco(enderecoCompleto);
                  setEnderecoEditavel(enderecoCompleto);
                  onLocationUpdate?.({
                    coordenadas: { latitude, longitude },
                    endereco: enderecoCompleto,
                    regiao: { ...region, latitude, longitude }
                  });
                }
              })
              .catch(console.error);
          }}
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="Local selecionado"
            description={endereco}
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  enderecoContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  erro: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  carregando: {
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default LocalizacaoMapa;