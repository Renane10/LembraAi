import { useState, useEffect } from 'react'
import 'react-native-get-random-values'
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import TaskList from '../components/TaskList'
import { Task } from '../types/Task'
import { IconSymbol } from '../components/ui/IconSymbol'
import { useColorScheme } from '../hooks/useColorScheme'
import { Colors } from '../../constants/Colors'
import { v4 as uuidv4 } from 'uuid'

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const [tasks, setTasks] = useState<Task[]>([])
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [showCompletedTasksModal, setShowCompletedTasksModal] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskAddress, setNewTaskAddress] = useState('')
  const [newTaskDate, setNewTaskDate] = useState(new Date())
  const [newTaskRepeat, setNewTaskRepeat] = useState<Task['repeat']>('none')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const today = new Date()
  const atrasadas = tasks.filter(
    (task) => !task.completed && task.dueDate < today && !isToday(task.dueDate)
  )
  const proximas = tasks.filter(
    (task) => !task.completed && task.dueDate > today && !isToday(task.dueDate)
  )
  const dodia = tasks.filter((task) => !task.completed && isToday(task.dueDate))
  const concluidas = tasks.filter((task) => task.completed)

  const completeTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: true, completedDate: new Date() }
          : task
      )
    )
  }
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
  
    if (event.type === 'set' && selectedDate) {
      // Mantém a hora atual ao selecionar uma nova data
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
  

  const REPEAT_COUNT_KEY = '@repeat_count_preference'
  const [repeatCount, setRepeatCount] = useState('5')

  useEffect(() => {
    const loadRepeatCount = async () => {
      try {
        const savedCount = await AsyncStorage.getItem(REPEAT_COUNT_KEY)
        if (savedCount) {
          setRepeatCount(savedCount)
        }
      } catch (error) {
        console.error('Erro ao carregar contagem de repetições:', error)
      }
    }

    // Carrega o valor inicial
    loadRepeatCount()

    // Configura um listener para mudanças no AsyncStorage
    // Note: AsyncStorage doesn't have native change event listeners
    // Using a manual approach to handle value updates
    const checkForChanges = setInterval(async () => {
      const savedCount = await AsyncStorage.getItem(REPEAT_COUNT_KEY)
      if (savedCount) {
        setRepeatCount(savedCount)
      }
    })

    // Limpa o listener quando o componente é desmontado
    return () => {
      clearInterval(checkForChanges)
    }
  }, [])

  const addTask = (): void => {
    if (!newTaskTitle.trim()) return

    const newTasks: Task[] = []
    const baseTask: Task = {
      id: uuidv4(),
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      address: newTaskAddress || undefined,
      dueDate: newTaskDate,
      repeat: newTaskRepeat,
      completed: false,
    }

    newTasks.push(baseTask)

    if (newTaskRepeat !== 'none') {
      const count = parseInt(repeatCount)
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

    setTasks((prevTasks) => [...prevTasks, ...newTasks])
    setNewTaskTitle('')
    setNewTaskDescription('')
    setNewTaskAddress('')
    setNewTaskDate(new Date())
    setNewTaskRepeat('none')
    setShowNewTaskModal(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Tarefas</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowNewTaskModal(true)}
          >
            <IconSymbol
              name="plus"
              size={24}
              color={Colors[colorScheme].icon}
            />
            <Text style={styles.buttonText}>Nova</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowCompletedTasksModal(true)}
          >
            <IconSymbol
              name="list.bullet"
              size={24}
              color={Colors[colorScheme].icon}
            />
            <Text style={styles.buttonText}>Concluídas</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tasks.length === 0 && (
          <Text style={styles.emptyText}>Nenhuma tarefa cadastrada ainda.</Text>
        )}

        {atrasadas.length > 0 && (
          <TaskList
            title="Tarefas Atrasadas"
            tasks={atrasadas}
            onCompleteTask={completeTask}
          />
        )}

        {dodia.length > 0 && (
          <TaskList
            title="Tarefas do Dia"
            tasks={dodia}
            onCompleteTask={completeTask}
          />
        )}

        {proximas.length > 0 && (
          <TaskList
            title="Próximas Tarefas"
            tasks={proximas}
            onCompleteTask={completeTask}
          />
        )}
      </ScrollView>

      <Modal
        visible={showCompletedTasksModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCompletedTasksModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tarefas Concluídas</Text>
              <TouchableOpacity
                onPress={() => setShowCompletedTasksModal(false)}
              >
                <Text style={styles.closeButton}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              {concluidas.length > 0 ? (
                concluidas.map((task) => (
                  <View key={task.id} style={styles.completedTaskItem}>
                    <Text style={styles.completedTaskTitle}>{task.title}</Text>
                    <Text style={styles.completedTaskDate}>
                      Concluída em:{' '}
                      {task.completedDate?.toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Nenhuma tarefa concluída</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNewTaskModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewTaskModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Tarefa</Text>
              <TouchableOpacity onPress={() => setShowNewTaskModal(false)}>
                <Text style={styles.closeButton}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
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
                  <Text>{newTaskDate.toLocaleDateString('pt-BR')} {newTaskDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.input, { justifyContent: 'center' }]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text>Horário: {newTaskDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
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

              <Picker
                selectedValue={newTaskRepeat}
                onValueChange={(itemValue) => setNewTaskRepeat(itemValue)}
              >
                <Picker.Item label="Não repetir" value="none" />
                <Picker.Item label="Diariamente" value="daily" />
                <Picker.Item label="Semanalmente" value="weekly" />
                <Picker.Item label="Mensalmente" value="monthly" />
              </Picker>
              <TouchableOpacity style={styles.addButton} onPress={addTask}>
                <Text style={styles.addButtonText}>Adicionar Tarefa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: 'blue',
  },
  modalScrollView: {
    maxHeight: '90%',
  },
  completedTaskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  completedTaskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedTaskDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  modalBody: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
})