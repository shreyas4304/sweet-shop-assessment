const express = require('express');
const router = express.Router();
const { createUser, getUserByEmail } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const existing = await getUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email exists' });
    const user = await createUser({ name, email, password, isAdmin: isAdmin ? 1 : 0 });
    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, SECRET);
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, SECRET);
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
