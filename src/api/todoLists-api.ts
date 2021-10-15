import axios from "axios";

const instance = axios.create({
    baseURL: `https://social-network.samuraijs.com/api/1.1/`,
    withCredentials: true,
    headers: {
        'API-KEY': 'e48f586f-eae5-4a76-8ed1-bdd525d79043'
    }
})

// api
export const todoListsAPI = {
    getTodoLists() {
        return instance.get<Array<TodoListType>>(`todo-lists`)
    },
    createTodoList(todoListTitle: string) {
        return instance.post<{ title: string }, { data: ResponseType<{ item: TodoListType }> }>(`todo-lists`, {title: todoListTitle})
    },
    deleteTodoList(todoListId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoListId}`)
    },
    updateTodoList(todoListId: string, todoListTitle: string) {
        return instance.put<{ title: string }, { data: ResponseType }>(`todo-lists/${todoListId}`, {title: todoListTitle})
    },
    getTasks(todoListId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todoListId}/tasks`)
    },
    createTask(todoListId: string, taskTitle: string) {
        return instance.post<{ title: string }, { data: ResponseType<{ item: TaskType }> }>(`todo-lists/${todoListId}/tasks`, {title: taskTitle})
    },
    deleteTask(todoListId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoListId}/tasks/${taskId}`)
    },
    updateTask(todoListId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<UpdateTaskModelType, { data: ResponseType<{ item: TaskType }> }>(`todo-lists/${todoListId}/tasks/${taskId}`, model)
    }
}

export const authAPI = {
    me() {
        return instance.get<ResponseType<{ data: MeParamsType }>>('auth/me')
    },
    login({ email, password, rememberMe, captcha }: LoginParamsType) {
        return instance.post<LoginParamsType, { data: ResponseType<{ userId: string}> }>('/auth/login', {email, password, rememberMe, captcha})
    },
    logout() {
        return instance.delete<ResponseType>('auth/login')
    }
}

// types
export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}
export type MeParamsType = {
    id: number
    email: string
    login: string
}
export type TodoListType = {
    id: string
    addedDate?: string
    order?: number
    title: string
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    data: D
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: string
    addedDate: string
}


type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}