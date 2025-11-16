import React, { useEffect, useState } from 'react';
import API, { authHeader } from '../api';

export default function Dashboard({ token, user, logout }) {
  const [sweets, setSweets] = useState([]);
  const [q, setQ] = useState('');

  async function fetchSweets() {
    const res = await API.get('/sweets');
    setSweets(res.data);
  }

  useEffect(()=>{ fetchSweets() }, []);

  async function purchase(id) {
    await API.post(`/sweets/${id}/purchase`, {}, { headers: authHeader(token) });
    fetchSweets();
  }

  return <div className="container">
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <h2>Welcome, {user.name}</h2>
      <div>
        {user.isAdmin ? <span className="badge">Admin</span> : null}
        <button onClick={logout}>Logout</button>
      </div>
    </div>

    <div className="search">
      <input placeholder="Search sweets" value={q} onChange={e=>setQ(e.target.value)} />
      <button onClick={()=>setSweets(s => s.filter(x => x.name.toLowerCase().includes(q.toLowerCase())))}>Search</button>
      <button onClick={fetchSweets}>Reset</button>
    </div>

    <div className="grid">
      {sweets.map(s => (
        <div key={s.id} className="card">
          <h4>{s.name}</h4>
          <p>{s.category}</p>
          <p>₹{s.price} | Qty: {s.quantity}</p>
          <button disabled={s.quantity <= 0} onClick={()=>purchase(s.id)}>Purchase</button>
        </div>
      ))}
    </div>
  </div>
}
