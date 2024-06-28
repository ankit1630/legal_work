import React, { useState } from 'react';

// CSS
import "./../styles/login.css"

// Components
import TextField from '@mui/material/TextField';

export function Login() {
    const [loginState, setLoginState] = useState({
        loginForm: "login"
    });
    const [userState, setUserState] = useState({
        username: "",
        password: ""
    });

    // login form
    const _renderLoginForm = () => {
        return (
            <>
                <div className="login-header">
                    <h3 style={{color: "purple"}}>Login Form</h3>
                    <div>Login to get started</div>
                </div>
                <div className="username">
                    <h4>Username</h4>
                    <TextField variant="outlined" label="Username" value={userState.username}/>
                </div>
                <div className="password">
                    <h4>Passowrd</h4>
                    <TextField variant="outlined" label="Password" value={userState.password} type="password" />
                </div>
            </>
        )
    };

    // sign up form
    const _renderSignUpForm = () => {
        return null;
    }

    const { loginForm } = loginState;
    const formEl = loginForm === "login" ? _renderLoginForm() : _renderSignUpForm();

    return (
        <div className='login-form'>
            {formEl}
        </div>
    );
}
