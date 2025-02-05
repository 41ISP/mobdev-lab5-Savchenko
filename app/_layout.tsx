import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { customAlphabet} from 'nanoid/non-secure';
import { isEnabled } from 'react-native/Libraries/Performance/Systrace';



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [task, setTask] = useState('');
  
  
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const toggleSwitch = (id: string) => {
    tasks.map((tsk) => {
      if(tsk === id)
    })
  }
  const nanoid = customAlphabet("adcdefghijklmnopqrstuvwxyz0123456789",10)

  const initialTasks = [
    {
      task: "123",
      id: nanoid(),
      stateDone: false,
    }
  ] 
  const [tasks, setTasks] = useState([...initialTasks])

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
      setTasks([
        ...tasks,
        {id: nanoid(), task: task, stateDone: false}
      ])
    }
  }

  const handleDeleteTask = (id: string) => {
     setTasks(tasks.filter((task) => task.id !== id))
  }

  const handlePress = () => {
    if (task.trim()) {
      setTasks([
        ...tasks,
        {id: nanoid(), task: task, stateDone: false}
      ])
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
        returnKeyType='done'/>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text>Add task</Text>
        </TouchableOpacity>
        <FlatList style={styles.list} data={tasks} keyExtractor={(item) => item.id} renderItem={(
          { item } ,
        ) => (
          <View>
            <Text>
              {item.task}
            </Text>
            <Switch value={isEnabled} onValueChange={toggleSwitch} thumbColor={isEnabled ? '#33FF42' : '#FF0000'}
            trackColor={{false: '#fe3333', true: '#52FF5F'}}/>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(item.id)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        />
      </View>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create ({
  container: {
    marginTop: 200,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    maxHeight: 300,
    minHeight: 300,
    maxWidth: 300,
    minWidth: 300,
    borderRadius: 50,
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
    // textAlign: 'center'
  },
  deleteButton: {

  }
})
