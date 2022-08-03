const { Op } = require('sequelize');
const ApiError = require('../exeptions/apiError');
const DayExercise = require('../models/dayExercise');
const MuscleGroup = require('../models/muscleGroup');
const Program = require('../models/program');
const TrainingDay = require('../models/trainingDay');
const User = require('../models/user');
const trainingProgramService = require('../service/trainingProgramService');
const { validateId } = require('../validators/helpers/customValidationHelpers');
const {
  validateAndNormalizeProgramData,
  validateProgramUpdateData,
} = require('../validators/trainingProgramValidators');

const TEST_USER_ID = '94cc9846-b1da-4e0e-9bb7-0775e23ef018';

const trainingProgramResolvers = {
  Query: {
    getAllUserPrograms: async (root, data, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      try {
        // TODO: Потом будем брать userID из context.user.id, пока замокаем
        // return await trainingProgramService.getAllUserPrograms(testUserId);
        // return await Program.findAll({
        //   where: { userId: TEST_USER_ID },
        // });

        // ! потом будем в зависимости от настроек пользователя возвращать только программы пользователя или включая дефолтные
        return await Program.findAll({
          where: {
            [Op.or]: [{ userId: TEST_USER_ID }, { isUserProgram: false }],
          },
          order: [
            ['timestamp', 'ASC'],
            ['isUserProgram', 'DESC'],
          ],
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
        return await trainingProgramService.getProgramById(programId);
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
    updateProgram: async (root, { programId, trainingDays }, context) => {
      try {
        console.log('UPDATE ----', trainingDays);
        await validateProgramUpdateData(programId, trainingDays);

        const createdProgram = await trainingProgramService.updateProgram(
          programId,
          trainingDays
        );

        return createdProgram;
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось обновить программу тренировок. ' + e?.message
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
