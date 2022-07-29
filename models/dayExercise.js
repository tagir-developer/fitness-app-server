const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const TrainingDay = require('./trainingDay');

const DayExercise = sequelize.define(
  'DayExercise',
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    exerciseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    muscleGroups: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false },
  {
    hooks: {
      beforeCreate: (record) => {
        record.dataValues.timestamp = Date.now();
      },
    },
  }
);

TrainingDay.hasMany(DayExercise, { as: 'exercises' });
DayExercise.belongsTo(TrainingDay);

module.exports = DayExercise;
