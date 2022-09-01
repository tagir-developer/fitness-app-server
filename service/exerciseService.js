const { Op } = require('sequelize');
const ApiError = require('../exeptions/apiError');
const exercisesData = require('../mockdata/exercises');
const Exercise = require('../models/exercise');
const ExerciseMuscles = require('../models/exerciseMuscles');
const Muscle = require('../models/muscle');
const MuscleGroup = require('../models/muscleGroup');
const muscleService = require('./muscleService');

class ExerciseService {
  async getAllExercises(searchText) {
    if (searchText) {
      return await Exercise.findAll({
        where: {
          name: {
            [Op.substring]: searchText,
          },
        },
        include: {
          model: Muscle,
          as: 'muscles',
          through: {
            model: ExerciseMuscles,
            as: 'workLevel',
            attributes: ['muscleWorkLevel'],
          },
        },
      });
    }

    return await Exercise.findAll({
      include: {
        model: Muscle,
        as: 'muscles',
        through: {
          model: ExerciseMuscles,
          as: 'workLevel',
          attributes: ['muscleWorkLevel'],
        },
      },
    });

    // if (searchText) {
    //   return await Exercise.findAll({
    //     where: {
    //       name: {
    //         [Op.substring]: searchText,
    //       },
    //     },
    //   });
    // }

    // return await Exercise.findAll();
  }

  async getExerciseData(exerciseId) {
    return await Exercise.findByPk(exerciseId, {
      include: [
        {
          model: Muscle,
          as: 'muscles',
          through: {
            model: ExerciseMuscles,
            as: 'workLevel',
            attributes: ['muscleWorkLevel'],
          },
        },
        { model: Exercise, as: 'similarExercises' },
      ],
    });
  }

  async getExercisesByMuscleGroupId(muscleGroupId, searchText) {
    const muscleGroup = await MuscleGroup.findByPk(muscleGroupId);

    if (!muscleGroup) {
      throw ApiError.BadRequest('Не удалось найти мышечную группу по id');
    }

    if (searchText) {
      return await muscleGroup.getExercises({
        where: {
          name: {
            [Op.substring]: searchText,
          },
        },
      });
    }

    return await muscleGroup.getExercises();
  }

  async createManyExercises() {
    await muscleService.createMuscleGroups();
    await muscleService.createManyMuscles();

    for (let i = 0; i < exercisesData.length; i++) {
      const exerciseData = exercisesData[i];

      const createdExercise = await Exercise.create({
        id: exerciseData.id,
        name: exerciseData.name,
        description: exerciseData.description,
        previewImage: exerciseData.previewImage,
        descriptionImages: exerciseData.descriptionImages,
      });

      // создаем связь между упражнением и мышечными группами
      for (let j = 0; j < exerciseData.associatedMuscles.length; j++) {
        const muscle = exerciseData.associatedMuscles[j];

        await ExerciseMuscles.create({
          ExerciseId: exerciseData.id,
          MuscleId: muscle.muscleId,
          muscleWorkLevel: muscle.muscleWorkLevel,
        });
      }

      // создаем связь между упражнением и мышечной группой (частью тела)
      for (let y = 0; y < exerciseData.muscleGroupsIds.length; y++) {
        const muscleGroupId = exerciseData.muscleGroupsIds[y];

        const muscleGroup = await MuscleGroup.findByPk(muscleGroupId);

        await muscleGroup.addExercise(createdExercise);
      }
    }

    // только после создания всех упражнений создадим связи между похожими упражнениями
    for (let n = 0; n < exercisesData.length; n++) {
      const exerciseData = exercisesData[n];

      const exercise = await Exercise.findByPk(exerciseData.id);

      for (let m = 0; m < exerciseData.similarExercisesIds.length; m++) {
        const similarExerciseId = exerciseData.similarExercisesIds[m];

        const similarExercise = await Exercise.findByPk(similarExerciseId);

        await exercise.addSimilarExercise(similarExercise);
      }
    }

    return 'Упражнения успешно добавлены';
  }
}

module.exports = new ExerciseService();
