const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const TrainingDay = require('./trainingDay');

const Exercise = sequelize.define('Exercise', {
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
  previewImage: {
    type: DataTypes.STRING,
    allowNull: false,
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

// ! Пример связи многие ко многим - НЕ УДАЛЯТЬ
// TrainingDay.belongsToMany(Exercise, { through: 'TrainingDayExercises' });
// Exercise.belongsToMany(TrainingDay, { through: 'TrainingDayExercises' });

module.exports = Exercise;
