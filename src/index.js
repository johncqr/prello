import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Login from './Login';
import Boards from './Boards';

const PORT = 3000;
const HOST = `http://localhost:${PORT}/api/auth`;

let authState = {
    username: '',
};

const LoginRoute = (props) => {
    console.log(authState);    
    return (
    <Route path={'/login'} render={() => (
        authState.username ? (
            <Redirect to='/' />
        ) : (
            <Login {...props} />
            )
    )} />
)
};

const BoardsRoute = (props) => {
    console.log(authState);
    return (
    <Route path={'/'} render={() => (
        authState.username ? (
            <Boards username={authState.username} {...props} />
        ) : (
                <Redirect to='/login' />
            )
    )} />
)};



class Prello extends React.Component {
    constructor() {
        super();
        this.state = {
            authUpdated: false,
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentWillMount() {
        $.ajax({
            url: HOST,
            type: 'GET',
            dataType: 'json',
        }).done(({ username }) => {
            authState.username = username;
            this.setState({ authUpdated: true });
        });
    }

    handleLogin(username) {
        if (username) {
            authState.username = username;
            this.setState({ authUpdated: true });
        }
    }

    handleLogout() {
        $.ajax({
            url: `${HOST}/logout`,
            type: 'GET',
            dataType: 'json',
        }).done(({ notice }) => {
                if (notice) {
                    authState.username = '';
                    this.setState({ authUpdated: true });
                }
            })
    }

    render() {
        return (
            <Router>
                <div>
                    <BoardsRoute
                        onLogout={this.handleLogout}
                    />
                    <LoginRoute
                        onLogin={this.handleLogin}
                    />
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<Prello />, document.getElementById('app'));