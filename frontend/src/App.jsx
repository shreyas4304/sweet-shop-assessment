import React, { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const onLogin = (user, token) => {
    setToken(token); setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem('token'); localStorage.removeItem('user');
  };

  if (!token) {
    return <div className="container">
      <h1>Sweet Shop</h1>
      <div className="forms">
        <Login onLogin={onLogin} />
        <Register onLogin={onLogin} />
      </div>
    </div>
  }

  return <Dashboard token={token} user={user} logout={logout} />
}
