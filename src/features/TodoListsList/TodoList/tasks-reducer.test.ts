import {
    addTaskAC,
    removeTaskAC,
    tasksReducer,
    TasksStateType,
    updateTaskAC
} from './tasks-reducer';
import {addTodoListAC} from "./todolists-reducer";
import {TaskStatuses} from "../../../api/todoLists-api";

let startState: TasksStateType = {}

beforeEach(() => {
    startState = {
        "todoListId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: 'todoListId1' },
            { id: "2", title: "JS", status: TaskStatuses.New, completed: false, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: 'todoListId1'  },
            { id: "3", title: "React", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: 'todoListId1'  }
        ],
        "todoListId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: 'todoListId2'  },
            { id: "2", title: "milk", status: TaskStatuses.Completed, completed: false, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: 'todoListId2'  },
            { id: "3", title: "tea", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: 'todoListId2'  }
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC("2", "todoListId2");

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todoListId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: 'todoListId1'},
            { id: "2", title: "JS", status: TaskStatuses.New, completed: false, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: 'todoListId1'  },
            { id: "3", title: "React", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: 'todoListId1'}
        ],
        "todoListId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: 'todoListId2'  },
            { id: "3", title: "tea", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: 'todoListId2'  }
        ]
    });
});

test('correct task should be added to correct array', () => {

    const action = addTaskAC({title: 'juice', todoListId: 'todoListId2', order: '', addedDate: '', startDate: '', priority: 0, deadline: '', description: '', completed: true, status: TaskStatuses.Completed, id: '' });

    const endState = tasksReducer(startState, action)

    expect(endState["todoListId1"].length).toBe(3);
    expect(endState["todoListId2"].length).toBe(4);
    expect(endState["todoListId2"][0].id).toBeDefined();
    expect(endState["todoListId2"][0].title).toBe("juice");
    expect(endState["todoListId2"][0].status).toBe(TaskStatuses.Completed);
})

test('status of specified task should be changed', () => {

    const action = updateTaskAC("2", {status: TaskStatuses.Completed}, "todoListId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todoListId2"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todoListId1"][1].status).toBe(TaskStatuses.New);
});

test('title of specified task should be changed', () => {

    const action = updateTaskAC("2", {title: 'BTC'}, "todoListId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todoListId2"][1].title).toBe("BTC");
    expect(endState["todoListId1"][1].title).toBe("JS");
});

test('new array should be added when new todolist is added', () => {

    const action = addTodoListAC({title: 'new todoList', id: 'todoListId3', order: 0, addedDate: ''});

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== "todoListId1" && k !== "todoListId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});







