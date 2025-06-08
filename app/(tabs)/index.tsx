import React, { useState, useEffect } from 'react'
import 'react-native-get-random-values'
import { View, ScrollView, Text, TouchableOpacity, Modal } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import TaskList from '@/components/TaskList'
import { Task } from '@/types/Task'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Colors } from '../../constants/Colors'
import { styles } from '@/assets/styles/HomeScreen.styles'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

// Configuração das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

// Adicionar estas importações
import { getAllCategories } from '@/utils/CategoryManager'
import { Category } from '@/types/Task'

export default function HomeScreen() {
  const router = useRouter()
  const colorScheme = useColorScheme() ?? 'light'
  const [tasks, setTasks] = useState<Task[]>([])
  const [showCompletedTasksModal, setShowCompletedTasksModal] = useState(false)

  // Solicita permissão para enviar notificações ao iniciar o app
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permissão para notificações não concedida')
      }
    }
    requestPermissions()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      loadTasks()
    }, [])
  )

  // Carrega as tarefas salvas no AsyncStorage
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@tasks')
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks)
        // Converte as strings de data de volta para objetos Date
        const tasksWithDates = parsedTasks.map((task: Task) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          completedDate: task.completedDate ? new Date(task.completedDate) : undefined
        }))
        setTasks(tasksWithDates)
        // Agenda notificações para as tarefas não concluídas
        tasksWithDates
          .filter((task: Task) => !task.completed)
          .forEach(scheduleNotification)
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    }
  }

  // Agenda uma notificação para uma tarefa
  const scheduleNotification = async (task: Task) => {
    try {
      // Cancela notificações existentes para esta tarefa
      await cancelTaskNotification(task.id)

      // Calcula o tempo até a tarefa (30 minutos antes)
      const notificationTime = new Date(task.dueDate)
      notificationTime.setMinutes(notificationTime.getMinutes() - 30)

      // Se a data da notificação já passou, não agenda
      if (notificationTime <= new Date()) return

      // Agenda a notificação
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de Tarefa',
          body: `A tarefa "${task.title}" vence em 30 minutos!`,
          data: { taskId: task.id },
        },
        trigger: {
          type: 'date',
          date: notificationTime,
        } as any,
      })
    } catch (error) {
      console.error('Erro ao agendar notificação:', error)
    }
  }

  // Cancela a notificação de uma tarefa específica
  const cancelTaskNotification = async (taskId: string) => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()
    const taskNotification = scheduledNotifications.find(
      notification => notification.content.data?.taskId === taskId
    )
    if (taskNotification?.identifier) {
      await Notifications.cancelScheduledNotificationAsync(taskNotification.identifier)
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Adicionar estes estados
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  
  // Adicionar este useEffect para carregar as categorias
  useEffect(() => {
    const loadCategories = async () => {
      const allCategories = await getAllCategories()
      setCategories(allCategories)
    }
    
    loadCategories()
  }, [])
  
  // Modificar as funções de filtragem para incluir o filtro por categoria
  const filterTasksByCategory = (taskList: Task[]) => {
    if (!selectedCategoryId) return taskList
    return taskList.filter(task => task.category === selectedCategoryId)
  }
  
  // Modificar as variáveis que filtram as tarefas
  const today = new Date()
  const atrasadas = filterTasksByCategory(
    tasks.filter(
      (task) => !task.completed && task.dueDate < today && !isToday(task.dueDate)
    )
  )
  const proximas = filterTasksByCategory(
    tasks.filter(
      (task) => !task.completed && task.dueDate > today && !isToday(task.dueDate)
    )
  )
  const dodia = filterTasksByCategory(
    tasks.filter((task) => !task.completed && isToday(task.dueDate))
  )
  const concluidas = filterTasksByCategory(
    tasks.filter((task) => task.completed)
  )
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Minhas Tarefas</ThemedText>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/new-task')}
          >
            <IconSymbol
              name="plus"
              size={24}
              color={Colors[colorScheme].icon}
            />
            <ThemedText style={styles.buttonText}>Nova</ThemedText>
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
            <ThemedText style={styles.buttonText}>Concluídas</ThemedText>
          </TouchableOpacity>
          
          {/* Adicionar este botão */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/manage-categories')}
          >
            <IconSymbol
              name="bookmark"
              size={24}
              color={Colors[colorScheme].icon}
            />
            <ThemedText style={styles.buttonText}>Categorias</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
      
      {/* Adicionar o filtro de categorias */}
      <ThemedView style={{ paddingHorizontal: 15, marginBottom: 10 }}>
        <ThemedText style={{ marginBottom: 5 }}>Filtrar por categoria:</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={{
              backgroundColor: !selectedCategoryId ? Colors[colorScheme].tint : Colors[colorScheme].background,
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 10
            }}
            onPress={() => setSelectedCategoryId(null)}
          >
            <ThemedText style={{ 
              color: !selectedCategoryId ? '#fff' : Colors[colorScheme].text 
            }}>
              Todas
            </ThemedText>
          </TouchableOpacity>
          
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={{
                backgroundColor: selectedCategoryId === category.id ? category.color : Colors[colorScheme].background,
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => setSelectedCategoryId(category.id === selectedCategoryId ? null : category.id)}
            >
              <View 
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: category.color,
                  marginRight: 5,
                  opacity: selectedCategoryId === category.id ? 0.5 : 1
                }}
              />
              <ThemedText style={{ 
                color: selectedCategoryId === category.id ? '#fff' : Colors[colorScheme].text 
              }}>
                {category.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>
      
      {/* Resto do componente permanece igual */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tasks.length === 0 && (
          <ThemedText style={styles.emptyText}>Nenhuma tarefa cadastrada ainda.</ThemedText>
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
          <ThemedView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Tarefas Concluídas</ThemedText>
              <TouchableOpacity
                onPress={() => setShowCompletedTasksModal(false)}
              >
                <ThemedText style={styles.closeButton}>Fechar</ThemedText>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              {concluidas.length > 0 ? (
                concluidas.map((task) => (
                  <ThemedView key={task.id} style={styles.completedTaskItem}>
                    <ThemedText style={styles.completedTaskTitle}>{task.title}</ThemedText>
                    <ThemedText style={styles.completedTaskDate}>
                      Concluída em:{' '}
                      {task.completedDate?.toLocaleDateString('pt-BR')}
                    </ThemedText>
                  </ThemedView>
                ))
              ) : (
                <ThemedText style={styles.emptyText}>Nenhuma tarefa concluída</ThemedText>
              )}
            </ScrollView>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  )
}

// Adicione esta função antes do return no componente HomeScreen
const completeTask = async (taskId: string) => {
  try {
    // Encontra a tarefa pelo ID
    const taskToComplete = tasks.find(task => task.id === taskId);
    if (!taskToComplete) return;
    
    // Atualiza o status da tarefa para completada
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: true,
          completedDate: new Date()
        };
      }
      return task;
    });
    
    // Atualiza o estado e salva no AsyncStorage
    setTasks(updatedTasks);
    await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
    
    // Cancela as notificações para a tarefa completada
    await cancelTaskNotification(taskId);
  } catch (error) {
    console.error('Erro ao completar tarefa:', error);
  }
};