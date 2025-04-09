import React, { useState, useEffect } from 'react'
import 'react-native-get-random-values'
import { View, ScrollView, Text, TouchableOpacity, Modal } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import TaskList from '../components/TaskList'
import { Task } from '../types/Task'
import { IconSymbol } from '../components/ui/IconSymbol'
import { useColorScheme } from '../hooks/useColorScheme'
import { Colors } from '../../constants/Colors'
import { styles } from '../assets/styles/HomeScreen.styles'
// Configuração das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

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
        trigger: { type: 'date', timestamp: notificationTime.getTime() },
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

  const today = new Date()
  const atrasadas = tasks.filter(
    (task) => !task.completed && task.dueDate < today && !isToday(task.dueDate)
  )
  const proximas = tasks.filter(
    (task) => !task.completed && task.dueDate > today && !isToday(task.dueDate)
  )
  const dodia = tasks.filter((task) => !task.completed && isToday(task.dueDate))
  const concluidas = tasks.filter((task) => task.completed)

  // Marca uma tarefa como concluída
  const completeTask = async (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, completed: true, completedDate: new Date() }
        : task
    )
    setTasks(updatedTasks)
    await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks))
    // Cancela a notificação da tarefa concluída
    await cancelTaskNotification(taskId)
  }

  return (
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Tarefas</Text>
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


    </View>
  )
}