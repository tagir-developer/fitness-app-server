const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const ExerciseMuscles = require('./exerciseMuscles');
const Muscle = require('./muscle');

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
    type: DataTypes.TEXT,
    get: function () {
      return JSON.parse(this.getDataValue('description'));
    },
    set: function (value) {
      return this.setDataValue('description', JSON.stringify(value));
    },
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

// чтобы отображать в детальке описания мышечной группы упражнения и наоборот
Exercise.belongsToMany(Muscle, {
  through: ExerciseMuscles,
  as: 'muscles',
});
Muscle.belongsToMany(Exercise, {
  through: ExerciseMuscles,
  as: 'exercises',
});

// для отображения похожих упражнений
Exercise.belongsToMany(Exercise, {
  as: 'similarExercises',
  through: 'SimilarExercises',
});

module.exports = Exercise;
