const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user');

const Program = sequelize.define('Program', {
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
    type: DataTypes.STRING,
  },
  isUserProgram: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  previewImage: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '../../../assets/images/ui/card-icons/programs/basic.jpg',
  },
  descriptionImages: {
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('descriptionImages'));
    },
    set: function (val) {
      return this.setDataValue('descriptionImages', JSON.stringify(val));
    },
  },
});

User.hasMany(Program);
Program.belongsTo(User);

module.exports = Program;