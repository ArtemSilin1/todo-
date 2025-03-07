import './App.css';
import React, { useState } from "react";
import {Link, Route, Routes, useLocation} from "react-router-dom";

import Auth from "./components/Auth";
import TasksList from "./routes/TasksList";
import UsersList from "./routes/UsersList";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("login"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const showMessage = (message, isSuccess) => {
    if (isSuccess) {
      setSuccessMessage(message);
    } else {
      setError(message);
    }
    setTimeout(() => {
      if (isSuccess) {
        setSuccessMessage('');
      } else {
        setError('');
      }
    }, 10000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("login");
    localStorage.removeItem("role");
    setToken(null);
    setUsername(null);
    setRole(null);
  }

  const location = useLocation();

  if (!token) {
    return <Auth setToken={setToken} setUsername={setUsername} setRole={setRole} />
  }
  else {
    return (
      <div className="App">
        <header>
          <div className='header_container'>
            <p>Задачи</p>
            <span className='exit_icon' onClick={handleLogout} />
          </div>
        </header>

        <div className='app_content'>
          <Routes>
            <Route path='/' element={
              <TasksList
                showMessage={showMessage}
                successMessage={successMessage}
                setSuccessMessage={setSuccessMessage}
                error={error}
                setError={setError}
                username={username}
              />
            } />

            <Route path='/users' element={
              <UsersList
                 showMessage={showMessage}
                 setSuccessMessage={setSuccessMessage}
                 setError={setError}
              />
            }/>
          </Routes>
        </div>

        {error && <p className='error_message message'>{error}</p>}
        {successMessage && <p className='success_message message'>{successMessage}</p>}

        {role === 'Руководитель' ?
          <div className='admin_nav'>
            <div className='admin_nav_container'>
              <Link className={`nav_link ${location.pathname === '/' ? 'active' : ''}`} to='/'>Все задачи</Link>
              <Link className={`nav_link ${location.pathname === '/users' ? 'active' : ''}`} to='/users'>Все пользователи</Link>
            </div>
          </div>
          : null
        }
      </div>
    );
  }
}

export default App;
