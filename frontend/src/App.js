import React, { useEffect, useState } from 'react';
import './App.css';
import { Login } from './features/login';
import { AppBar } from './features/appBar';
import { Rag } from './features/rag/rag';
import { Provider } from 'react-redux';
import { store } from './app/store';

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
  };

  const _handleUserLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    setAppState({
      isUserLoggedIn: false,
      userInfo: {
        name: "",
        email: ""
      }
    })
  };

  const _renderDashboard = () => {
    return (
      <div className='app-dashboard'>
        <AppBar userInfo={appState.userInfo} onUserLogout={_handleUserLogout}/>
        <Provider store={store}>
          <Rag className="app-body" />
        </Provider>
      </div>
    )
  };

  const { isUserLoggedIn } = appState;
  const componentToRender = isUserLoggedIn ? _renderDashboard() : <Login onUserLogin={_handleUserLogin} />

  if (!compIsReady) return null;

  return (
    <div className="App">
      {componentToRender}
    </div>
  );
}

export default App;
