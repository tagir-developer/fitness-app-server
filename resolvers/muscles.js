const ApiError = require('../exeptions/apiError');
const Exercise = require('../models/exercise');
const Muscle = require('../models/muscle');
const MuscleGroup = require('../models/muscleGroup');
const muscleService = require('../service/muscleService');
const { validateId } = require('../validators/helpers/customValidationHelpers');

const muscleResolvers = {
  Query: {
    getMuscleGroups: async (root, data, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      try {
        return await MuscleGroup.findAll();
      } catch (e) {
        throw ApiError.BadRequest('Не удалось загрузить мышечные группы');
      }
    },
    getAllMuscles: async (root, { searchText }, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      try {
        return await muscleService.getAllMuscles(searchText);
        // return await Muscle.findAll();
      } catch (e) {
        throw ApiError.BadRequest('Не удалось загрузить мышцы');
      }
    },
    getMusclesByMuscleGroupId: async (
      root,
      { muscleGroupId, searchText },
      context
    ) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      validateId(muscleGroupId);

      try {
        return await muscleService.getMusclesByMuscleGroupId(
          muscleGroupId,
          searchText
        );
      } catch (e) {
        throw ApiError.BadRequest('Не удалось загрузить мышцы');
      }
    },
    getMuscleData: async (root, { muscleId }, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      validateId(muscleId);

      try {
        return await Muscle.findByPk(muscleId, {
          include: { model: Exercise, as: 'exercises' },
        });
      } catch (e) {
        throw ApiError.BadRequest('Не удалось загрузить данные мышцы');
      }
    },
  },
  Mutation: {
    createMuscleGroups: async () => {
      try {
        return await muscleService.createMuscleGroups();
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось добавить мышечные группы. ' + e?.message
        );
      }
    },
    createManyMuscles: async (root, params, context) => {
      try {
        return await muscleService.createManyMuscles();
      } catch (e) {
        throw ApiError.BadRequest('Не удалось добавить мышцы. ' + e?.message);
      }
    },
  },
};

module.exports = muscleResolvers;
