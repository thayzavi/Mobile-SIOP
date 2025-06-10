import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DataHoraPicker = ({ 
  mode = 'datetime', // 'date', 'time' ou 'datetime'
  onDateChange,
  onTimeChange,
  containerStyle,
  buttonStyle,
  textStyle,
  initialDate = new Date()
}) => {
  const [date, setDate] = useState(initialDate);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState(mode);

  const onChange = (event, selectedValue) => {
    setShowPicker(Platform.OS === 'ios'); // No iOS mantém aberto
    
    if (selectedValue) {
      const currentDate = selectedValue || date;
      setDate(currentDate);

      if (pickerMode === 'date' && onDateChange) {
        onDateChange(currentDate);
      } else if (pickerMode === 'time' && onTimeChange) {
        onTimeChange(currentDate);
      } else if (mode === 'datetime') {
        if (pickerMode === 'date') {
          setPickerMode('time');
          setShowPicker(true);
        } else {
          if (onDateChange) onDateChange(currentDate);
          if (onTimeChange) onTimeChange(currentDate);
        }
      }
    }
  };

  const showMode = (currentMode) => {
    setPickerMode(currentMode);
    setShowPicker(true);
  };

  const showDatepicker = () => showMode('date');
  const showTimepicker = () => showMode('time');

  const formatDate = () => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = () => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {mode.includes('date') && (
        <TouchableOpacity onPress={showDatepicker} style={[styles.button, buttonStyle]}>
          <Text style={[styles.text, textStyle]}>Data: {formatDate()}</Text>
        </TouchableOpacity>
      )}

      {mode.includes('time') && (
        <TouchableOpacity onPress={showTimepicker} style={[styles.button, buttonStyle]}>
          <Text style={[styles.text, textStyle]}>Hora: {formatTime()}</Text>
        </TouchableOpacity>
      )}

      {showPicker && (
        <DateTimePicker
          value={date}
          mode={pickerMode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          locale="pt-BR"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
  },
});

export default DataHoraPicker;