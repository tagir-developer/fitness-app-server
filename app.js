require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const sequelize = require('./utils/database');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`App has been started on port ${PORT}...`);
    });
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
