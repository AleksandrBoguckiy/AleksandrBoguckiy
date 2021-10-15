import { tasksReducer, TasksStateType } from "./tasks-reducer";
import {addTodoListAC, removeTodoListAC, todoListsReducer} from "./todolists-reducer";
import {TaskStatuses} from "../../../api/todoLists-api";
import {TodoListType} from "../TodoListsList";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodoListsState: Array<TodoListType> = [];

    const action = addTodoListAC({title: 'new todoList', id: 'todoListId2', order: 0, addedDate: ''});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks === idFromTodoLists).toBe(true)
    expect(idFromTasks).toBe(action.todoList.id);
    expect(idFromTodoLists).toBe(action.todoList.id);
});

test('property with todolistId should be deleted', () => {
    const startState: TasksStateType = {
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: '' },
            { id: "2", title: "JS", status: TaskStatuses.Completed, completed: false, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: ''  },
            { id: "3", title: "React", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: ''  }
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: ''  },
            { id: "2", title: "milk", status: TaskStatuses.Completed, completed: false, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: ''  },
            { id: "3", title: "tea", status: TaskStatuses.New, completed: true, description: '', startDate: '', addedDate: '', deadline: '', order: '', priority: 0, todoListId: ''  }
        ]
    };

    const action = removeTodoListAC("todolistId2");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});

