import React from 'react';
import ReactDOM from 'react-dom';

import Navbar from './components/login/Navbar';
import RegistrationForm from './components/login/RegistrationForm';
import LoginForm from './components/login/LoginForm'

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            notice: '',
        }
    }

    componentDidMount() {
        if (NOTICE) {
            this.setState({ notice: NOTICE });
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

ReactDOM.render(<Login />, document.getElementById('app'));