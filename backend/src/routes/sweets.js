const express = require('express');
const router = express.Router();
const {
  addSweet, listSweets, getSweetById, updateSweet, deleteSweet, changeQuantity
} = require('../models');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const sweet = await addSweet(req.body);
    res.json(sweet);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/', async (req, res) => {
  try {
    const sweets = await listSweets();
    res.json(sweets);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/search', async (req, res) => {
  try {
    const { q, minPrice, maxPrice, category } = req.query;
    let sweets = await listSweets();
    if (q) sweets = sweets.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
    if (category) sweets = sweets.filter(s => s.category.toLowerCase() === category.toLowerCase());
    if (minPrice) sweets = sweets.filter(s => s.price >= parseFloat(minPrice));
    if (maxPrice) sweets = sweets.filter(s => s.price <= parseFloat(maxPrice));
    res.json(sweets);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await updateSweet(req.params.id, req.body);
    res.json({ message: 'Updated' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await deleteSweet(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/:id/purchase', authMiddleware, async (req, res) => {
  try {
    const result = await changeQuantity(req.params.id, -1);
    res.json(result);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.post('/:id/restock', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { amount } = req.body;
    const result = await changeQuantity(req.params.id, parseInt(amount || 1, 10));
    res.json(result);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;
