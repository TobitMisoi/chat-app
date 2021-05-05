import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React, { FC } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Login from '../../components/features/Login/Login';
import Signup from '../../components/features/signup';
import Welcome from '../../components/features/welcome';


type Props = {};

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark'
    }
});

const AuthView: FC<Props> = props => {
    return (
        <ThemeProvider theme={darkTheme}>
            <Router>
                <Switch>
                    <Route path="/login" exact component={Login} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/" exact component={Welcome} />
                    <Redirect to="/" />
                </Switch>
            </Router>
        </ThemeProvider>
    )
}

export default AuthView;