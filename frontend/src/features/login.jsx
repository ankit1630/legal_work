import React, { useState } from 'react';

// CSS
import "./../styles/login.css"

// Components
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

export function Login() {
    const [loginState, setLoginState] = useState({
        loginForm: "login"
    });
    const [userState, setUserState] = useState({
        username: "",
        password: "",
        useremail: ""
    });

    const { loginForm } = loginState;

    // login form
    const _renderLoginForm = () => {
        return (
            <>
                <div className="login-header">
                    <h3 style={{color: "purple"}}>Login Form</h3>
                    <div>Login to get started</div>
                </div>
                <div className="useremail">
                    <h4>Useremail</h4>
                    <TextField variant="outlined" label="Username" value={userState.username}/>
                </div>
                <div className="password">
                    <h4>Passowrd</h4>
                    <TextField variant="outlined" label="Password" value={userState.password} type="password" />
                </div>
            </>
        )
    };

    const _renderSignUpElOnLoginPage = () => {
        if (loginForm === "login") {
            return (
                <div className='signup-login-link'>
                    No account? <Button onClick={() => setLoginState({loginForm: "signup"})}>Sign Up</Button>  
                </div>
            )
        }

        return (
            <div className='signup-login-link'>
                Already have account? <Button onClick={() => setLoginState({loginForm: "login"})}>Log In</Button>  
            </div>
        );
    }

    // sign up form
    const _renderSignUpForm = () => {
        return (
            <>
                <div className="login-header">
                    <h3 style={{color: "purple"}}>SignUp Form</h3>
                    <div>Sign up for amazing features</div>
                </div>
                <div className="username">
                    <h4>Name</h4>
                    <TextField variant="outlined" label="Name" value={userState.username}/>
                </div>
                <div className="useremail">
                    <h4>Email</h4>
                    <TextField variant="outlined" label="Email" value={userState.username}/>
                </div>
                <div className="password">
                    <h4>Passowrd</h4>
                    <TextField variant="outlined" label="Password" value={userState.password} type="password" />
                </div>
            </>
        )
    }

    const formEl = loginForm === "login" ? _renderLoginForm() : _renderSignUpForm();
    const btnText = loginForm === "login" ? "Login" : "SignUp";

    console.log(formEl);

    return (
        <div className='login-form'>
            {formEl}
            <Button variant="contained" style={{background: "purple", "margin-top": "20px"}}>{btnText}</Button>
            { _renderSignUpElOnLoginPage()}
        </div>
    );
}
