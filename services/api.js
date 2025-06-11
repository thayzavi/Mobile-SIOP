import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://backend-siop.onrender.com/api';

// Criar uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userRole');
    }
    return Promise.reject(error);
  }
);

export const dashboardAPI = {
  getCaseStats: async () => {
    try {
      const response = await api.get('/dashboard/estatisticas-casos');
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar estatísticas dos casos');
    }
  },

  getChartData: async (groupBy, filters) => {
    try {
      const response = await api.post('/dashboard/filtrar-casos-dinamico', {
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
      const response = await api.get('/dashboard/media-idade');
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar média de idade das vítimas');
    }
  },
};

export const authAPI = {
  login: async (email, senha) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        senha,
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao fazer login');
    }
  },
};

export const casesAPI = {
  createCase: async (caseData) => {
    try {
      console.log('Enviando dados do caso:', caseData);
      const response = await api.post('/cases', caseData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar caso:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        requestData: caseData
      });
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao criar caso');
    }
  },

  getCases: async () => {
    try {
      const response = await api.get('/cases');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar casos:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error('Erro ao buscar casos');
    }
  },

  getCaseById: async (id) => {
    try {
      const response = await api.get(`/cases/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do caso:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        caseId: id
      });
      throw new Error('Erro ao buscar detalhes do caso');
    }
  },

  getCaseVictims: async (id) => {
    try {
      const response = await api.get(`/cases/${id}/victims`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vítimas do caso:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        caseId: id
      });
      throw new Error('Erro ao buscar vítimas do caso');
    }
  },

  getCaseEvidences: async (id) => {
    try {
      const response = await api.get(`/cases/${id}/evidences`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar evidências do caso:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        caseId: id
      });
      throw new Error('Erro ao buscar evidências do caso');
    }
  },

  createVictim: async (caseId, victimData) => {
    try {
      const response = await api.post(`/victims/cases/${caseId}`, victimData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar vítima:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        caseId,
        victimData
      });
      if (error.response?.status === 409) {
        throw new Error('Já existe uma vítima com este NIC');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao criar vítima');
    }
  },

  createEvidence: async (caseId, evidenceData) => {
    try {
      const response = await api.post(`/cases/${caseId}`, evidenceData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar evidência:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        caseId,
        evidenceData
      });
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao criar evidência');
    }
  },

  uploadEvidenceImage: async (caseId, imageData, evidenceData) => {
    try {
      const formData = new FormData();
      
      // Adiciona a imagem ao FormData com o nome 'file' que o backend espera
      formData.append('file', {
        uri: imageData.uri,
        type: imageData.type || 'image/jpeg',
        name: imageData.fileName || 'image.jpg'
      });

      // Adiciona cada campo da evidência separadamente ao FormData
      Object.keys(evidenceData).forEach(key => {
        formData.append(key, evidenceData[key]);
      });

      const response = await api.post(`evidences/cases/${caseId}/upload`, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
          return data; // Não transforma o FormData
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da evidência:', {
        caseId,
        data: error.response?.data,
        evidenceData,
        message: error.message,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Erro ao fazer upload da evidência');
    }
  },
  

  deleteCase: async (id) => {
    try {
      await api.delete(`/cases/${id}`);
    } catch (error) {
      console.error('Erro ao excluir caso:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        caseId: id
      });
      throw new Error('Erro ao excluir caso');
    }
  },

  updateCase: async (caseId, caseData) => {
    try {
      const response = await api.put(`/cases/${caseId}`, caseData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar caso:', {
        caseId,
        data: error.response?.data,
        message: error.message,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Erro ao atualizar caso');
    }
  },

  uploadCasePhoto: async (caseId, imageData) => {
    try {
      const formData = new FormData();
      
      // Adiciona a imagem ao FormData com o nome 'file' que o backend espera
      formData.append('file', {
        uri: imageData.uri,
        type: imageData.type || 'image/jpeg',
        name: imageData.fileName || 'image.jpg'
      });

      const response = await api.post(`/cases/${caseId}/casephoto`, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
          return data; // Não transforma o FormData
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da foto do caso:', {
        caseId,
        data: error.response?.data,
        message: error.message,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Erro ao fazer upload da foto');
    }
  },

  getEvidenceById: async (id) => {
    try {
      const response = await api.get(`/evidences/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar evidência:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        evidenceId: id
      });
      if (error.response?.status === 404) {
        throw new Error('Evidência não encontrada');
      }
      throw new Error('Erro ao buscar evidência');
    }
  },

  getVictimById: async (id) => {
    try {
      const response = await api.get(`/victims/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vítima:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        victimId: id
      });
      if (error.response?.status === 404) {
        throw new Error('Vítima não encontrada');
      }
      throw new Error('Erro ao buscar vítima');
    }
  },

  updateEvidence: async (id, evidenceData) => {
    try {
      // Validar campos obrigatórios
      const requiredFields = ['tipo', 'categoria', 'origem', 'condicao', 'status', 'localizacao', 'vitima'];
      const missingFields = requiredFields.filter(field => !evidenceData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
      }

      // Validar enumerações
      const validTypes = ['Imagem', 'Texto'];
      const validConditions = ['Bem conservada', 'Danificada', 'Parcial'];
      const validStatuses = ['Aberto', 'Em Análise', 'Fechado'];

      if (!validTypes.includes(evidenceData.tipo)) {
        throw new Error('Tipo inválido. Deve ser "Imagem" ou "Texto"');
      }

      if (!validConditions.includes(evidenceData.condicao)) {
        throw new Error('Condição inválida. Deve ser "Bem conservada", "Danificada" ou "Parcial"');
      }

      if (!validStatuses.includes(evidenceData.status)) {
        throw new Error('Status inválido. Deve ser "Aberto", "Em Análise" ou "Fechado"');
      }

      // Se for uma evidência do tipo imagem, precisamos garantir que os campos específicos de imagem estejam presentes
      if (evidenceData.tipo === 'Imagem') {
        if (!evidenceData.imagemURL) {
          throw new Error('URL da imagem é obrigatória para evidências do tipo Imagem');
        }
        if (!evidenceData.publicId) {
          throw new Error('PublicId é obrigatório para evidências do tipo Imagem');
        }
      }

      // Buscar o ID do usuário atual do AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      // Adicionar o coletadoPor ao evidenceData
      const updatedEvidenceData = {
        ...evidenceData,
        coletadoPor: userId
      };

      const response = await api.put(`/evidences/${id}`, updatedEvidenceData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar evidência:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        evidenceId: id,
        evidenceData
      });

      if (error.response?.status === 404) {
        throw new Error('Evidência não encontrada');
      }

      if (error.response?.status === 400) {
        // Se houver erros específicos do backend, mostre-os
        if (error.response.data.errors) {
          const errorMessages = error.response.data.errors.map(err => err.message || err.msg).join(', ');
          throw new Error(`Erros de validação: ${errorMessages}`);
        }
        // Se houver uma mensagem de erro específica
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        }
        // Se não houver mensagem específica, mostre os dados do erro
        throw new Error(`Dados inválidos: ${JSON.stringify(error.response.data)}`);
      }

      throw error;
    }
  },

  updateVictim: async (id, victimData) => {
    try {
      const response = await api.put(`/victims/${id}`, victimData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar vítima:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        victimId: id,
        victimData
      });
      if (error.response?.status === 404) {
        throw new Error('Vítima não encontrada');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao atualizar vítima');
    }
  },
};
