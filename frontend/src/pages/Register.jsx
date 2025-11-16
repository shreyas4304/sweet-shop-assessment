import React, { useState } from 'react';
import API from '../api';

export default function Register({ onLogin }) {
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const submit = async e => {
    e.preventDefault();
    const res = await API.post('/auth/register', { name, email, password });
    onLogin(res.data.user, res.data.token);
  };
  return <form onSubmit={submit} className="card">
    <h3>Register</h3>
    <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
    <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
    <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
    <button type="submit">Register</button>
  </form>
}
