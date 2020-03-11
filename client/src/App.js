import React, {useState, useEffect} from "react";
import axios from 'axios';
import Login from "./views/Login";

function App() {
  const [authenticated, setAuthenticated] = useState('loading');
  
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.post(`${process.env.REACT_APP_API_URL}/mojang/auth/validate`, { accessToken })
      .then(response => {
        setAuthenticated(true);
      })
      .catch(error => {
        setAuthenticated(false);
      })
    } else {
      setAuthenticated(false);
    }
  }, []);

  const onLogin = () => {
    setAuthenticated(true);
  }

  if (authenticated === 'loading') {
    return <></>
  } else if (authenticated) {
    const user = JSON.parse(localStorage.getItem('user'));
    return <img src={`https://crafatar.com/avatars/${user.id}`} alt={user.name} />;
  }
  return <Login onSuccess={onLogin} />;
}

export default App;
