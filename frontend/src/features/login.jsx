import React, { useState } from 'react';
import axios from 'axios';

// CSS
import "./../styles/login.css"

// Components
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

export function Login(props) {
    const [loginState, setLoginState] = useState({
        loginForm: "login",
        signupOrLoginIsInProgress: false,
        formError: ""
    });
    const [userState, setUserState] = useState({
        username: "",
        password: "",
        useremail: ""
    });

    const { loginForm, signupOrLoginIsInProgress, formError } = loginState;
    const { useremail, username, password } = userState;
    const loginBtnIsDisabled = signupOrLoginIsInProgress || !(useremail && password);
    const signinBtnIsDisabled = signupOrLoginIsInProgress || !(useremail && password && username);

    // event handlers
    const _onTextFieldChange = (field, ev) => {
        setUserState({
            ...userState,
            [field]: ev.target.value
        })
    };

    const _onFormTypeChange = (formType) => {
        setLoginState({
            signupOrLoginIsInProgress: false,
            formError: "",
            loginForm: formType
        });
        
        // reset form
        setUserState({
            username: "",
            password: "",
            useremail: ""
        });
    };

    const _handleLoginOrSignIn = () => {
        setLoginState({
            ...loginState,
            signupOrLoginIsInProgress: true,
            formError: ""
        });

        if (loginForm === "login") {
            axios.get("/api/login", {
                params: {
                    useremail,
                    password,
                    token: window.localStorage.token
                }
            })
            .then((response) => {
                const {token, username, useremail} = response.data;
                props.onUserLogin(token, username, useremail)
            })
            .catch((error) => {
                setLoginState({
                    ...loginState,
                    signupOrLoginIsInProgress: false,
                    formError: error.response.data.error_msg
                });
            });
        } else {
            axios.post("/api/login/signup", {
                useremail,
                username,
                password
            })
            .then((response) => {
                props.onUserLogin(response.data.token, username, useremail)
            })
            .catch((error) => {
                setLoginState({
                    ...loginState,
                    signupOrLoginIsInProgress: false,
                    formError: error.response.data.error_msg
                });
            });
        }
    }

    // rendering methods

    // login form
    const _renderLoginForm = () => {
        const errorMsgEl = !!formError ? <p style={{color: "red"}}>{formError}</p> : null;

        return (
            <>
                <div className="login-header">
                    <h3 style={{color: "purple"}}>Login Form</h3>
                    <div>Login to get started</div>
                    {errorMsgEl}
                </div>
                <div className="useremail">
                    <h4>Useremail</h4>
                    <TextField variant="outlined" label="Useremail" value={userState.useremail}  onChange={(ev) => _onTextFieldChange("useremail", ev)} />
                </div>
                <div className="password">
                    <h4>Password</h4>
                    <TextField variant="outlined" label="Password" value={userState.password} type="password" onChange={(ev) => _onTextFieldChange("password", ev)} />
                </div>
            </>
        );
    };

    // sign up form
    const _renderSignUpForm = () => {
        const errorMsgEl = !!formError ? <p style={{color: "red"}}>{formError}</p> : null;
 
        return (
            <>
                <div className="login-header">
                    <h3 style={{color: "purple"}}>SignUp Form</h3>
                    <div>Sign up for amazing features</div>
                    {errorMsgEl}
                </div>
                <div className="username">
                    <h4>Name</h4>
                    <TextField variant="outlined" label="Name" value={userState.username} onChange={(ev) => _onTextFieldChange("username", ev)} />
                </div>
                <div className="useremail">
                    <h4>Email</h4>
                    <TextField variant="outlined" label="Email" value={userState.useremail} onChange={(ev) => _onTextFieldChange("useremail", ev)} />
                </div>
                <div className="password">
                    <h4>Password</h4>
                    <TextField variant="outlined" label="Password" value={userState.password} type="password"  onChange={(ev) => _onTextFieldChange("password", ev)} />
                </div>
            </>
        );
    };

    const _renderSignUpElOnLoginPage = () => {
        if (loginForm === "login") {
            return (
                <div className='signup-login-link'>
                    No account? <Button onClick={() => _onFormTypeChange("signup")}>Sign Up</Button>  
                </div>
            );
        }

        return (
            <div className='signup-login-link'>
                Already have account? <Button onClick={() => _onFormTypeChange("login")}>Log In</Button>  
            </div>
        );
    };

    let formEl, btnText, btnIsDisabled;
    
    if (loginForm === "login") {
        formEl = _renderLoginForm();
        btnText = "Login";
        btnIsDisabled = loginBtnIsDisabled;
    } else {
        formEl = _renderSignUpForm();
        btnText = "SignUp";
        btnIsDisabled = signinBtnIsDisabled;
    }

    return (
        <div className='login-form'>
            {formEl}
            <Button 
                variant="contained"
                style={{background: "purple", "margin-top": "20px"}}
                disabled={btnIsDisabled}
                onClick={_handleLoginOrSignIn}
            >
                    {btnText}
            </Button>
            { _renderSignUpElOnLoginPage()}
        </div>
    );
}
