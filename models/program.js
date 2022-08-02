const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user');

const Program = sequelize.define(
  'Program',
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue('description'));
      },
      set: function (value) {
        return this.setDataValue('description', JSON.stringify(value));
      },
    },
    isUserProgram: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    previewImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'userProgram',
    },
    isUserActiveProgram: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    descriptionImages: {
      type: DataTypes.STRING,
      get: function () {
        return JSON.parse(this.getDataValue('descriptionImages'));
      },
      set: function (value) {
        return this.setDataValue('descriptionImages', JSON.stringify(value));
      },
    },
    timestamp: {
      type: DataTypes.STRING,
    },
  },
  {
    hooks: {
      beforeCreate: (record) => {
        record.dataValues.timestamp = Date.now();
      },
    },
  }
);

User.hasMany(Program);
Program.belongsTo(User);

module.exports = Program;
