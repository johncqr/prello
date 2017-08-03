import React from 'react';

export default function RegistrationForm(props) {
    return (
        <div className="fields registration">
            <p className="page-section">Create a New Prello Account</p>
            <form id="form-registration" action="/register" method="POST">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" placeholder="e.g FirstnameLastname" required />
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="e.g email@domain.com" required />
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" placeholder="e.g ********" required />
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input id="password-confirm" type="password" name="passwordConfirm" placeholder="Confirm Password" required />
                <input className="submit-btn" type="submit" value="Create New Account" />
            </form>
        </div>
    );
}
