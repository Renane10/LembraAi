import { StyleSheet } from 'react-native'
import TaskItem from './TaskItem'
import { Task } from '../types/Task'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'

interface Props {
  title: string
  tasks: Task[]
  onCompleteTask?: (taskId: string) => void
}

export default function TaskList({ title, tasks, onCompleteTask }: Props) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        {title}
      </ThemedText>
      {tasks.length === 0 ? (
        <ThemedText style={styles.emptyText}>Nenhuma tarefa</ThemedText>
      ) : (
        tasks.map(task => <TaskItem key={task.id} task={task} onComplete={onCompleteTask} />)
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  title: {
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 8
  },
  emptyText: {
    opacity: 0.7
  }
})
