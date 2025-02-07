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




// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [task, setTask] = useState('');
  const nanoid = customAlphabet("adcdefghijklmnopqrstuvwxyz0123456789", 10)

  const [showCompleted, setShowCompleted] = useState(false)
  const colorScheme = useColorScheme();
  const { toggleTask, deleteTask, addTasks, tasks } = useTaskStore()
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
    if (task.trim()) {
      addTasks(

        { id: nanoid(), name: task, doneState: false }
      )
    }
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
          <Text>Add task</Text>
        </TouchableOpacity>
        <FlatList style={styles.list} data={filteredTasks} keyExtractor={(item) => item.id} renderItem={(
          { item },
        ) => (
          <View style={styles.itemContainer}>
            <Text>
              {item.name}
            </Text>
            <Switch value={item.doneState} onValueChange={() => toggleTask(item.id)} />
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        />
        <View>
          <Text>Filter tasks</Text>
          <Switch onValueChange={setShowCompleted} value={showCompleted} />
        </View>
      </View>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'

  },
  input: {
    borderWidth: 1,
    margin: 20,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  button: {
    margin: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,

  },
  list: {
  },
  deleteButton: {

  },
  itemContainer: {
    flexDirection: 'row'
  },
})
