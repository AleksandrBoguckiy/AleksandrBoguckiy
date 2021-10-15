import {
    addTodoListTC,
    changeTodolistFilterAC,
    changeTodoListTitleTC,
    fetchTodoListsTC,
    FilterValuesType,
    removeTodoListTC, TodoListDomainType
} from "./TodoList/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {addTaskTC, removeTaskTC, TasksStateType, updateTaskTC} from "./TodoList/tasks-reducer";
import React, {useCallback, useEffect} from "react";
import {TaskStatuses} from "../../api/todoLists-api";
import {TodoList} from "./TodoList/TodoList";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Redirect} from "react-router-dom";

export const TodoListsList = () => {

    const todoLists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useDispatch()

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        dispatch(fetchTodoListsTC())
    }, [dispatch, isLoggedIn])

    const removeTask = useCallback((taskID: string, todoListID: string) => {
        dispatch(removeTaskTC(todoListID, taskID))
    }, [dispatch])

    const addTask = useCallback((title: string, todoListID: string) => {
        dispatch(addTaskTC(todoListID, title))
    }, [dispatch])

    const changeTaskStatus = useCallback((taskID: string, status: TaskStatuses, todoListID: string) => {
        dispatch(updateTaskTC(todoListID, taskID, {status}))
    }, [dispatch])

    const changeTaskTitle = useCallback((taskID: string, newTitle: string, todoListID: string) => {
        dispatch(updateTaskTC(todoListID, taskID, {title: newTitle}))
    }, [dispatch])

    const removeTodoList = useCallback((todoListID: string) => {
        dispatch(removeTodoListTC(todoListID))
    }, [dispatch])

    const addTodoList = useCallback((newTitle: string) => {
        dispatch(addTodoListTC(newTitle))
    }, [dispatch])

    const changeTodoListFilter = useCallback((filterValue: FilterValuesType, todoListID: string) => {
        dispatch(changeTodolistFilterAC(filterValue, todoListID))
    }, [dispatch])

    const changeTodoListTitle = useCallback((newTitle: string, todoListID: string) => {
        dispatch(changeTodoListTitleTC(todoListID, newTitle))
    }, [dispatch])

    const todoListsComponents = todoLists.map(tdl => {

        let tasksForTodolist = tasks[tdl.id];

        return (
            <Grid item key={tdl.id}>
                <Paper style={{padding: '20px'}} elevation={5}>
                    <TodoList
                        key={tdl.id}
                        todoListID={tdl.id}
                        titleTdl={tdl.title}
                        filter={tdl.filter}
                        entityStatus={tdl.entityStatus}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeTodoListFilter={changeTodoListFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodoList={removeTodoList}
                        changeTodoListTitle={changeTodoListTitle}
                        changeTaskTitle={changeTaskTitle}
                    />
                </Paper>
            </Grid>
        )
    })

    if (!isLoggedIn) {
        return <Redirect to={'login'} />
    }

    return (
        <>
            <Grid container style={{padding: '20px 0'}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container spacing={5}>
                {todoListsComponents}
            </Grid>
        </>
    )
}

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}