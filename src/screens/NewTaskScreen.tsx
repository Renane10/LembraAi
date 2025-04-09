import { useState } from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { ThemedText } from '../components/ThemedText'
import { ThemedView } from '../components/ThemedView'
import { useRouter, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import { v4 as uuidv4 } from 'uuid'
import { Task } from '../types/Task'
import { IconSymbol } from '../components/ui/IconSymbol'
import { useColorScheme } from '../hooks/useColorScheme'
import { Colors } from '../../constants/Colors'
import { styles } from '../assets/styles/NewTaskScreen.styles'

export default function NewTaskScreen() {
  const router = useRouter()
  const colorScheme = useColorScheme() ?? 'light'
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskAddress, setNewTaskAddress] = useState('')
  const [newTaskDate, setNewTaskDate] = useState(new Date())
  const [newTaskRepeat, setNewTaskRepeat] = useState<Task['repeat']>('none')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [selectedRepeatCount, setSelectedRepeatCount] = useState('')
  const [selectedReminderBefore, setSelectedReminderBefore] = useState('')
  const [selectedReminderAfter, setSelectedReminderAfter] = useState('')
  const [defaultReminderBefore, setDefaultReminderBefore] = useState('30')
  const [defaultReminderAfter, setDefaultReminderAfter] = useState('30')
  const [repeatCount, setRepeatCount] = useState('5')

  const REPEAT_COUNT_KEY = '@repeat_count_preference'
  const REMINDER_BEFORE_KEY = '@reminder_before_preference'
  const REMINDER_AFTER_KEY = '@reminder_after_preference'

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)

    if (event.type === 'set' && selectedDate) {
      const currentTime = newTaskDate
      selectedDate.setHours(currentTime.getHours())
      selectedDate.setMinutes(currentTime.getMinutes())
      setNewTaskDate(selectedDate)
    }
  }

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false)

    if (event.type === 'set' && selectedTime) {
      setNewTaskDate(selectedTime)
    }
  }
  const addTask = async (): Promise<void> => {
    if (!newTaskTitle.trim()) return

    try {
      const newTasks: Task[] = []
      const baseTask: Task = {
        id: uuidv4(),
        title: newTaskTitle,
        description: newTaskDescription || undefined,
        address: newTaskAddress || undefined,
        dueDate: newTaskDate,
        repeat: newTaskRepeat,
        completed: false,
        reminderBefore: selectedReminderBefore ? parseInt(selectedReminderBefore) : parseInt(defaultReminderBefore),
        reminderAfter: selectedReminderAfter ? parseInt(selectedReminderAfter) : parseInt(defaultReminderAfter)
      }

      newTasks.push(baseTask)

      if (newTaskRepeat !== 'none') {
        const count = selectedRepeatCount ? parseInt(selectedRepeatCount) : parseInt(repeatCount)
        for (let i = 1; i < count; i++) {
          const repeatedTask = {
            ...baseTask,
            id: uuidv4(),
            dueDate: new Date(newTaskDate)
          }

          switch (newTaskRepeat) {
            case 'daily':
              repeatedTask.dueDate.setDate(newTaskDate.getDate() + i)
              break
            case 'weekly':
              repeatedTask.dueDate.setDate(newTaskDate.getDate() + (i * 7))
              break
            case 'monthly':
              repeatedTask.dueDate.setMonth(newTaskDate.getMonth() + i)
              break
          }

          newTasks.push(repeatedTask)
        }
      }

      // Carregar tarefas existentes
      const savedTasksStr = await AsyncStorage.getItem('@tasks')
      const savedTasks = savedTasksStr ? JSON.parse(savedTasksStr) : []

      // Combinar tarefas existentes com novas tarefas
      const updatedTasks = [...savedTasks, ...newTasks]

      // Salvar todas as tarefas no AsyncStorage
      await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks))

      // Voltar para a tela anterior após adicionar a tarefa
      router.back()
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            name="chevron.left"
            size={24}
            color={Colors[colorScheme].icon}
          />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Nova Tarefa</ThemedText>
      </ThemedView>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Título da tarefa"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descrição (opcional)"
          value={newTaskDescription}
          onChangeText={setNewTaskDescription}
          multiline
          numberOfLines={3}
        />
        <TextInput
          style={styles.input}
          placeholder="Endereço (opcional)"
          value={newTaskAddress}
          onChangeText={setNewTaskAddress}
        />

        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setShowDatePicker(true)}
        >
          <ThemedText>{newTaskDate.toLocaleDateString('pt-BR')} {newTaskDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setShowTimePicker(true)}
        >
          <ThemedText>Horário: {newTaskDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</ThemedText>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={newTaskDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={newTaskDate}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <View style={styles.pickerContainer}>
          <ThemedText style={styles.pickerLabel}>Repetição</ThemedText>
          <Picker
            selectedValue={newTaskRepeat}
            style={styles.picker}
            onValueChange={(itemValue) => setNewTaskRepeat(itemValue)}
          >
            <Picker.Item label="Não repetir" value="none" />
            <Picker.Item label="Diariamente" value="daily" />
            <Picker.Item label="Semanalmente" value="weekly" />
            <Picker.Item label="Mensalmente" value="monthly" />
          </Picker>
        </View>

        {newTaskRepeat !== 'none' && (
          <View style={styles.pickerContainer}>
            <ThemedText style={styles.pickerLabel}>Quantidade de repetições</ThemedText>
            <Picker
              selectedValue={selectedRepeatCount}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedRepeatCount(itemValue)}
            >
              <Picker.Item label="Usar valor padrão" value="" />
              <Picker.Item label="5 vezes" value="5" />
              <Picker.Item label="7 vezes" value="7" />
              <Picker.Item label="10 vezes" value="10" />
              <Picker.Item label="15 vezes" value="15" />
              <Picker.Item label="30 vezes" value="30" />
            </Picker>
          </View>
        )}

        <View style={styles.pickerContainer}>
          <ThemedText style={styles.pickerLabel}>Lembrete antes do prazo (minutos)</ThemedText>
          <Picker
            selectedValue={selectedReminderBefore}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedReminderBefore(itemValue)}
          >
            <Picker.Item label="Usar valor padrão" value="" />
            <Picker.Item label="15 minutos" value="15" />
            <Picker.Item label="30 minutos" value="30" />
            <Picker.Item label="60 minutos" value="60" />
            <Picker.Item label="120 minutos" value="120" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <ThemedText style={styles.pickerLabel}>Lembrete após o prazo (minutos)</ThemedText>
          <Picker
            selectedValue={selectedReminderAfter}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedReminderAfter(itemValue)}
          >
            <Picker.Item label="Usar valor padrão" value="" />
            <Picker.Item label="15 minutos" value="15" />
            <Picker.Item label="30 minutos" value="30" />
            <Picker.Item label="60 minutos" value="60" />
            <Picker.Item label="120 minutos" value="120" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <ThemedText style={styles.addButtonText}>Adicionar Tarefa</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}