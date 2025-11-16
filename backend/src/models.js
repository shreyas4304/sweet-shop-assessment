const { db } = require('./db');
const bcrypt = require('bcrypt');

function createUser({ name, email, password, isAdmin = 0 }) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10).then(hash => {
      const stmt = `INSERT INTO users (name,email,password,isAdmin) VALUES (?,?,?,?)`;
      db.run(stmt, [name, email, hash, isAdmin], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, name, email, isAdmin });
      });
    }).catch(reject);
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id,name,email,password,isAdmin FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function addSweet({ name, category, price, quantity }) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO sweets (name,category,price,quantity) VALUES (?,?,?,?)`;
    db.run(stmt, [name, category, price, quantity], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, name, category, price, quantity });
    });
  });
}

function listSweets() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM sweets`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getSweetById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM sweets WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function updateSweet(id, { name, category, price, quantity }) {
  return new Promise((resolve, reject) => {
    const stmt = `UPDATE sweets SET name=?,category=?,price=?,quantity=? WHERE id=?`;
    db.run(stmt, [name, category, price, quantity, id], function (err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function deleteSweet(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM sweets WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function changeQuantity(id, delta) {
  return new Promise(async (resolve, reject) => {
    try {
      const sweet = await getSweetById(id);
      if (!sweet) return reject(new Error('Not found'));
      const newQty = sweet.quantity + delta;
      if (newQty < 0) return reject(new Error('Insufficient quantity'));
      db.run(`UPDATE sweets SET quantity = ? WHERE id = ?`, [newQty, id], function (err) {
        if (err) return reject(err);
        resolve({ ...sweet, quantity: newQty });
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  createUser,
  getUserByEmail,
  addSweet,
  listSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  changeQuantity
};
