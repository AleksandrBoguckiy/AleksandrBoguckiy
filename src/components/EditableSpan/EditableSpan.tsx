import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import TextField from '@mui/material/TextField';
import s from './EditableSpan.module.css'

type EditableSpanPropsType = {
    titleTdl: string
    changeTitle: (title: string) => void
    disabled: boolean
}
export const EditableSpan: React.FC<EditableSpanPropsType> = React.memo((props) => {

        const {
            titleTdl,
            changeTitle,
            disabled
        } = props

        const [editMode, setEditMode] = useState<boolean>(false);
        const [title, setTitle] = useState<string>(titleTdl)

        const onEditMode = () => setEditMode(true)
        const offEditMode = () => {
            title ? changeTitle(title) : setTitle(titleTdl)
            setEditMode(false)
        }
        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            setTitle(e.currentTarget.value)
        }
        const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                offEditMode();
            }
        }

        return (
            editMode
                ? <TextField value={title}
                             onChange={onChangeHandler}
                             onBlur={offEditMode}
                             onKeyPress={onKeyPressHandler}
                             autoFocus
                             disabled={disabled}/>
                : <>
                    {
                        disabled
                            ? <span onDoubleClick={onEditMode} className={s.disabled}>{titleTdl}</span>
                            : <span onDoubleClick={onEditMode}>{titleTdl}</span>
                    }
                </>

        )
    }
)