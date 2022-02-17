import {
    addTaskAC,
    changeTaskEntityStatusAC,
    removeTaskAC,
    setTasksAC,
    tasksReducer,
    TasksStateType,
    updateTaskAC
} from './tasks-reducer';
import {addTodoListAC, removeTodoListAC, setTodoListsAC} from "./todolists-reducer";
import {TaskStatuses} from "../../../api/todoLists-api";
import {RequestStatusType} from "../../../app/app-reducer";

let startState: TasksStateType = {}

beforeEach(() => {
    startState = {
        "todoListId1": [
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
                todoListId: 'todoListId1',
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.New,
                completed: false,
                description: '',
                startDate: '',
                addedDate: '',
                deadline: '',
                order: '',
                priority: 0,
                todoListId: 'todoListId1',
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
                todoListId: 'todoListId1',
                entityStatus: "idle"
            }
        ],
        "todoListId2": [
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
                todoListId: 'todoListId2',
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
                todoListId: 'todoListId2',
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
                todoListId: 'todoListId2',
                entityStatus: "idle"
            }
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC({taskId: "2", todoListID: "todoListId2"});
    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todoListId1": [
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
                todoListId: 'todoListId1',
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.New,
                completed: false,
                description: '',
                startDate: '',
                addedDate: '',
                deadline: '',
                order: '',
                priority: 0,
                todoListId: 'todoListId1',
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
                todoListId: 'todoListId1',
                entityStatus: "idle"
            }
        ],
        "todoListId2": [
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
                todoListId: 'todoListId2',
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
                todoListId: 'todoListId2',
                entityStatus: "idle"
            }
        ]
    });
});

test('correct task should be added to correct array', () => {

    const action = addTaskAC({task: {
        title: 'juice',
        todoListId: 'todoListId2',
        order: '',
        addedDate: '',
        startDate: '',
        priority: 0,
        deadline: '',
        description: '',
        completed: true,
        status: TaskStatuses.Completed,
        id: '',
    }});
    const endState = tasksReducer(startState, action)

    expect(endState["todoListId1"].length).toBe(3);
    expect(endState["todoListId2"].length).toBe(4);
    expect(endState["todoListId2"][0].id).toBeDefined();
    expect(endState["todoListId2"][0].title).toBe("juice");
    expect(endState["todoListId2"][0].status).toBe(TaskStatuses.Completed);
})

test('status of specified task should be changed', () => {

    const action = updateTaskAC({taskId: "2", model: {status: TaskStatuses.Completed}, todoListID: "todoListId2"});
    const endState = tasksReducer(startState, action)

    expect(endState["todoListId2"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todoListId1"][1].status).toBe(TaskStatuses.New);
});

test('title of specified task should be changed', () => {

    const action = updateTaskAC({taskId: "2", model: {title: 'BTC'}, todoListID: "todoListId2"});
    const endState = tasksReducer(startState, action)

    expect(endState["todoListId2"][1].title).toBe("BTC");
    expect(endState["todoListId1"][1].title).toBe("JS");
});

test('new array should be added when new todolist is added', () => {

    const action = addTodoListAC({todoList: {title: 'new todoList', id: 'todoListId3', order: 0, addedDate: ''}}  );
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== "todoListId1" && k !== "todoListId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {
    const action = removeTodoListAC({todoListID: 'todoListId2'})
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);

    expect(keys.length).toBe(1)
    expect(endState['todoListId2']).not.toBeDefined()
})

test('empty arrays should be added when we set todolists', () => {
    const action = setTodoListsAC({todoLists: [
        {id: '1', title: 'title 1', order: 0, addedDate: ''},
        {id: '2', title: 'title 2', order: 0, addedDate: ''}
    ]})
    const endState = tasksReducer({}, action)
    const keys = Object.keys(endState);

    expect(keys.length).toBe(2)
    expect(endState['1']).toBeDefined()
    expect(endState['2']).toBeDefined()
})

test('tasks should be added for todolist', () => {
    const action = setTasksAC({tasks: startState['todoListId1'], todoListID: 'todoListId1'})
    const endState = tasksReducer({
        'todoListId2': [],
        'todoListId1': []
    }, action)

    expect(endState['todoListId1'].length).toBe(3)
    expect(endState['todoListId2'].length).toBe(0)
})

test('correct entity status of task should be changed', () => {

    let newStatus: RequestStatusType = 'loading'
    const action = changeTaskEntityStatusAC({taskId: '1', todoListID: 'todoListId1', entityStatus: newStatus})
    const endState = tasksReducer(startState, action)

    expect(endState['todoListId2'][0].entityStatus).toBe('idle')
    expect(endState['todoListId1'][0].entityStatus).toBe(newStatus)
});







