const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Token = sequelize.define(
  'Token',
  {
    userId: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Token;
