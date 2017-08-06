import React from 'react';
import { Redirect } from 'react-router-dom';

import Navbar from './components/login/Navbar';
import RegistrationForm from './components/login/RegistrationForm';
import LoginForm from './components/login/LoginForm'

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            notice: '',
        }

        // API information
        this.port = 3000;
        this.host = `http://localhost:${this.port}/api/auth`

        this.handleNotice = this.handleNotice.bind(this);
    }

    handleNotice(notice) {
        this.setState({ notice });
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="page-container">
                    {this.state.notice &&
                        <div id="notice">
                            {this.state.notice}
                        </div>
                    }
                    <RegistrationForm
                        host={this.host}
                        onNotice={this.handleNotice}
                        onLogin={this.props.onLogin}
                    />
                    <LoginForm
                        host={this.host}
                        onNotice={this.handleNotice}
                        onLogin={this.props.onLogin}
                    />
                </div>
            </div>
        );
    }
}