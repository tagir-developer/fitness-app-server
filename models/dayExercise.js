const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const TrainingDay = require('./trainingDay');

const DayExercise = sequelize.define('DayExercise', {
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

TrainingDay.hasMany(DayExercise);
DayExercise.belongsTo(TrainingDay);

module.exports = DayExercise;
