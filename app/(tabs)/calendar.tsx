import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { styles } from '@/assets/styles/calendar.styles';
import { Calendar } from '@/components/Calendar';
import { Task } from '@/types/Task';
import TaskList from '@/components/TaskList';

export default function CalendarScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([]);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        const tasksWithDates = parsedTasks.map((task: Task) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          completedDate: task.completedDate ? new Date(task.completedDate) : undefined
        }));
        setTasks(tasksWithDates);
        updateMarkedDates(tasksWithDates);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const updateMarkedDates = (taskList: Task[]) => {
    const marked = {};
    taskList.forEach((task) => {
      if (!task.completed) {
        const dateString = task.dueDate.toISOString().split('T')[0];
        (marked as { [key: string]: any })[dateString] = {
          marked: true,
          dotColor: '#007AFF'
        };
      }
    });
    setMarkedDates(marked);
  };

  const handleDayPress = (day: any) => {
    const selectedTasks = tasks.filter((task) => {
      const taskDate = task.dueDate.toISOString().split('T')[0];
      return taskDate === day.dateString && !task.completed;
    });
    setSelectedDayTasks(selectedTasks);
  };

  const completeTask = async (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, completed: true, completedDate: new Date() }
        : task
    );
    setTasks(updatedTasks);
    await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
    updateMarkedDates(updatedTasks);
    
    // Atualiza a lista de tarefas do dia selecionado
    const updatedSelectedTasks = selectedDayTasks.filter(task => task.id !== taskId);
    setSelectedDayTasks(updatedSelectedTasks);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        width: '100%',
        padding: 15,
      }}>
      <Calendar onDayPress={handleDayPress} markedDates={markedDates} />
      
      {selectedDayTasks.length > 0 ? (
        <ThemedView style={styles.taskListContainer}>
          <TaskList
            title="Tarefas do Dia Selecionado"
            tasks={selectedDayTasks}
            onCompleteTask={completeTask}
          />
        </ThemedView>
      ) : (
        <ThemedText style={styles.noTasksText}>
          Nenhuma tarefa para o dia selecionado.
        </ThemedText>
      )}
    </ScrollView>
  );
}