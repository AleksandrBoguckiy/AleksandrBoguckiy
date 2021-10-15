import {
    addTodoListAC,
    changeTodolistFilterAC,
    changeTodoListTitleAC,
    FilterValuesType,
    removeTodoListAC,
    todoListsReducer
} from './todolists-reducer';
import {v1} from 'uuid';
import {TodoListType} from "../TodoListsList";

let todolistId1: string
let todolistId2: string
let startState: Array<TodoListType> = []

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: "What to learn", filter: "All"},
        {id: todolistId2, title: "What to buy", filter: "All"}
    ]
})
test('correct todolist should be removed', () => {

    const endState = todoListsReducer(startState, removeTodoListAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todoListsReducer(startState, addTodoListAC({title: newTodolistTitle, id: 'todoListId2', order: 0, addedDate: ''}))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "Completed";

    const endState = todoListsReducer(startState, changeTodolistFilterAC(newFilter, todolistId2));

    expect(endState[0].filter).toBe("All");
    expect(endState[1].filter).toBe(newFilter);
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todoListsReducer(startState, changeTodoListTitleAC(newTodolistTitle, todolistId2));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});






