import React from 'react';

import Navbar from './components/login/Navbar';
import RegistrationForm from './components/login/RegistrationForm';
import LoginForm from './components/login/LoginForm'

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            notice: '',
        }
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
                    <RegistrationForm />
                    <LoginForm />
                </div>
            </div>
        );
    }
}