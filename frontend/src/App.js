import React, { useEffect, useState } from 'react';
import './App.css';
import { Login } from './features/login';

function App() {
  const [appState, setAppState] = useState({
    isUserLoggedIn: false,
    userInfo: {
      name: "",
      email: ""
    }
  });
  const [compIsReady, setCompIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    let storedUserInfo;

    try {
      storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || "{}");
    } catch {
      storedUserInfo = {};
    }

    if (token && storedUserInfo?.username && storedUserInfo?.useremail) {
      setAppState({
        isUserLoggedIn: true,
        userInfo: {
          name: storedUserInfo.username,
          email: storedUserInfo.useremail
        }
      });
    }

    setCompIsReady(true);
  }, []);

  const _handleUserLogin = (token, username, useremail) => {
    localStorage.token = token;
    localStorage.userInfo = JSON.stringify({
      username,
      useremail
    });

    setAppState({
      isUserLoggedIn: true,
      userInfo: {
        name: username,
        email: useremail
      }
    });
  }

  const { isUserLoggedIn } = appState;
  const componentToRender = isUserLoggedIn ? <p>User {appState.userInfo.name} is logged in!!</p> : <Login onUserLogin={_handleUserLogin} />

  if (!compIsReady) return null;

  return (
    <div className="App">
      {componentToRender}
    </div>
  );
}

export default App;
