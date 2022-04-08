const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const user = sequelize.define('User', {
  id: {
    primaryKey: true,
    // autoIncrement: true,
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  userName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: Sequelize.INTEGER,
  },
});

module.exports = user;
