const ApiError = require('../exeptions/apiError');
const Muscle = require('../models/muscle');
const MuscleGroup = require('../models/muscleGroup');
const muscleService = require('../service/muscleService');
const { validateId } = require('../validators/helpers/customValidationHelpers');

const muscleResolvers = {
  Query: {
    // getExerciseData: async (root, { exerciseId }, context) => {
    //   try {
    //     return await Exercise.findByPk(exerciseId);
    //   } catch (e) {
    //     throw ApiError.BadRequest('Не удалось загрузить данные упражнения');
    //   }
    // },
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
    getAllMuscles: async (root, data, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      try {
        return await Muscle.findAll();
      } catch (e) {
        throw ApiError.BadRequest('Не удалось загрузить мышцы');
      }
    },
    getMusclesByMuscleGroupId: async (root, { muscleGroupId }, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      validateId(muscleGroupId);

      try {
        return await muscleService.getMusclesByMuscleGroupId(muscleGroupId);
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
        // return await muscleService.getMusclesByMuscleGroupId(muscleGroupId);
        return await Muscle.findByPk(muscleId);
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
