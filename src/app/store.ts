import {applyMiddleware, combineReducers, createStore} from "redux";
import {tasksReducer} from "../features/TodoListsList/TodoList/tasks-reducer";
import {todoListsReducer} from "../features/TodoListsList/TodoList/todolists-reducer";
import thunk from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";

export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

// @ts-ignore
window.store = store;