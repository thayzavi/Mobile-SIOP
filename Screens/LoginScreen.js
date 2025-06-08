import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");
    const {colors} = useTheme();

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
                style={styles.input}></TextInput>

                <Text style={styles.label}>Senha</Text>
                <TextInput
                mode="outlined"
                placeholder="insira sua senha"
                value={senha}
                onChangeText={setSenha}
                style={styles.input}></TextInput>

                <Button mode="contained" onPress={() => navigation.navigate('Home')} 
                style={styles.button}> Login </Button>
            </View>
        </View>
    )
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