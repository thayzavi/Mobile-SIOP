import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import LoginScreen from './Screens/LoginScreen';
import CasosScreen from './Screens/CasosScreen';
import DetalhesCasoScreen from './Screens/DetalhesCasoScreen';
import NovoCasoScreen from './Screens/NovoCasoScreen';
import ConfiguracaoScreen from './Screens/ConfiguracaoScreen';
import BancoScreen from './Screens/BancoScreen';
import EvidenciaScreen from './Screens/EvidenciaScreen';
import ListEvidenciaScreen from './Screens/ListEvidenciaScreen';
import LaudoScreen from './Screens/LaudoScreen';
import NovaVitimaScreen from './Screens/NovaVitimaScreen';
import NovaEvidenciaScreen from './Screens/NovaEvidenciaScreen';
import EditarCasoScreen from './Screens/EditarCasoScreen';
import EditarEvidenciaScreen from './Screens/EditarEvidenciaScreen';

// ADM
import GerenciaUserScreen from './Screens/ScreensAdm/GerenciaUserScreen';
import CriarUserScreen from './Screens/ScreensAdm/CriarUserScreen';
import DadosUserScreen from './Screens/ScreensAdm/DadosUserScreen';
import DashboardScreen from './Screens/ScreensAdm/DashboardScreen';
import EditarVitimaScreen from './Screens/EditarVitimaScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CasosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2A5D90' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Casos em andamento" component={CasosScreen} />
      <Stack.Screen name="Novo caso" component={NovoCasoScreen} />
      <Stack.Screen name="Detalhes caso" component={DetalhesCasoScreen} />
      <Stack.Screen name="Nova Vítima" component={NovaVitimaScreen} />
      <Stack.Screen name="Nova Evidência" component={NovaEvidenciaScreen} />
      <Stack.Screen name="Editar Caso" component={EditarCasoScreen} />
      <Stack.Screen name="Editar Vítima" component={EditarVitimaScreen} />
      <Stack.Screen name="Editar Evidência" component={EditarEvidenciaScreen} options={{ title: 'Editar Evidência' }} />
      <Stack.Screen name="Evidencia" component={EvidenciaScreen} />
      <Stack.Screen name="Lista de evidência" component={ListEvidenciaScreen} />
      <Stack.Screen name="Gera laudo" component={LaudoScreen} />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2A5D90' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Gerenciamento de usuários" component={GerenciaUserScreen} />
      <Stack.Screen name="CriarUsuario" component={CriarUserScreen} />
      <Stack.Screen name="Dados usuario" component={DadosUserScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}

function PeritoTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#b5b5b5',
        tabBarStyle: { backgroundColor: '#2A5D90' },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Casos') iconName = 'list';
          else if (route.name === 'Banco') iconName = 'folder';
          else if (route.name === 'Configurações') iconName = 'settings';

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Casos" component={CasosStack} />
      <Tab.Screen name="Banco" component={BancoScreen} />
      <Tab.Screen name="Configurações" component={ConfiguracaoScreen} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#b5b5b5',
        tabBarStyle: { backgroundColor: '#2A5D90' },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Casos') iconName = 'list';
          else if (route.name === 'Banco') iconName = 'folder';
          else if (route.name === 'Admin') iconName = 'admin-panel-settings';
          else if (route.name === 'Dashboard') iconName = 'dashboard';
          else if (route.name === 'Configurações') iconName = 'settings';

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Casos" component={CasosStack} />
      <Tab.Screen name="Banco" component={BancoScreen} />
      <Tab.Screen name="Configurações" component={ConfiguracaoScreen} />
      <Tab.Screen name="Admin" component={AdminStack} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="PeritoTabs"
            component={PeritoTabs}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="AdminTabs"
            component={AdminTabs}
            options={{ gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}