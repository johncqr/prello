import $ from 'jquery';
import React from 'react';

export default class RegistrationForm extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    handlePasswordConfirmChange(e) {
        this.setState({ passwordConfirm: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.password != this.state.passwordConfirm) {
            this.props.onNotice('Passwords do not match!');
        } else {
            $.ajax({
                url: `${this.props.host}/register`,
                data: {
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password,
                },
                type: 'POST',
                dataType: 'json',
            }).done((json) => {
                if (!json.username) {
                    this.props.onNotice(json.notice);
                    this.setState({
                        username: '',
                        email: '',
                        password: '',
                        passwordConfirm: '',
                    });
                } else {
                    this.props.onLogin(json.username);
                }
            });
        }
        return false;
    }

    render() {
        return (
            <div className="fields registration">
                <p className="page-section">Create a New Prello Account</p>
                <form id="form-registration" onSubmit={this.handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" placeholder="e.g FirstnameLastname" required 
                            value={this.state.username}
                            onChange={this.handleUsernameChange}
                    />
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="e.g email@domain.com" required
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                    />
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" placeholder="e.g ********" required
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                    />
                    <label htmlFor="passwordConfirm">Confirm Password</label>
                    <input id="password-confirm" type="password" name="passwordConfirm" placeholder="Confirm Password" required
                            value={this.state.passwordConfirm}
                            onChange={this.handlePasswordConfirmChange}
                    />
                    <input className="submit-btn" type="submit" value="Create New Account" />
                </form>
            </div>
        );
    }
}
