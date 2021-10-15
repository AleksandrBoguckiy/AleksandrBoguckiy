import {Dispatch} from "redux";
import {todoListsAPI, TodoListType} from "../../../api/todoLists-api";
import {
    RequestStatusType,
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {fetchTasksTC} from "./tasks-reducer";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "../../../app/store";

const initialState: Array<TodoListDomainType> = []

export const todoListsReducer = (state: Array<TodoListDomainType> = initialState, action: TodoListsActionsType): Array<TodoListDomainType> => {

    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tdl => tdl.id !== action.todoListID)
        case 'ADD-TODOLIST':
            return [{...action.todoList, filter: "All", entityStatus: 'idle'}, ...state]
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tdl => tdl.id === action.todoListID ? {...tdl, filter: action.filterValue} : tdl)
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tdl => tdl.id === action.todoListID ? {...tdl, title: action.newTitle} : tdl)
        case "SET-TODOLISTS":
            return action.todoLists.map(tdl => ({...tdl, filter: "All", entityStatus: 'idle'}))
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(tdl => tdl.id === action.todoListID ? {...tdl, entityStatus: action.entityStatus} : tdl)
        case "CLEAR-TODOLISTS-DATA":
            return []
        default:
            return state
    }
}

// actions
export const removeTodoListAC = (todoListID: string) =>
    ({type: 'REMOVE-TODOLIST', todoListID} as const)
export const addTodoListAC = (todoList: TodoListType) =>
    ({type: 'ADD-TODOLIST', todoList} as const)
export const changeTodolistFilterAC = (filterValue: FilterValuesType, todoListID: string) =>
    ({type: 'CHANGE-TODOLIST-FILTER', filterValue, todoListID} as const)
export const changeTodoListTitleAC = (newTitle: string, todoListID: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', newTitle, todoListID} as const)
export const setTodoListsAC = (todoLists: Array<TodoListType>) =>
    ({type: 'SET-TODOLISTS', todoLists} as const)
export const changeTodoListEntityStatusAC = (todoListID: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', todoListID, entityStatus} as const)
export const clearTodoListsDataAC = () =>
    ({type: 'CLEAR-TODOLISTS-DATA'} as const)

// thunks
export const fetchTodoListsTC = (): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    todoListsAPI.getTodoLists()
        .then((res) => {
            dispatch(setTodoListsAC(res.data))
            dispatch(setAppStatusAC("succeeded"))
            return res.data
        })
        .then((res) => {
            res.forEach((tdl) => {
                dispatch(fetchTasksTC(tdl.id))
            })
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const addTodoListTC = (todoListTitle: string) => (dispatch: Dispatch<TodoListsActionsType>) => {
    dispatch(setAppStatusAC("loading"))
    todoListsAPI.createTodoList(todoListTitle)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodoListAC(res.data.data.item))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError<{ item: TodoListType }>(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTodoListTC = (todoListID: string) => (dispatch: Dispatch<TodoListsActionsType>) => {
    dispatch(changeTodoListEntityStatusAC(todoListID, 'loading'))
    dispatch(setAppStatusAC("loading"))
    todoListsAPI.deleteTodoList(todoListID)
        .then(() => {
            dispatch(removeTodoListAC(todoListID))
            dispatch(setAppStatusAC("succeeded"))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const changeTodoListTitleTC = (todoListID: string, todoListTitle: string) => (dispatch: Dispatch<TodoListsActionsType>) => {
    dispatch(setAppStatusAC("loading"))
    todoListsAPI.updateTodoList(todoListID, todoListTitle)
        .then(() => {
            dispatch(changeTodoListTitleAC(todoListTitle, todoListID))
            dispatch(setAppStatusAC("succeeded"))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

// types
export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>
export type AddTodoListActionType = ReturnType<typeof addTodoListAC>
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>
export type ChangeTodoListEntityStatusActionType = ReturnType<typeof changeTodoListEntityStatusAC>
export type ClearTodoListsDataActionType = ReturnType<typeof clearTodoListsDataAC>
type TodoListsActionsType =
    | RemoveTodoListActionType
    | AddTodoListActionType
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodoListTitleAC>
    | SetTodoListsActionType
    | SetAppStatusActionType
    | SetAppErrorActionType
    | ChangeTodoListEntityStatusActionType
    | ClearTodoListsDataActionType

type ThunkType = ThunkAction<void, AppRootStateType, unknown, TodoListsActionsType>;