import React, { useState } from 'react';
import API, { authHeader } from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const submit = async e => {
    e.preventDefault();
    const res = await API.post('/auth/login', { email, password });
    onLogin(res.data.user, res.data.token);
  };
  return <form onSubmit={submit} className="card">
    <h3>Login</h3>
    <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
    <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
    <button type="submit">Login</button>
  </form>
}
