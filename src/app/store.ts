import {combineReducers} from "redux";
import {tasksReducer} from "../features/TodoListsList/TodoList/tasks-reducer";
import {todoListsReducer} from "../features/TodoListsList/TodoList/todolists-reducer";
import thunk from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore} from '@reduxjs/toolkit'

export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
})

//создаем store с помощью configureStore (ReduxToolkit)
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})

// @ts-ignore
window.store = store;