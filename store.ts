import AsyncStorage from '@react-native-async-storage/async-storage';
import { State } from 'react-native-gesture-handler';
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface ITask {
    id: string;
    name: string;
    doneState: boolean;
}

export interface ITasksStore {
    tasks: ITask[];
    addTasks: (task: ITask) => void
    deleteAllTasks: () => void
    deleteTask: (id: string) => void
    toggleTask: (id: string) => void
}

export const useTaskStore = create<ITasksStore>()(
    persist(
        (set) => ({
            tasks: [],
            addTasks: (task) => set((state) => ({...state, tasks: [...state.tasks, task]})),
            deleteAllTasks: () => set((state) => ({...state, tasks: []})),
            deleteTask: (id) => set((state) =>({...state, tasks: state.tasks.filter((task) => task.id !== id)})),
            toggleTask: (id) => set((state) => ({...state, tasks: state.tasks.map((tsk) => tsk.id === id ? {...tsk, doneState: !tsk.doneState}: tsk)}))
        }),
        {
            name: "TasksStore",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)

export default useTaskStore;