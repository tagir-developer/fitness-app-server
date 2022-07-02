const ApiError = require('../exeptions/apiError');
const Program = require('../models/program');
const trainingProgramService = require('../service/trainingProgramService');
const {
  validateAndNormalizeProgramData,
} = require('../validators/trainingProgramValidators');

const TEST_USER_ID = '6b41c15e-c697-41a8-a9b8-ef507057bf27';

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
      try {
        return await Program.findByPk(programId);
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
        const program = await validateAndNormalizeProgramData(program);

        // TODO: Потом будем брать userID из context.user.id, пока замокаем
        const createdProgram = await trainingProgramService.createProgram(
          // context.user.id,
          TEST_USER_ID,
          program
        );

        return createdProgram;
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось создать программу тренировок. ' + e?.message
        );
      }
    },
  },
};

module.exports = trainingProgramResolvers;
