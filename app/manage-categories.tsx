import { useState, useEffect, useLayoutEffect } from 'react'
import { View, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native'
import { useNavigation } from 'expo-router'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { useColorScheme } from '@/hooks/useColorScheme'
import { ThemedButton } from '@/components/ThemedButton'
import { Colors } from '../constants/Colors'
import { Category } from '@/types/Task'
import { getAllCategories, addCategory, updateCategory, removeCategory } from '@/utils/CategoryManager'

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

// Componente para o seletor de cores
const ColorPicker = ({ selectedColor, onColorSelect }: ColorPickerProps) => {
  const colors = [
    '#4285F4', '#EA4335', '#34A853', '#FBBC05', '#9C27B0',
    '#3F51B5', '#03A9F4', '#00BCD4', '#009688', '#8BC34A',
    '#CDDC39', '#FFC107', '#FF9800', '#FF5722', '#795548'
  ]
  
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
      {colors.map(color => (
        <TouchableOpacity
          key={color}
          style={{
            width: 30,
            height: 30,
            backgroundColor: color,
            margin: 5,
            borderRadius: 15,
            borderWidth: selectedColor === color ? 3 : 0,
            borderColor: '#000'
          }}
          onPress={() => onColorSelect(color)}
        />
      ))}
    </View>
  )
}

// Componente para botões de ação com ícones
const IconButton = ({ 
  onPress, 
  icon, 
  color, 
  style 
}: { 
  onPress: () => void, 
  icon: import('@/components/ui/IconSymbol').IconSymbolName, 
  color: string, 
  style?: any 
}) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[{
      padding: 5,
      borderRadius: 5,
      backgroundColor: 'transparent'
    }, style]}
  >
    <IconSymbol name={icon} size={20} color={color} />
  </TouchableOpacity>
)

export default function ManageCategoriesScreen() {
  const navigation = useNavigation()
  const colorScheme = useColorScheme() ?? 'light'
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedColor, setSelectedColor] = useState('#4285F4')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Gerenciar Categorias' })
  }, [navigation])
  
  useEffect(() => {
    loadCategories()
  }, [])
  
  const loadCategories = async () => {
    const allCategories = await getAllCategories()
    setCategories(allCategories)
  }
  
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Erro', 'O nome da categoria não pode estar vazio')
      return
    }
    
    if (editingCategory) {
      // Atualizar categoria existente
      const success = await updateCategory(editingCategory.id, newCategoryName, selectedColor)
      if (success) {
        setNewCategoryName('')
        setSelectedColor('#4285F4')
        setEditingCategory(null)
        loadCategories()
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar a categoria')
      }
    } else {
      // Adicionar nova categoria
      const newCategory = await addCategory(newCategoryName, selectedColor)
      if (newCategory) {
        setNewCategoryName('')
        setSelectedColor('#4285F4')
        loadCategories()
      } else {
        Alert.alert('Erro', 'Já existe uma categoria com este nome')
      }
    }
  }
  
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setNewCategoryName(category.name)
    setSelectedColor(category.color)
  }
  
  const handleDeleteCategory = async (categoryId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta categoria? As tarefas associadas a ela ficarão sem categoria.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            const success = await removeCategory(categoryId)
            if (success) {
              loadCategories()
            } else {
              Alert.alert('Erro', 'Não foi possível excluir a categoria')
            }
          } 
        }
      ]
    )
  }
  
  const cancelEditing = () => {
    setEditingCategory(null)
    setNewCategoryName('')
    setSelectedColor('#4285F4')
  }
  
  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ScrollView>
        <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
          {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
        </ThemedText>
        
        <TextInput
          style={{
            backgroundColor: Colors[colorScheme].background,
            color: Colors[colorScheme].text,
            padding: 15,
            borderRadius: 5,
            marginBottom: 10
          }}
          placeholder="Nome da categoria"
          placeholderTextColor={Colors[colorScheme].icon}
          value={newCategoryName}
          onChangeText={setNewCategoryName}
        />
        
        <ThemedText style={{ marginTop: 10, marginBottom: 5 }}>Selecione uma cor:</ThemedText>
        <ColorPicker selectedColor={selectedColor} onColorSelect={setSelectedColor} />
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          {editingCategory && (
            <TouchableOpacity 
              style={[
                {
                  flex: 1,
                  marginRight: 10,
                  backgroundColor: Colors[colorScheme].tint,
                  padding: 15,
                  borderRadius: 5,
                  alignItems: 'center'
                }
              ]}
              onPress={cancelEditing}
            >
              <ThemedButton title='Cancelar' onPress={cancelEditing} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[
              {
                flex: 1,
                backgroundColor: Colors[colorScheme].tint,
                padding: 15,
                borderRadius: 5,
                alignItems: 'center'
              }
            ]}
            onPress={handleAddCategory}
          >
            <ThemedButton title={editingCategory ? 'Atualizar' : 'Adicionar'} onPress={handleAddCategory} />
          </TouchableOpacity>
        </View>
        
        <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 10 }}>
          Categorias Existentes
        </ThemedText>
        
        {categories.length === 0 ? (
          <ThemedText style={{ opacity: 0.7 }}>Nenhuma categoria cadastrada</ThemedText>
        ) : (
          categories.map(category => (
            <ThemedView 
              key={category.id} 
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                backgroundColor: Colors[colorScheme].background,
                borderRadius: 5,
                marginBottom: 10
              }}
            >
              <View 
                style={{
                  width: 20, 
                  height: 20, 
                  backgroundColor: category.color,
                  borderRadius: 10,
                  marginRight: 10
                }}
              />
              <ThemedText style={{ flex: 1 }}>{category.name}</ThemedText>
              
              <IconButton 
                icon="edit"
                color={Colors[colorScheme].icon}
                style={{ marginRight: 15 }}
                onPress={() => handleEditCategory(category)}
              />
              
              <IconButton 
                icon="delete"
                color="#FF0000"
                onPress={() => handleDeleteCategory(category.id)}
              />
            </ThemedView>
          ))
        )}
      </ScrollView>
    </ThemedView>
  )
}