const express = require('express');
const bodyParser = require('body-parser');
const { init } = require('./db');
const authRoutes = require('./routes/auth');
const sweetsRoutes = require('./routes/sweets');
init();

const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log('Server listening on', PORT));
}

module.exports = app; // for tests
