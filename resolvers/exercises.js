const ApiError = require('../exeptions/apiError');
const Exercise = require('../models/exercise');
const exerciseService = require('../service/exerciseService');

const exerciseResolvers = {
  Query: {
    getAllExercises: async (root, data, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      try {
        return await Exercise.findAll();
      } catch (e) {
        throw ApiError.BadRequest('Не удалось загрузить список упражнений');
      }
    },
    getExerciseData: async (root, { exerciseId }, context) => {
      try {
        return await Exercise.findByPk(exerciseId);
      } catch (e) {
        throw ApiError.BadRequest('Не удалось загрузить данные упражнения');
      }
    },
  },
  Mutation: {
    createExercise: async (root, { exercise }, context) => {
      try {
        return await exerciseService.createExercise(exercise);
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось создать упражнение. ' + e?.message
        );
      }
    },
  },
};

module.exports = exerciseResolvers;
