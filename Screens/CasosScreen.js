import React from "react";
import {View , StyleSheet, FlatList, Image, TouchableOpacity} from 'react-native';
import {Text, Button, Card, Chip} from 'react-native-paper';

import avatar from '../assets/img.jpeg'

const casos = [
    {
        id: 1,
        nome: 'Identificação da vítima',
        data: '02/06/2023',
        descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        status: 'Fechado',
    },
    { 
        id: 2,
        nome: 'Identificação da vítima',
        data: '02/06/2023',
        descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        status: 'Concluído',
    },
     { 
        id: 3,
        nome: 'Identificação da vítima',
        data: '02/06/2023',
        descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
        status: 'Em andamento',
    },
     { 
        id: 4,
        nome: 'Identificação da vítima',
        data: '02/06/2023',
        descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
        status: 'Fechado',
    }, 
];

const corStatus = {//definição das cores dos status
    'Fechado': '#C76565',
    'Em andamento': '#E4A37B',
    'Concluído': '#91AF96',
};

export default function CasosScreen({ navigation }){
    const renderItem = ({item}) => (
        <Card style={styles.card}>
            <View style={styles.conteudo}>
                <Image source={avatar} style={styles.image}/>
                {/* flex, deve ocupar todo espaço disponivel */}
                <View style={{ flex: 1}}> 
                    <Text style={styles.nome}>{item.nome}</Text>
                    <Text style={styles.data}>{item.data}</Text>
                    <Text style={styles.descricao}>{item.descricao}</Text>

                <TouchableOpacity
                        mode="contained"
                        onPress={() => navigation.navigate ('Detalhes caso')}
                        style={styles.detalhes}>
                            Ver detalhes
                 </TouchableOpacity>
                </View>
                {/*Chip é um componente visual  usado para exibir uma pequena etiqueta ou rótulo */}
                <Chip style={[styles.chip, {backgroundColor: corStatus[item.status]}]} textStyle={styles.textChip}>
                    {item.status}
                </Chip>
            </View>
        </Card>
    );
    return (
        <View style={styles.container}>
            <Button
                mode="contained"
                onPress={() => navigation.navigate ('Novo caso')}
                    style={styles.add}>
                    + Criar novo caso

            </Button>

                <FlatList
                    data={casos}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.lista}
                />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#F2F4F8',
        paddibgHorizontal: 10,

    },
    add:{
        alignSelf:  'flex-end',
        marginVertical: 15,
        backgroundColor: '#145da0',
        marginEnd: 15,
        marginBottom:10,
        color:'#fff'
    },
    lista:{
        paddingBottom:10,
    },
    card:{
        marginVertical: 6,
        borderRadius: 10,
        width: 377,
        overflow: 'hidden',
        backgroundColor: '#fff',
        left: 7,
    },
    conteudo:{
        flexDirection: 'row',
        padding: 15,
        alignItems:'flex-start',
    },
    image:{
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 12,
    },
    nome:{
        fontSize: 16,
        fontWeight:'bold',
        color: '#00000',
        marginTop: 5,
    },
    data:{
        fontSize: 12,
        color: '#0A4A81',
        fontWeight: "600",
        marginBottom: 10,
    },
    descricao:{
        fontSize:14,
        color: '#00000',
    },
    chip:{
        alignSelf:'flex-start',
        height: 30,
    }, 
    textChip:{
        Color: '#fff'
    },         
    detalhes:{
        fontSize: 15,
        color: '#00000',
        backgroundColor: 'transparent',
        padding:0,
        left: 200,
        fontFamily: 'inter',
    },
});