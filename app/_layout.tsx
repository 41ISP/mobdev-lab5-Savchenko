import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useUnstableGlobalHref } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { customAlphabet } from 'nanoid/non-secure';
import useTaskStore from '@/store';
import { BorderlessButton } from 'react-native-gesture-handler';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [task, setTask] = useState('');
  const nanoid = customAlphabet("adcdefghijklmnopqrstuvwxyz0123456789", 10)
  const MAX_LENGTH = 15;
  const [showCompleted, setShowCompleted] = useState(false)
  const colorScheme = useColorScheme();
  const {toggleTask, deleteTask, addTasks, tasks} = useTaskStore()

  const [filteredTasks, setFilteredTasks] = useState([...tasks])
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  useEffect(() => {
    if (showCompleted) {
      setFilteredTasks(tasks.filter(task => task.doneState === showCompleted))
    } else {
      setFilteredTasks(tasks)
    }
  }, [showCompleted, tasks])



  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const handleSubmit = () => {
    if (task.trim() && task.length <= MAX_LENGTH ) {
      addTasks(
        { id: nanoid(), name: task, doneState: false }
      )
    } else {
      alert(`Task name must be ${MAX_LENGTH} characters or less.`)
    }
    setTask('')
  }

  

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <TextInput style={styles.input}
          placeholder='Enter the task:'
          value={task}
          onChangeText={setTask}
          onSubmitEditing={handleSubmit}
          returnKeyType='done' />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add task</Text>
        </TouchableOpacity>
        <FlatList style={styles.list} data={filteredTasks} keyExtractor={(item) => item.id} renderItem={(
          { item },
        ) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {item.name}
            </Text>
            <Switch value={item.doneState} onValueChange={() => 
              toggleTask(item.id)} />
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        />
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Filter tasks</Text>
          <Switch onValueChange={setShowCompleted} value={showCompleted} />
        </View>
      </View>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  list: {
    width: '90%',
  },
  deleteButton: {
    backgroundColor: '#E53935',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20, 
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    marginHorizontal: 20,
  },
  filterText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
})
