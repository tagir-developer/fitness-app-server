const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Exercise = require('./exercise');
const Muscle = require('./muscle');

const MuscleGroup = sequelize.define('MuscleGroup', {
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
  order: {
    type: DataTypes.INTEGER,
  },
});

MuscleGroup.belongsToMany(Exercise, { through: 'MuscleGroupsExercises' });
Exercise.belongsToMany(MuscleGroup, { through: 'MuscleGroupsExercises' });

MuscleGroup.belongsToMany(Muscle, { through: 'MuscleGroupsMuscles' });
Muscle.belongsToMany(MuscleGroup, { through: 'MuscleGroupsMuscles' });

module.exports = MuscleGroup;
