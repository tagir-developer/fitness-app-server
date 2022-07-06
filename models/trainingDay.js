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
    allowNull: false,
  },
});

Program.hasMany(TrainingDay, { as: 'days' });
TrainingDay.belongsTo(Program);

module.exports = TrainingDay;
