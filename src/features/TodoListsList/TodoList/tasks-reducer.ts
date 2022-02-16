import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todoListsAPI, UpdateTaskModelType} from "../../../api/todoLists-api";
import {AppRootStateType} from "../../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {AxiosError} from "axios";
import {addTodoListAC, clearTodoListsDataAC, removeTodoListAC, setTodoListsAC} from "./todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

export const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTaskAC: (state, action: PayloadAction<{ taskId: string, todoListID: string }>) => {
            const tasks = state[action.payload.todoListID]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: 'idle'})
        },
        updateTaskAC: (state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todoListID: string }>) => {
            const tasks = state[action.payload.todoListID]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTasksAC: (state, action: PayloadAction<{ tasks: Array<TaskType>, todoListID: string }>) => {
            state[action.payload.todoListID] = action.payload.tasks.map(task => ({...task, entityStatus: 'idle'}));
        },
        changeTaskEntityStatusAC: (state, action: PayloadAction<{ taskId: string, todoListID: string, entityStatus: RequestStatusType }>) => {
            const tasks = state[action.payload.todoListID]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], entityStatus: action.payload.entityStatus}
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTodoListAC, (state, action) => {
                state[action.payload.todoList.id] = []
            })
            .addCase(removeTodoListAC, (state, action) => {
                delete state[action.payload.todoListID]
            })
            .addCase(setTodoListsAC, (state, action) => {
                action.payload.todoLists.forEach((tdl) => state[tdl.id] = [])
            })
            .addCase(clearTodoListsDataAC, () => {
                return {}
            })
    }
})

// худший вариант extraReducers (дублирование кода типизации)
// {
//     [addTodoListAC.type]: (state, action: PayloadAction<{ todoList: TodoListType }>) => {
//          state[action.payload.todoList.id] = []
//     },
//     [removeTodoListAC.type]: (state, action: PayloadAction<{ todoListID: string }>) => {
//          delete state[action.payload.todoListID]
//     },
//     [setTodoListsAC.type]: (state, action: PayloadAction<{todoLists: Array<TodoListType>}>) => {
//          action.payload.todoLists.forEach((tdl: any) => state[tdl.id] = [])
//     },
//     [clearTodoListsDataAC.type]: (state, action) => {
//          return {}
//     }
// }

export const tasksReducer = slice.reducer
export const {removeTaskAC, addTaskAC, updateTaskAC, setTasksAC, changeTaskEntityStatusAC} = slice.actions

// thunks
export const fetchTasksTC = (todoListID: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todoListsAPI.getTasks(todoListID)
        .then((res) => {
            dispatch(setTasksAC({tasks: res.data.items, todoListID: todoListID}))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTaskTC = (todoListID: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(changeTaskEntityStatusAC({taskId: taskId, todoListID: todoListID, entityStatus: 'loading'}))
    dispatch(setAppStatusAC({status: "loading"}))
    todoListsAPI.deleteTask(todoListID, taskId)
        .then(() => {
            dispatch(removeTaskAC({taskId: taskId, todoListID: todoListID}))
            dispatch(setAppStatusAC({status: "succeeded"}))
            dispatch(changeTaskEntityStatusAC({taskId: taskId, todoListID: todoListID, entityStatus: 'succeeded'}))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const addTaskTC = (todoListID: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todoListsAPI.createTask(todoListID, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError<{ item: TaskType }>(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTaskTC = (todoListID: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(changeTaskEntityStatusAC({taskId: taskId, todoListID: todoListID, entityStatus: 'loading'}))
        dispatch(setAppStatusAC({status: "loading"}))
        const allTasksFromState = getState().tasks
        const tasksForCurrentTodoList = allTasksFromState[todoListID]
        const task = tasksForCurrentTodoList.find(t => t.id === taskId)
        if (!task) {
            console.log('tasks not found in the state')
            return
        }
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            startDate: task.startDate,
            priority: task.priority,
            deadline: task.deadline,
            description: task.description,
            status: task.status,
            ...domainModel
        }
        todoListsAPI.updateTask(todoListID, taskId, apiModel)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC({taskId: taskId, model: apiModel, todoListID: todoListID}))
                    dispatch(setAppStatusAC({status: "succeeded"}))
                    dispatch(changeTaskEntityStatusAC({
                        taskId: taskId,
                        todoListID: todoListID,
                        entityStatus: 'succeeded'
                    }))
                } else {
                    handleServerAppError<{ item: TaskType }>(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<DomainTaskType>

}
export type DomainTaskType = TaskType & { entityStatus: RequestStatusType }