import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import {PostAdd} from "@mui/icons-material";

type AddItemFormPropsType = {
    addItem: (newTaskTitle: string) => void
    disabled?: boolean
}
export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo((props) => {

    const {
        addItem,
        disabled
    } = props

        const [newTaskTitle, setNewTaskTitle] = useState("")
        const [error, setError] = useState<string | null>(null)

        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            setNewTaskTitle(e.currentTarget.value)
        }

        const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (error !== null) {
                setError(null)
            }
            if (e.key === 'Enter') {
                onClickHandler()
            }
        }

        const onClickHandler = () => {
            if (newTaskTitle.trim() !== '') {
                addItem(newTaskTitle.trim())
                setNewTaskTitle('')
            } else {
                setError('Title is required')
            }
        }

        return (
            <div>
                <TextField value={newTaskTitle}
                           onChange={onChangeHandler}
                           onKeyPress={onKeyPressHandler}
                           variant={'outlined'}
                           size={'small'}
                           error={!!error}
                           helperText={error && 'Title is required'}
                           label={'Title'}
                           disabled={disabled}/>
                <IconButton size={'small'}
                            color={'primary'}
                            onClick={onClickHandler}
                            disabled={disabled}>
                    <PostAdd fontSize={'large'}/>
                </IconButton>
            </div>
        )
    }
)