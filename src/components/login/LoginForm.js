import React from 'react';

export default function LoginForm(props) {
    return (
        <div className="fields login">
            <p className="page-section">Log In to Prello</p>
            <form id="form-login" action="/login" method="POST">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" placeholder="e.g email@domain.com" required />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="e.g ********" required />
                <label htmlFor="rememberMe">Remember Me</label>
                <input className="remember-checkbox" name="rememberMe" type="checkbox" /><br />
                <input className="submit-btn" type="submit" value="Log In" />
                <a href="/forgot">I forgot my password!</a>
            </form>
        </div>
    );
}
