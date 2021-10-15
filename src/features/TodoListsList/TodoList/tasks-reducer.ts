import {
    AddTodoListActionType,
    ClearTodoListsDataActionType,
    RemoveTodoListActionType,
    SetTodoListsActionType
} from "./todolists-reducer";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todoListsAPI, UpdateTaskModelType} from "../../../api/todoLists-api";
import {AppRootStateType} from "../../../app/store";
import {
    RequestStatusType,
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {AxiosError} from "axios";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {

    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todoListID]: state[action.todoListID].filter(task => task.id !== action.taskId)};
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]].map(task => ({
                    ...task,
                    entityStatus: 'idle'
                }))
            };
        case "UPDATE-TASK":
            return {
                ...state, [action.todoListID]: state[action.todoListID].map(
                    task => task.id === action.taskId ? {...task, ...action.model} : task)
            };
        case "ADD-TODOLIST":
            return {...state, [action.todoList.id]: []};
        case "REMOVE-TODOLIST":
            const stateCopy = {...state}
            delete stateCopy[action.todoListID]
            return stateCopy;
        case "SET-TODOLISTS": {
            const stateCopy = {...state}
            action.todoLists.forEach(tdl => stateCopy[tdl.id] = [])
            return stateCopy;
        }
        case "SET-TASKS":
            return {...state, [action.todoListID]: action.tasks.map(task => ({...task, entityStatus: 'idle'}))}
        case "CHANGE-TASK-ENTITY-STATUS":
            return {
                ...state, [action.todoListID]: state[action.todoListID].map(
                    task => task.id === action.taskId ? {...task, entityStatus: action.entityStatus} : task)
            }
        case "CLEAR-TODOLISTS-DATA":
            return {}
        default:
            return state
    }
}

// actions
export const removeTaskAC = (taskId: string, todoListID: string) =>
    ({type: 'REMOVE-TASK', todoListID, taskId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todoListID: string) =>
    ({type: 'UPDATE-TASK', taskId, model, todoListID} as const)
export const setTasksAC = (tasks: Array<TaskType>, todoListID: string) =>
    ({type: 'SET-TASKS', tasks, todoListID} as const)
export const changeTaskEntityStatusAC = (taskId: string, todoListID: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TASK-ENTITY-STATUS', taskId, todoListID, entityStatus} as const)

// thunks
export const fetchTasksTC = (todoListID: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"))
    todoListsAPI.getTasks(todoListID)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todoListID))
            dispatch(setAppStatusAC("succeeded"))
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTaskTC = (todoListID: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(changeTaskEntityStatusAC(taskId, todoListID, 'loading'))
    dispatch(setAppStatusAC("loading"))
    todoListsAPI.deleteTask(todoListID, taskId)
        .then(() => {
            dispatch(removeTaskAC(taskId, todoListID))
            dispatch(setAppStatusAC("succeeded"))
            dispatch(changeTaskEntityStatusAC(taskId, todoListID, 'succeeded'))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const addTaskTC = (todoListID: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"))
    todoListsAPI.createTask(todoListID, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError<{ item: TaskType }>(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTaskTC = (todoListID: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        dispatch(changeTaskEntityStatusAC(taskId, todoListID, 'loading'))
        dispatch(setAppStatusAC("loading"))
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
                    dispatch(updateTaskAC(taskId, apiModel, todoListID))
                    dispatch(setAppStatusAC("succeeded"))
                    dispatch(changeTaskEntityStatusAC(taskId, todoListID, 'succeeded'))
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
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListsActionType
    | ReturnType<typeof setTasksAC>
    | SetAppStatusActionType
    | SetAppErrorActionType
    | ReturnType<typeof changeTaskEntityStatusAC>
    | ClearTodoListsDataActionType