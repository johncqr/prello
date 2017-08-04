import $ from 'jquery';
import React from 'react';

export default class LoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit =this.handleSubmit.bind(this);
    }

    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    handleSubmit(e) {
        $.ajax({
            url: `${this.props.host}/login`,
            data: {
                email: this.state.email,
                password: this.state.password,
            },
            type: 'POST',
            dataType: 'json',
        }).done((json) => {
           if (!json.username) {
               this.props.onNotice(json.notice);
               this.setState({
                   email: '',
                   password: '',
               });
           } else {
               this.props.onLogin(json.username);
           }
        });
        e.preventDefault();
        return false;
    }

    render() {
        return (
            <div className="fields login">
                <p className="page-section">Log In to Prello</p>
                <form id="form-login" onSubmit={this.handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" placeholder="e.g email@domain.com" required 
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                    />
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" placeholder="e.g ********" required 
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                    />
                    <label htmlFor="rememberMe">Remember Me</label>
                    <input className="remember-checkbox" name="rememberMe" type="checkbox" /><br />
                    <input className="submit-btn" type="submit" value="Log In"/>
                    <a href="/forgot">I forgot my password!</a>
                </form>
            </div>
        );
    }
}
