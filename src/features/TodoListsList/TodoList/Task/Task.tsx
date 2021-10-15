import React, {ChangeEvent, useCallback} from "react";
import s from "../../../../app/App.module.css";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {TaskStatuses} from "../../../../api/todoLists-api";
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import {DomainTaskType} from "../tasks-reducer";

type TaskPropsType = {
    removeTask: (taskID: string, todoListID: string) => void
    changeTaskTitle: (taskID: string, newTitle: string, todoListID: string) => void
    changeTaskStatus: (taskID: string, status: TaskStatuses, todoListID: string) => void
    todoListID: string
    task: DomainTaskType
}
export const Task: React.FC<TaskPropsType> = React.memo((props) => {

    const {
        removeTask,
        changeTaskTitle,
        changeTaskStatus,
        todoListID,
        task,
    } = props

    const onClickHandler = () => removeTask(task.id, todoListID)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New, todoListID)
    }

    const changeTaskTitleHandler = useCallback((title: string) => {
        changeTaskTitle(task.id, title, todoListID)
    }, [changeTaskTitle, task.id, todoListID])

    return (
        <li key={task.id}>
            <IconButton size={'small'}
                        color={'secondary'}
                        onClick={onClickHandler}
                        disabled={task.entityStatus === 'loading'}>
                <Delete fontSize={'small'}/>
            </IconButton>
            <Checkbox checked={props.task.status === TaskStatuses.Completed}
                      onChange={onChangeHandler}
                      size={'small'}
                      color={'primary'}
                      disabled={task.entityStatus === 'loading'}/>
            <span className={task.status === TaskStatuses.Completed ? s.isDone : ''}>
                <EditableSpan titleTdl={task.title}
                              changeTitle={changeTaskTitleHandler}
                              disabled={task.entityStatus === 'loading'}/>
            </span>
        </li>
    )
})