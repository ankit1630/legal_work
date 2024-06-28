import React, { useState } from 'react';
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

  const { isUserLoggedIn } = appState;
  const componentToRender = isUserLoggedIn ? <Login /> : <Login />

  return (
    <div className="App">
      {componentToRender}
    </div>
  );
}

export default App;
