const ApiError = require('../exeptions/apiError');
const exerciseService = require('../service/exerciseService');
const { validateId } = require('../validators/helpers/customValidationHelpers');

const exerciseResolvers = {
  Query: {
    getAllExercises: async (root, { searchText }, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      try {
        return await exerciseService.getAllExercises(searchText);
      } catch (e) {
        throw ApiError.BadRequest('Не удалось загрузить список упражнений');
      }
    },
    getExerciseData: async (root, { exerciseId }, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      validateId(exerciseId);
      try {
        return await exerciseService.getExerciseData(exerciseId);
      } catch (e) {
        throw ApiError.BadRequest('Не удалось загрузить данные упражнения');
      }
    },
    getExercisesByMuscleGroupId: async (
      root,
      { muscleGroupId, searchText },
      context
    ) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      validateId(muscleGroupId);

      try {
        return exerciseService.getExercisesByMuscleGroupId(
          muscleGroupId,
          searchText
        );
      } catch (e) {
        throw ApiError.BadRequest('Не удалось загрузить упражнения');
      }
    },
  },
  Mutation: {
    createManyExercises: async (root, params, context) => {
      try {
        return await exerciseService.createManyExercises();
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось зоздать упражнения. ' + e?.message
        );
      }
    },
  },
};

module.exports = exerciseResolvers;
