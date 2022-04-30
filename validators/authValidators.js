const { isEmail, normalizeEmail, isLength } = require('validator');
const {
  isEmailAlreadyExist,
  isUserPassword,
} = require('./helpers/customValidationHelpers');
const { validateValue } = require('./helpers/validateValue');

const AUTH_ERROR_MESSAGE = 'Вы ввели неверное имя пользователя или пароль';

const validateAndNormalizeRegisterData = async (data) => {
  const email = normalizeEmail(data.email);
  const password = data.password.trim();

  await validateValue(email, [
    {
      validator: (value) => isEmail(value),
      message: 'Введите корректный email',
    },
    {
      validator: async (value) => !(await isEmailAlreadyExist(value)),
      message: 'Такой email уже занят',
    },
  ]);

  await validateValue(password, [
    {
      validator: (value) => isLength(value, { min: 5 }),
      message: 'Пароль должен быть минимум 5 символов',
    },
  ]);

  const normalizedData = {
    email,
    password,
  };

  return normalizedData;
};

const validateAndNormalizeLoginData = async (data) => {
  const email = normalizeEmail(data.email);
  const password = data.password.trim();

  console.log('password', password);

  await validateValue(email, [
    {
      validator: (value) => isEmail(value),
      message: 'Введите корректный email',
    },
    {
      validator: async (value) => await isEmailAlreadyExist(value),
      message: AUTH_ERROR_MESSAGE,
    },
  ]);

  await validateValue(password, [
    {
      validator: async (value) => await isUserPassword(value, email),
      message: AUTH_ERROR_MESSAGE,
    },
  ]);

  const normalizedData = {
    email,
    password,
  };

  return normalizedData;
};

module.exports = {
  validateAndNormalizeRegisterData,
  validateAndNormalizeLoginData,
};

// exports.resetValidators = [
// 	check('password')
// 		.isLength({ min: 6 }).withMessage('Пароль должен быть минимум 6 символов')
// 		.isString().withMessage('Пароль не должен состоять из одних цифр'),
// 	check('passwordConfirm')
// 		.custom((value, { req }) => {
// 			if (value !== req.body.password) {
// 				return Promise.reject('Пароли должны совпадать')
// 			}
// 			return true
// 		}).withMessage('Пароли должны совпадать')
// ]

// exports.testValidators = [
// 	check('name')
// 		.isString().withMessage('Поле name должно быть строкой'),
// 	check('text')
// 		.if(check('text').isString().withMessage('Поле name должно быть строкой'))
// 		.optional({ checkFalsy: true })
// 		.isString().withMessage('Поле name должно быть строкой')
// 		.isEmail().withMessage('Поле name должно быть email')
// ]
