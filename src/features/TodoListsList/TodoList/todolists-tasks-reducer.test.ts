import {tasksReducer, TasksStateType} from "./tasks-reducer";
import {addTodoListAC, removeTodoListAC, TodoListDomainType, todoListsReducer} from "./todolists-reducer";
import {TaskStatuses} from "../../../api/todoLists-api";

test('ids should be equals', () => {

    const startTasksState: TasksStateType = {};
    const startTodoListsState: Array<TodoListDomainType> = [];
    const action = addTodoListAC({todoList: {title: 'new todoList', id: 'todoListId2', order: 0, addedDate: ''}});
    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)
    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks === idFromTodoLists).toBe(true)
    expect(idFromTasks).toBe(action.payload.todoList.id);
    expect(idFromTodoLists).toBe(action.payload.todoList.id);
});

test('property with todolistId should be deleted', () => {

    const startState: TasksStateType = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                completed: true,
                description: '',
                startDate: '',
                addedDate: '',
                deadline: '',
                order: '',
                priority: 0,
                todoListId: '',
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                completed: false,
                description: '',
                startDate: '',
                addedDate: '',
                deadline: '',
                order: '',
                priority: 0,
                todoListId: '',
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                completed: true,
                description: '',
                startDate: '',
                addedDate: '',
                deadline: '',
                order: '',
                priority: 0,
                todoListId: '',
                entityStatus: "idle"
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                completed: true,
                description: '',
                startDate: '',
                addedDate: '',
                deadline: '',
                order: '',
                priority: 0,
                todoListId: '',
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "milk",
                status: TaskStatuses.Completed,
                completed: false,
                description: '',
                startDate: '',
                addedDate: '',
                deadline: '',
                order: '',
                priority: 0,
                todoListId: '',
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                completed: true,
                description: '',
                startDate: '',
                addedDate: '',
                deadline: '',
                order: '',
                priority: 0,
                todoListId: '',
                entityStatus: "idle"
            }
        ]
    };
    const action = removeTodoListAC({todoListID: "todolistId2"});
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});

