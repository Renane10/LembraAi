import { TouchableOpacity, StyleSheet } from 'react-native'
import { Task } from '../types/Task'
import { IconSymbol } from './ui/IconSymbol'
import { useColorScheme } from '../hooks/useColorScheme'
import { Colors } from '../../constants/Colors'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'
import { useThemeColor } from '../hooks/useThemeColor'

interface Props {
  task: Task
  onComplete?: (taskId: string) => void
}

export default function TaskItem({ task, onComplete }: Props) {
  const colorScheme = useColorScheme() ?? 'light'
  
  // Formatar a data no padrão português-BR
  const formatDate = (date: Date) => {
    const dateStr = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    const timeStr = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
    return `${dateStr} ${timeStr}`
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task.id)
    }
  }

  const borderColor = useThemeColor({}, 'icon')

  return (
    <ThemedView style={[styles.container, { borderColor }]}>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>{task.title}</ThemedText>
        {task.description && (
          <ThemedText style={styles.description}>{task.description}</ThemedText>
        )}
        {task.address && (
          <ThemedText style={styles.address}>{task.address}</ThemedText>
        )}
        <ThemedText style={styles.date}>
          {formatDate(task.dueDate)}
        </ThemedText>
      </ThemedView>
      <TouchableOpacity 
        onPress={handleComplete}
        style={styles.checkButton}
      >
        <IconSymbol 
          name="checkmark" 
          size={24} 
          color={Colors[colorScheme].icon} 
        />
      </TouchableOpacity>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10, 
    borderBottomWidth: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    flex: 1
  },
  title: {
    fontWeight: 'bold'
  },
  date: {
    opacity: 0.7
  },
  description: {
    opacity: 0.8,
    marginTop: 4
  },
  address: {
    opacity: 0.8,
    marginTop: 2
  },
  checkButton: {
    padding: 5
  }
})