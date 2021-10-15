import {Dispatch} from "redux";
import {authAPI} from "../api/todoLists-api";
import {setIsLoggedInAC, SetISLoggedInActionType} from "../features/Login/auth-reducer";

const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, status: action.status};
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        case "APP/SET-APP-INITIALIZED":
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setIsInitializedAC = (value: boolean) => ({type: 'APP/SET-APP-INITIALIZED', value} as const)

export const initializeAppTC = () => (dispatch: Dispatch<ActionsType>) => {
    authAPI.me()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
            }
            dispatch(setIsInitializedAC(true))
        })
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = typeof initialState

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
type ActionsType =
    | SetAppStatusActionType
    | SetAppErrorActionType
    | SetISLoggedInActionType
    | ReturnType<typeof setIsInitializedAC>