import axios from 'axios';

const API_URL = 'https://backend-siop.onrender.com/api';

export const dashboardAPI = {
  getCaseStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/estatisticas-casos`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar estatísticas dos casos');
    }
  },

  getChartData: async (groupBy, filters) => {
    try {
      const response = await axios.post(`${API_URL}/dashboard/filtrar-casos-dinamico`, {
        groupBy,
        filters,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar dados para os gráficos');
    }
  },

  getAverageAge: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/media-idade`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar média de idade das vítimas');
    }
  },
};
