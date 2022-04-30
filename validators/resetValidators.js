const { isEmail, normalizeEmail, isLength, equals } = require('validator');
const {
  isEmailAlreadyExist,
  isResetTokenValid,
} = require('./helpers/customValidationHelpers');
const { validateValue } = require('./helpers/validateValue');

const validateAndNormalizeResetPasswordData = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  await validateValue(email, [
    {
      validator: (value) => isEmail(value),
      message: 'Введите корректный email',
    },
    {
      validator: async (value) => await isEmailAlreadyExist(value),
      message: 'Пользователь с таким email не найден',
    },
  ]);

  return normalizedEmail;
};

const validateChangePasswordData = async (data) => {
  await validateValue(
    data.password,
    [
      {
        validator: (value) => equals(value, data.confirmPassword),
        message: 'Пароли не совпадают',
      },
      {
        validator: (value) => isLength(value, { min: 5 }),
        message: 'Пароль должен быть минимум 5 символов',
      },
    ],
    true
  );

  // await validateValue(data.token, [
  //   {
  //     validator: async (value) => await isResetTokenValid(value),
  //     message:
  //       'Ошибка. Возможно, ссылка сброса пароля устарела. Попробуйте еще раз.',
  //   },
  // ]);
};

module.exports = {
  validateAndNormalizeResetPasswordData,
  validateChangePasswordData,
};
