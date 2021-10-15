import React, {useCallback} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Task} from "./Task/Task";
import {DomainTaskType} from "./tasks-reducer";
import {TaskStatuses} from "../../../api/todoLists-api";
import {FilterValuesType} from "./todolists-reducer";
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {RequestStatusType} from "../../../app/app-reducer";

export type TodoListPropsType = {
    titleTdl: string
    tasks: Array<DomainTaskType>
    changeTodoListFilter: (filterValue: FilterValuesType, todoListID: string) => void
    addTask: (title: string, todoListID: string) => void
    changeTodoListTitle: (newTitle: string, todoListID: string) => void
    removeTask: (taskID: string, todoListID: string) => void
    changeTaskTitle: (taskID: string, newTitle: string, todoListID: string) => void
    changeTaskStatus: (taskID: string, status: TaskStatuses, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
    filter: FilterValuesType
    entityStatus: RequestStatusType
    todoListID: string
}

export const TodoList: React.FC<TodoListPropsType> = React.memo((props) => {

        const {
            titleTdl,
            tasks,
            changeTodoListFilter,
            addTask,
            changeTodoListTitle,
            removeTask,
            changeTaskTitle,
            changeTaskStatus,
            removeTodoList,
            filter,
            entityStatus,
            todoListID,
        } = props

        let tasksForTodolist = tasks

        if (filter === "Active") {
            tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New);
        }
        if (filter === "Completed") {
            tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed);
        }

        const TaskJSXElements = tasksForTodolist.map(t =>
            <Task removeTask={removeTask}
                  changeTaskTitle={changeTaskTitle}
                  changeTaskStatus={changeTaskStatus}
                  todoListID={todoListID}
                  task={t}
                  key={t.id}/>
        )

        const onClickHandlerAll = useCallback(() => {
            changeTodoListFilter("All", todoListID)
        }, [changeTodoListFilter, todoListID])

        const onClickHandlerActive = useCallback(() => {
            changeTodoListFilter("Active", todoListID)
        }, [changeTodoListFilter, todoListID])

        const onClickHandlerCompleted = useCallback(() => {
            changeTodoListFilter("Completed", todoListID)
        }, [changeTodoListFilter, todoListID])

        const onClickHandlerRemoveTodoList = () => {
            removeTodoList(todoListID)
        }

        const addTaskInTodoList = useCallback((title: string) => {
            addTask(title, todoListID)
        }, [addTask, todoListID])

        const changeTodolistTitle = useCallback((title: string) => {
            changeTodoListTitle(title, todoListID)
        }, [changeTodoListTitle, todoListID])

        return (
            <div>
                <h3>
                    <EditableSpan titleTdl={titleTdl} changeTitle={changeTodolistTitle} disabled={entityStatus === 'loading'}/>
                    <IconButton size={'small'}
                                color={'inherit'}
                                onClick={onClickHandlerRemoveTodoList}
                                disabled={entityStatus === 'loading'}>
                        <Delete fontSize={'medium'}/>
                    </IconButton>
                </h3>
                <AddItemForm addItem={addTaskInTodoList} disabled={entityStatus === 'loading'}/>
                <ul style={{listStyle: 'none', paddingLeft: '0'}}>
                    {TaskJSXElements}
                </ul>
                <Button variant={"contained"}
                        size={"small"}
                        color={filter === 'All' ? 'primary' : 'secondary'}
                        onClick={onClickHandlerAll}>All</Button>
                <Button variant={"contained"}
                        size={"small"}
                        color={filter === 'Active' ? 'primary' : 'secondary'}
                        style={{margin: '0 3px'}}
                        onClick={onClickHandlerActive}>Active</Button>
                <Button variant={"contained"}
                        size={"small"}
                        color={filter === 'Completed' ? 'primary' : 'secondary'}
                        onClick={onClickHandlerCompleted}>Completed</Button>
            </div>
        );
    }
)



