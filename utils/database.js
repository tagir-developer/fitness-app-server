const Sequelize = require('sequelize');

const DB_NAME = 'fitness-app';
const USER_NAME = 'root';
const PASSWORD = '2QHLuqm4rUFR!95';

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
