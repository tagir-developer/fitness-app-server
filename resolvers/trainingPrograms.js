const ApiError = require('../exeptions/apiError');
const DayExercise = require('../models/dayExercise');
const Program = require('../models/program');
const TrainingDay = require('../models/trainingDay');
const User = require('../models/user');
const trainingProgramService = require('../service/trainingProgramService');
const { validateId } = require('../validators/helpers/customValidationHelpers');
const {
  validateAndNormalizeProgramData,
} = require('../validators/trainingProgramValidators');

const TEST_USER_ID = '26ef0f65-e9a8-4142-9706-3cc0e4563491';

const trainingProgramResolvers = {
  Query: {
    getAllUserPrograms: async (root, data, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      try {
        // TODO: Потом будем брать userID из context.user.id, пока замокаем
        // return await trainingProgramService.getAllUserPrograms(testUserId);
        return await Program.findAll({
          where: { userId: TEST_USER_ID },
        });
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось загрузить тренировочные программы пользователя'
        );
      }
    },
    getProgramById: async (root, { programId }, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      validateId(programId);
      try {
        const result = await trainingProgramService.getProgramById(programId);
        // const result = await Program.findByPk(programId, {
        //   include: {
        //     model: TrainingDay,
        //     as: 'days',
        //     include: { model: DayExercise, as: 'exercises' },
        //   },
        // });
        console.log('RESULT+++++++++++++', JSON.stringify(result, null, 2));
        return result;
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось загрузить данные тренировочной программы'
        );
      }
    },
  },
  Mutation: {
    createProgram: async (root, { program }, context) => {
      try {
        const normalizedProgram = await validateAndNormalizeProgramData(
          program
        );

        // TODO: Потом будем брать userID из context.user.id, пока замокаем
        const createdProgram = await trainingProgramService.createProgram(
          // context.user.id,
          TEST_USER_ID,
          normalizedProgram
        );

        return createdProgram;
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось создать программу тренировок. ' + e?.message
        );
      }
    },
    updateProgram: async (root, { programId, program }, context) => {
      try {
        console.log('++++++++++programId', programId);
        console.log('++++++++++program', program);
        validateId(programId);
        const normalizedProgram = await validateAndNormalizeProgramData(
          program
        );

        const createdProgram = await trainingProgramService.updateProgram(
          programId,
          normalizedProgram
        );

        return createdProgram;
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось создать программу тренировок. ' + e?.message
        );
      }
    },
    copyProgram: async (root, { programId }, context) => {
      validateId(programId);
      try {
        return await trainingProgramService.copyProgram(
          TEST_USER_ID,
          programId
        );
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось скопировать программу тренировок. ' + e?.message
        );
      }
    },
    changeProgramName: async (root, { programId, name }, context) => {
      validateId(programId);
      try {
        return await trainingProgramService.changeProgramName(programId, name);
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось изменить имя программы. ' + e?.message
        );
      }
    },
    deleteProgram: async (root, { programId }, context) => {
      validateId(programId);
      try {
        return await trainingProgramService.deleteProgram(programId);
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось удалить программу тренировок. ' + e?.message
        );
      }
    },
    setActiveUserProgram: async (root, { programId }, context) => {
      validateId(programId);
      try {
        return await trainingProgramService.setActiveUserProgram(programId);
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось изменить активную программу пользователя. ' + e?.message
        );
      }
    },
  },
};

module.exports = trainingProgramResolvers;
