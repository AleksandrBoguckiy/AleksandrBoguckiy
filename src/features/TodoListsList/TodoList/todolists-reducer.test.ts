import {
    addTodoListAC, changeTodoListEntityStatusAC,
    changeTodolistFilterAC,
    changeTodoListTitleAC,
    clearTodoListsDataAC,
    FilterValuesType,
    removeTodoListAC, setTodoListsAC,
    TodoListDomainType,
    todoListsReducer
} from './todolists-reducer';
import {v1} from 'uuid';
import {RequestStatusType} from "../../../app/app-reducer";

let todolistId1: string
let todolistId2: string
let startState: Array<TodoListDomainType> = []

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: "What to learn", filter: "All", entityStatus: "idle"},
        {id: todolistId2, title: "What to buy", filter: "All", entityStatus: "idle"}
    ]
})
test('correct todolist should be removed', () => {

    const endState = todoListsReducer(startState, removeTodoListAC({todoListID: todolistId1}))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todoList should be added', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todoListsReducer(startState, addTodoListAC({todoList: {title: newTodolistTitle, id: 'todoListId2', order: 0, addedDate: ''}}))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
});

test('correct filter of todoList should be changed', () => {

    let newFilter: FilterValuesType = "Completed";

    const endState = todoListsReducer(startState, changeTodolistFilterAC({filterValue: newFilter, todoListID: todolistId2}));

    expect(endState[0].filter).toBe("All");
    expect(endState[1].filter).toBe(newFilter);
});

test('correct todoList should change its name', () => {

    let newTodolistTitle = "New Todolist";
    const action = changeTodoListTitleAC({newTitle: newTodolistTitle, todoListID: todolistId2})
    const endState = todoListsReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('todoList should should be added', () => {

    const action = setTodoListsAC({todoLists: startState})
    const endState = todoListsReducer([], action)

    expect(endState.length).toBe(2)
});

test('correct entity status of todoList should be changed', () => {

    let newStatus: RequestStatusType = 'loading'
    const action = changeTodoListEntityStatusAC({todoListID: todolistId2, entityStatus: newStatus})
    const endState = todoListsReducer(startState, action)

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe(newStatus)
});

test('todoLists data should be cleared', () => {

    const action = clearTodoListsDataAC()
    let endState = todoListsReducer(startState, action)

    expect(endState.length).toBe(0)
});

