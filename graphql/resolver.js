const User = require('../models/user');

module.exports = {
  getAllUsers: async () => {
    try {
      return await User.findAll();
    } catch (e) {
      console.log('Не удалось создать пользователей', e);
      throw new Error('Не удалось получить пользователей');
    }
  },

  createUser: async ({ user }) => {
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
};
