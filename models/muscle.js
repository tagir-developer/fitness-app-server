const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Muscle = sequelize.define('Muscle', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
  },
  previewImage: {
    type: DataTypes.STRING,
    allowNull: false,
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
  descriptionImages: {
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('descriptionImages'));
    },
    set: function (value) {
      return this.setDataValue('descriptionImages', JSON.stringify(value));
    },
  },
});

module.exports = Muscle;
