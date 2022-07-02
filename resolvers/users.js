const ApiError = require('../exeptions/apiError');
const User = require('../models/user');
const mailService = require('../service/mailService');
const userService = require('../service/userService');
const {
  validateAndNormalizeRegisterData,
  validateAndNormalizeLoginData,
} = require('../validators/authValidators');
const {
  validateAndNormalizeResetPasswordData,
  validateChangePasswordData,
} = require('../validators/resetValidators');
const crypto = require('crypto');

const usersResolvers = {
  Query: {
    getAllUsers: async (root, args, context) => {
      // if (!context.isAuthenticated) {
      //   throw ApiError.UnauthorizedError();
      // }
      try {
        return await User.findAll();
      } catch (e) {
        throw ApiError.BadRequest('Не удалось получить пользователей');
      }
    },
    getUser: async (root, { email }, context) => {
      if (!context.isAuthenticated) {
        throw ApiError.UnauthorizedError();
      }
      try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          throw ApiError.BadRequest('Пользователь с таким email не найден');
        }

        return user;
      } catch (e) {
        throw ApiError.BadRequest('Пользователь с таким email не найден');
      }
    },
  },
  Mutation: {
    register: async (root, { user }) => {
      try {
        const userData = await validateAndNormalizeRegisterData(user);

        const { email, password } = userData;

        const result = await userService.registration(email, password);

        return {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
        };
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось зарегистрировать пользователя. ' + e?.message
        );
      }
    },
    login: async (root, { user }) => {
      try {
        const userData = await validateAndNormalizeLoginData(user);

        const { email } = userData;

        const result = await userService.login(email);

        return {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
        };
      } catch (e) {
        throw ApiError.BadRequest('Ошибка авторизации. ' + e?.message);
      }
    },
    logout: async (root, { refreshToken }) => {
      try {
        const result = await userService.logout(refreshToken);
        return {
          deletedToken: result.token,
        };
      } catch (e) {
        throw ApiError.BadRequest(
          'Не удалось выйти из приложения. ' + e?.message
        );
      }
    },
    refresh: async (root, { refreshToken }) => {
      try {
        const result = await userService.refresh(refreshToken);

        return {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
        };
      } catch (e) {
        throw ApiError.BadRequest('Ошибка обновления токена. ' + e?.message);
      }
    },
    reset: async (root, { email }) => {
      try {
        const normalizedEmail = await validateAndNormalizeResetPasswordData(
          email
        );

        const buffer = await crypto.randomBytes(32);

        if (!buffer) {
          throw ApiError.BadRequest(
            'Что-то пошло не так, повторите попытку позже'
          );
        }

        const token = buffer.toString('hex');

        await userService.reset(normalizedEmail, token);

        // ? Возможно нет смысла отправлять это сообщение
        return {
          message:
            'Ссылка для сброса пароля отправлена на указанный email адрес',
        };
      } catch (e) {
        throw ApiError.BadRequest('Ошибка сброса пароля. ' + e?.message);
      }
    },
    changePassword: async (root, { data }) => {
      try {
        if (!data.token) {
          throw ApiError.BadRequest(
            'Ваша ссылка восстановления пароля недействительна или устарела, запросите новую ссылку'
          );
        }

        await validateChangePasswordData(data);

        await userService.changePassword(data.password, data.token);

        return {
          message:
            'Вы успешно изменили пароль. Можете войти в приложение, используя новый пароль',
        };
      } catch (e) {
        throw ApiError.BadRequest('Ошибка сброса пароля. ' + e?.message);
      }
    },
  },
};

module.exports = usersResolvers;
