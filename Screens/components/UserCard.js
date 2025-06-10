import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserCard = ({ id, name, cro, role, onDelete, onDetails }) => {
  
  return (
    <View style={styles.card}>
      <Image source={require('../../assets/img.jpeg')} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>Nome: {name}</Text>
        <Text style={styles.cro}>CRO-SP: {cro}</Text>
        <TouchableOpacity style={styles.badge}>
          <Ionicons name="person" size={16} color="#fff" />
          <Text style={styles.badgeText}>{role}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onDetails}>
          <Text style={styles.link}>Ver dados</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-bin-outline" size={20} color="#777" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: { flex: 1 },
  name: { 
    fontWeight: 'bold',
    fontSize: 16 
  },
  cro: { 
    color: '#555',
    marginBottom: 4
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a4c85',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    width: '23%',
  },
  badgeText: {
    color: '#fff', 
    marginLeft: 5
  },
  actions: {
    justifyContent: 'space-between',
    height: 70,
    alignItems: 'flex-end',
  },
  link: {
    color: '#0a4c85',
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default UserCard;