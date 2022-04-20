const { ResponseStatusTypes } = require('../common/constants');
const ApiError = require('../exeptions/apiError');
const User = require('../models/user');
const userService = require('../service/userService');
const {
  validateAndNormalizeRegisterData,
  validateAndNormalizeLoginData,
} = require('../validators/authValidators');

const usersResolvers = {
  Query: {
    getAllUsers: async (root, args, context) => {
      if (!context.isAuthenticated) {
        throw new Error(401, 'Пользователь не авторизован');
      }
      try {
        console.log('ПОЛУЧЕНИЕ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ');
        return await User.findAll();
      } catch (e) {
        console.log('Не удалось создать пользователей', e);
        throw new Error('Не удалось получить пользователей');
      }
    },
    getUser: async (root, { email }, context) => {
      if (!context.isAuthenticated) {
        // throw new Error(401, 'Пользователь не авторизован');
        throw ApiError.UnauthorizedError();
      }
      try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          throw new Error('Не удалось найти пользователя по email');
        }

        return user;
      } catch (e) {
        console.log('Не удалось найти пользователя', e);
        throw new Error('Не удалось найти пользователя по email');
      }
    },
  },
  Mutation: {
    createUser: async (parent, { user }) => {
      try {
        const createdUser = await User.create({
          email: user.email,
          password: user.password,
        });

        return createdUser;
      } catch (e) {
        console.log('Не удалось создать пользователя', e);
        throw new Error('Не удалось создать пользователя');
      }
    },
    register: async (root, { user }) => {
      try {
        const userData = await validateAndNormalizeRegisterData(user);

        const { email, password } = userData;

        const result = await userService.registration(email, password);

        // ! refresh токен запишем в asyncStorage react native указав дату просрочки
        // res.cookie('refreshToken', userData.refreshToken, {
        //   maxAge: 30 * 24 * 60 * 60 * 1000,
        //   httpOnly: true,
        // });

        return {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
          status: ResponseStatusTypes.success,
        };
      } catch (e) {
        throw new Error(
          'Не удалось зарегистрировать пользователя. ' + e?.message
        );
      }
    },
    login: async (root, { user }) => {
      try {
        console.log('USER -----', user);
        const userData = await validateAndNormalizeLoginData(user);

        const { email } = userData;

        const result = await userService.login(email);

        // ! refresh токен запишем в asyncStorage react native указав дату просрочки
        // res.cookie('refreshToken', userData.refreshToken, {
        //   maxAge: 30 * 24 * 60 * 60 * 1000,
        //   httpOnly: true,
        // });

        return {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
          status: ResponseStatusTypes.success,
        };
      } catch (e) {
        throw new Error('Ошибка авторизации. ' + e?.message);
      }
    },
    logout: async (root, { refreshToken }) => {
      try {
        const result = await userService.logout(refreshToken);

        // ? Нужно дать понять приложению, что токен удален и можно очистить asyncStorage смартфона
        return {
          deletedToken: result.token,
          status: ResponseStatusTypes.success,
        };
      } catch (e) {
        throw new Error('Не удалось выйти из приложения. ' + e?.message);
      }
    },
    refresh: async (root, { refreshToken }) => {
      try {
        const result = await userService.refresh(refreshToken);

        console.log('ЭНДПОИНТ refresh ====== result', result);

        return {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
          status: ResponseStatusTypes.success,
        };
      } catch (e) {
        throw new Error('Ошибка обновления токена. ' + e?.message);
      }
    },
  },
};

module.exports = usersResolvers;
