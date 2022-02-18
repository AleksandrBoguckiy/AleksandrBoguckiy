import {appReducer, InitialStateType, setAppErrorAC, setAppStatusAC, setIsInitializedAC} from "./app-reducer";

let startState: InitialStateType;

beforeEach(() => {
    startState = {
        status: 'idle',
        error: null,
        isInitialized: false
    }
})
test('status needs to be changed', () => {

    let action = setAppStatusAC({status: 'loading'})
    const endState = appReducer(startState, action)

    expect(endState.status).toBe('loading');
});

test('correct error message should be set', () => {

    let action = setAppErrorAC({error: 'some error'})
    const endState = appReducer(startState, action)

    expect(endState.error).toBe('some error');
});

test('initialization status needs to be changed', () => {

    let action = setIsInitializedAC({isInitialized: true})
    const endState = appReducer(startState, action)

    expect(endState.isInitialized).toBe(true);
});