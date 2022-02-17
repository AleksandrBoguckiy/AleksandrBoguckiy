import {Dispatch} from "redux";
import {todoListsAPI, TodoListType} from "../../../api/todoLists-api";
import {RequestStatusType, setAppStatusAC} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {fetchTasksTC} from "./tasks-reducer";
import {ThunkAction} from "redux-thunk";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodoListDomainType> = []


const slice = createSlice({
        name: 'todoLists',
        initialState,
        reducers: {
            removeTodoListAC: (state, action: PayloadAction<{ todoListID: string }>) => {
                const index = state.findIndex(tdl => tdl.id === action.payload.todoListID)
                if (index > -1) {
                    state.splice(index, 1)
                }
            },
            addTodoListAC: (state, action: PayloadAction<{ todoList: TodoListType }>) => {
                state.unshift({...action.payload.todoList, filter: "All", entityStatus: 'idle'})
            },
            changeTodolistFilterAC: (state, action: PayloadAction<{ filterValue: FilterValuesType, todoListID: string }>) => {
                const index = state.findIndex(tdl => tdl.id === action.payload.todoListID)
                state[index].filter = action.payload.filterValue
            },
            changeTodoListTitleAC: (state, action: PayloadAction<{ newTitle: string, todoListID: string }>) => {
                const index = state.findIndex(tdl => tdl.id === action.payload.todoListID)
                state[index].title = action.payload.newTitle
            },
            setTodoListsAC: (state, action: PayloadAction<{ todoLists: Array<TodoListType> }>) => {
                return action.payload.todoLists.map(tdl => ({...tdl, filter: "All", entityStatus: 'idle'}))
            },
            changeTodoListEntityStatusAC: (state, action: PayloadAction<{ todoListID: string, entityStatus: RequestStatusType }>) => {
                const index = state.findIndex(tdl => tdl.id === action.payload.todoListID)
                state[index].entityStatus = action.payload.entityStatus
            },
            clearTodoListsDataAC: (state) => {
                state.length = 0
            }
        }
    }
)
export const todoListsReducer = slice.reducer
export const {
    removeTodoListAC,
    addTodoListAC,
    changeTodolistFilterAC,
    changeTodoListTitleAC,
    setTodoListsAC,
    changeTodoListEntityStatusAC,
    clearTodoListsDataAC
} = slice.actions

// thunks
export const fetchTodoListsTC = (): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading',}))
    todoListsAPI.getTodoLists()
        .then((res) => {
            dispatch(setTodoListsAC({todoLists: res.data}))
            dispatch(setAppStatusAC({status: "succeeded"}))
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
export const addTodoListTC = (todoListTitle: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todoListsAPI.createTodoList(todoListTitle)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodoListAC({todoList: res.data.data.item}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError<{ item: TodoListType }>(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTodoListTC = (todoListID: string) => (dispatch: Dispatch) => {
    dispatch(changeTodoListEntityStatusAC({todoListID: todoListID, entityStatus: 'loading'}))
    dispatch(setAppStatusAC({status: "loading"}))
    todoListsAPI.deleteTodoList(todoListID)
        .then(() => {
            dispatch(removeTodoListAC({todoListID: todoListID}))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const changeTodoListTitleTC = (todoListID: string, todoListTitle: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todoListsAPI.updateTodoList(todoListID, todoListTitle)
        .then(() => {
            dispatch(changeTodoListTitleAC({newTitle: todoListTitle, todoListID: todoListID}))
            dispatch(setAppStatusAC({status: "succeeded"}))
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
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>
export type ClearTodoListsDataActionType = ReturnType<typeof clearTodoListsDataAC>

type ThunkType = ThunkAction<any, any, any, any>;