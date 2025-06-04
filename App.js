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
// routes ADM
import GerenciaUserScreen from './Screens/ScreensAdm/GerenciaUserScreen';
import CriarUserScreen from './Screens/ScreensAdm/CriarUserScreen';
import DadosUserScreen from './Screens/ScreensAdm/DadosUserScreen';
import DashboardScreen from './Screens/ScreensAdm/DashboardScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CasosStack(){
  return(
    <Stack.Navigator 
      screenOptions={{//style topo de pagina com nome na page
        headerStyle: {backgroundColor: '#2A5D90'},
        headerTintColor: '#fff',
        headerTitleStyle: {fontWeight: 'bold'},
      }}
      >
      {/* Routes Perito */}
      <Stack.Screen name="Casos em andamento" component={CasosScreen}/>
      <Stack.Screen name="Novo caso" component={NovoCasoScreen}/>
      <Stack.Screen name="Detalhes caso" component={DetalhesCasoScreen}/>
      <Stack.Screen name="Evidencia" component={EvidenciaScreen}/>
      <Stack.Screen name="Lista de evidência" component={ListEvidenciaScreen}/>
      <Stack.Screen name="Gera laudo" component={LaudoScreen}/>
      {/* Routes ADM */}
      <Stack.Screen name="Criar usuario" component={CriarUserScreen}/>
      <Stack.Screen name="Gerenciamento de usuario" component={GerenciaUserScreen}/>
      <Stack.Screen name="Dados usuario" component={DadosUserScreen}/>
      <Stack.Screen name="Dashboard" component={DashboardScreen}/>
    </Stack.Navigator>
  );
}

function MainTabs(){
  return(
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false, //style tabs
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#b5b5b5',
        tabBarStyle: {
          backgroundColor: '#2A5D90',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          
          if(route.name === 'Casos') iconName = 'list';
          else if (route.name === 'Banco') iconName = 'folder'; //função define qual ícone será exibido em cada aba, com base na rota (nome da tela).
          else if (route.name === 'Configuração') iconName = 'settings';

          return <MaterialIcons name={iconName} size={size} color={color}/> ;
        },
      })}
    >
      {/* Aqui a chamada das rotas que ficam no tab */}
      <Tab.Screen name="Home" component={CasosStack}/>
      <Tab.Screen name="Banco" component={BancoScreen}/> 
      <Tab.Screen name="Configurações" component={ConfiguracaoScreen}/>

    </Tab.Navigator>
    
  );
}

export default function App(){
  return(
    <PaperProvider>
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Home" component={MainTabs}/>
          </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

