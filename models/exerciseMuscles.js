const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Exercise = require('./exercise');
const Muscle = require('./muscle');

const ExerciseMuscles = sequelize.define('ExerciseMuscles', {
  ExerciseId: {
    type: DataTypes.UUID,
    references: {
      model: Exercise,
      key: 'id',
    },
  },
  MuscleId: {
    type: DataTypes.UUID,
    references: {
      model: Muscle,
      key: 'id',
    },
  },
  muscleWorkLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ExerciseMuscles;
