import 'react-native-get-random-values'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '@/types/Task';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES_STORAGE_KEY = '@task_categories';

// Categorias padrão
const DEFAULT_CATEGORIES: Category[] = [
  { id: uuidv4(), name: 'Trabalho', color: '#4285F4' },
  { id: uuidv4(), name: 'Pessoal', color: '#EA4335' },
  { id: uuidv4(), name: 'Saúde', color: '#34A853' },
  { id: uuidv4(), name: 'Compras', color: '#FBBC05' },
  { id: uuidv4(), name: 'Estudos', color: '#9C27B0' },
];

// Inicializar categorias
export const initializeCategories = async (): Promise<void> => {
  try {
    const existingCategories = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!existingCategories) {
      await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    }
  } catch (error) {
    console.error('Erro ao inicializar categorias:', error);
  }
};

// Obter todas as categorias
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categoriesJson = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
    return categoriesJson ? JSON.parse(categoriesJson) : [];
  } catch (error) {
    console.error('Erro ao obter categorias:', error);
    return [];
  }
};

// Adicionar uma nova categoria
export const addCategory = async (name: string, color: string): Promise<Category | null> => {
  try {
    const categories = await getAllCategories();
    
    // Verificar se já existe uma categoria com o mesmo nome
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
      return null;
    }
    
    const newCategory: Category = {
      id: uuidv4(),
      name,
      color
    };
    
    const updatedCategories = [...categories, newCategory];
    await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
    
    return newCategory;
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    return null;
  }
};

// Atualizar uma categoria existente
export const updateCategory = async (id: string, name: string, color: string): Promise<boolean> => {
  try {
    const categories = await getAllCategories();
    const updatedCategories = categories.map(cat => 
      cat.id === id ? { ...cat, name, color } : cat
    );
    
    await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
    return true;
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return false;
  }
};

// Remover uma categoria
export const removeCategory = async (id: string): Promise<boolean> => {
  try {
    const categories = await getAllCategories();
    const updatedCategories = categories.filter(cat => cat.id !== id);
    
    await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
    return true;
  } catch (error) {
    console.error('Erro ao remover categoria:', error);
    return false;
  }
};