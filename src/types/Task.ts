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
  priority?: 'normal' | 'important' | 'urgent';
  category?: string; // Nova propriedade para categoria
}

// Interface para as categorias
export interface Category {
  id: string;
  name: string;
  color: string;
}
