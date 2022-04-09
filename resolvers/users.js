const { ResponseStatusTypes } = require('../common/constants');
const User = require('../models/user');
const userService = require('../service/userService');
const {
  registerValidators,
  validateAndNormalizeRegisterData,
} = require('../validators/authValidators');

const usersResolvers = {
  Query: {
    getAllUsers: async () => {
      try {
        return await User.findAll();
      } catch (e) {
        console.log('Не удалось создать пользователей', e);
        throw new Error('Не удалось получить пользователей');
      }
    },
    getUser: async (root, { email }) => {
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
        // await registerValidators(user);

        const userData = await validateAndNormalizeRegisterData(user);

        const { email, password } = userData;

        // ApiError.ValidationErrorChecking(req);

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
  },
};

module.exports = usersResolvers;
