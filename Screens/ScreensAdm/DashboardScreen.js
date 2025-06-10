import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,ScrollView,ActivityIndicator,Button,Dimensions,Alert,} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { dashboardAPI } from '../../services/api'; 

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const [groupBy, setGroupBy] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [caseStats, setCaseStats] = useState({
    currentMonth: 0,
    previousMonth: 0,
    growth: 0
  });
  const [averageAge, setAverageAge] = useState(0);

  const groupOptions = [
    { value: 'vitima.sexo', label: 'Sexo da Vítima' },
    { value: 'vitima.corEtnia', label: 'Cor/Etnia da Vítima' },
    { value: 'status', label: 'Status do Caso' },
    { value: 'causaMorte', label: 'Causa da Morte' },
    { value: 'instituicao', label: 'Instituição Responsável' },
    { value: 'evidencias.condicao', label: 'Condições das Evidências' },
    { value: 'evidencias.categoria', label: 'Categoria das Evidências' },
    { value: 'evidencias.tipo', label: 'Tipo de Evidência' },
    { value: 'evidencias.status', label: 'Status das Evidências' },
    { value: 'evidencias.localizacao', label: 'Localização das Evidências' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const stats = await dashboardAPI.getCaseStats();
        setCaseStats(stats);

        const age = await dashboardAPI.getAverageAge();
        setAverageAge(Math.round(age.averageAge));
      } catch (error) {
        Alert.alert('Erro', 'Erro ao buscar dados do dashboard.');
      }
    };

    loadData();
  }, []);

  const handleGenerateChart = async () => {
    if (!groupBy) {
      Alert.alert('Atenção', 'Selecione um campo para agrupar.');
      return;
    }

    setLoading(true);
    try { // CORES DO GRÁFICO PIZZA
      const resultado = await dashboardAPI.getChartData(groupBy, {});
      const colors = [
        '#08226C',
        '#113D80',
        '#1D5C94',
        '#2C7EA8',
        '#3DA2BB',
        '#50C7CF',
      ];

      const pieData = resultado.map((item, index) => ({
        name: item.categoria || 'Não informado',
        population: item.quantidade,
        color: colors[index % colors.length],
        legendFontColor: '#08226C',
        legendFontSize: 14
      }));

      const barData = {
        labels: resultado.map((r) => r.categoria),
        datasets: [{ data: resultado.map((r) => r.quantidade) }]
      };

      setChartData({ pieData, barData });
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar dados para os gráficos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text>Total de Registros: {caseStats.currentMonth + caseStats.previousMonth}</Text>
        <Text>Média de Idade das Vítimas: {averageAge} anos</Text>
        <Text style={{ color: caseStats.growth >= 0 ? 'green' : 'red' }}>
          Crescimento: {caseStats.growth >= 0 ? '+' : ''}
          {caseStats.growth.toFixed(1)}%
        </Text>
      </View>

      <Picker
        selectedValue={groupBy}
        style={styles.picker}
        onValueChange={(itemValue) => setGroupBy(itemValue)}
      >
        <Picker.Item label="Selecione o agrupamento..." value="" />
        {groupOptions.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>

      <View style={styles.button}>
        <Button title="Gerar Gráfico" onPress={handleGenerateChart} />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {chartData && (
        <>
          <Text style={styles.chartTitle}>Gráfico de Pizza</Text>
          <PieChart
            data={chartData.pieData}
            width={screenWidth - 40}
            height={220}
            accessor="population"
            backgroundColor='#fff'
            paddingLeft="15"
            absolute
            chartConfig={chartConfig}
          />

          <Text style={styles.chartTitle}>Gráfico de Barras</Text>
          <BarChart
            data={chartData.barData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
          />
        </>
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(10, 74, 129, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.9,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F2F4F8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0A4A81',
  },
  picker: {
    height: 60,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#2A5D90',
    marginRight: 'auto',
    marginLeft: '80%',
  }
});

export default Dashboard;
