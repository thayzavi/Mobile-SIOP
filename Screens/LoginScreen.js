import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button} from 'react-native-paper';
import { authAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLogin = async () => {
        if(!email || !senha) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        setIsLoading(true);

        try {
            const { token, role, id } = await authAPI.login(email, senha);
            
            // Store the authentication data
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userRole', role);
            await AsyncStorage.setItem('userId', id);

            // Navigate based on role
            if (role === 'admin') {
                navigation.replace('AdminTabs');
            } else {
                navigation.replace('PeritoTabs');
            }
        } catch (error) {
            Alert.alert('Erro', error.message || 'Falha na conexão');
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>SIOP</Text>
                <Text style={styles.subtitle}>Acesse o sistema com os dados fornecidos pelo administrador</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.login}>
                    LOGIN
                </Text>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    mode="outlined"
                    placeholder="insira seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput
                    mode="outlined"
                    placeholder="insira sua senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    style={styles.input}
                />

                <Button 
                    mode="contained" 
                    onPress={handleLogin} 
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.button}>
                    {isLoading ? 'Carregando..' : 'Login'}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#2a5d90',
    },
    header:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
        padding: 20,
    },
    logo:{
        fontSize: 40,
        color: 'white',
        fontWeight:'bold',
        marginBottom: 10,
    },
    subtitle:{
        color:'white',
        fontSize: 15,
        textAlign: 'center',
    },
    form:{
        flex: 2,
        backgroundColor:'white',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        padding: 20,
        justifyContent: 'center',
    },
    login: {
        fontSize: 20,
        color:'#2a5d90',
        fontWeight:'bold',
        marginBottom:20,
    },
    label:{
        fontSize:14,
        color:'#2a5d90',
        marginBottom:5,
    },
    input:{
        marginBottom:15,
        backgroundColor: 'white',
    },
    button:{
        marginTop: 10,
        backgroundColor: '#2A5D90',
        color: '#fff'
    },
});