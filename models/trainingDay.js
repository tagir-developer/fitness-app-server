const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Program = require('./program');

const TrainingDay = sequelize.define('TrainingDay', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
  },
});

Program.hasMany(TrainingDay);
TrainingDay.belongsTo(Program);

module.exports = TrainingDay;
