export interface Task {
  id: string;
  title: string;
  description?: string;
  address?: string;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
  repeat?: 'daily' | 'weekly' | 'monthly' | 'none';
  reminderBefore?: number;
  reminderAfter?: number;
}
