import React, {useCallback, useEffect} from 'react';
import s from './App.module.css';
import {TodoListsList} from "../features/TodoListsList/TodoListsList";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {initializeAppTC, RequestStatusType} from './app-reducer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import pink from '@mui/material/colors/pink';
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {BrowserRouter, HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {Login} from "../features/Login/Login";
import CircularProgress from '@mui/material/CircularProgress';
import {logoutTC} from "../features/Login/auth-reducer";

const theme = createTheme({
    palette: {
        secondary: pink,
    },
});

function App() {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [dispatch])

    const logoutHandler = useCallback(() => {
        dispatch(logoutTC())
    }, [dispatch])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <HashRouter>
            <div className={s.app}>
                <ErrorSnackbar/>
                <ThemeProvider theme={theme}>
                    <AppBar position="static">
                        <Toolbar style={{justifyContent: 'space-between'}}>
                            <IconButton edge="start" color="inherit" aria-label="menu">
                                <Menu/>
                            </IconButton>
                            <Typography variant="h6">
                                TodoLists
                            </Typography>
                            { isLoggedIn && <Button variant={"outlined"}
                                                   color="inherit"
                                                   onClick={logoutHandler}>Logout</Button> }
                        </Toolbar>
                        {status === 'loading' && <LinearProgress
                            color="secondary"/>}
                    </AppBar>
                    <Container fixed>
                        <Switch>
                            <Route exact path={'/'} render={() => <TodoListsList/>}/>
                            <Route path={'/login'} render={() => <Login/>}/>
                            <Route path={'/404'}
                                   render={() => <h1 style={{textAlign: "center"}}>404: PAGE NOT FOUND</h1>}/>
                            <Redirect from={'*'} to={'/404'}/>
                        </Switch>
                    </Container>
                </ThemeProvider>
            </div>
        </HashRouter>
    );
}

export default App;

