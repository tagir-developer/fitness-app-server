const { check } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { isEmail, normalizeEmail, isLength } = require('validator');

const basicLoginErrorMessage = 'Вы ввели неверное имя пользователя или пароль';

const validateAndNormalizeRegisterData = async (data) => {
  const normalizedEmail = normalizeEmail(data.email);

  const stopValidationOnError = false;

  const errors = [];

  const emailAlreadyExist = async () => {
    const candidate = await User.findOne({ where: { email: normalizedEmail } });

    if (candidate) {
      return true;
    }
    return false;
  };

  const isEmailAlreadyExist = await emailAlreadyExist();

  if (!isEmail(normalizedEmail)) {
    const message = 'Введите корректный email';
    errors.push(message);
    if (stopValidationOnError) {
      throw new Error(message);
    }
  }

  if (!isLength(normalizedEmail, { min: 10, max: undefined })) {
    const message = 'Email слишком короткий';
    errors.push(message);
    if (stopValidationOnError) {
      throw new Error(message);
    }
  }

  if (isEmailAlreadyExist) {
    const message = 'Такой email уже занят';
    errors.push(message);
    if (stopValidationOnError) {
      throw new Error(message);
    }
  }

  if (errors.length > 0) {
    console.log('VALIDATION ERRORS: ', errors);
  }

  if (!stopValidationOnError && errors.length > 0) {
    const errorMessage = errors.join('. ');
    throw new Error(errorMessage);
  }

  const normalizedData = {
    ...data,
    email: normalizedEmail,
  };

  return normalizedData;
};

// [
//   check('email')
//     .isEmail()
//     .normalizeEmail()
//     .withMessage('Введите корректный email')
//     .custom(async (value, { req }) => {
//       try {
//         const user = await User.findOne({ email: value });

//         if (user) {
//           return Promise.reject('Такой email уже занят');
//         }
//         return true;
//       } catch (e) {
//         console.log(e);
//       }
//     })
//     .withMessage('Этот email уже занят'),
//   check('password')
//     .isLength({ min: 6 })
//     .withMessage('Пароль должен быть минимум 6 символов')
//     .isString()
//     .withMessage('Пароль не должен состоять из одних цифр')
//     .matches(/\d/)
//     .withMessage('Пароль должен содержать хотя бы одну цифру'),
//   check('passwordConfirm')
//     .custom((value, { req }) => {
//       if (value !== req.body.password) {
//         return Promise.reject('Пароли должны совпадать');
//       }
//       return true;
//     })
//     .withMessage('Пароли должны совпадать'),
//   check('name').optional().isString(),
// ];

module.exports = { validateAndNormalizeRegisterData };

// exports.registerValidators = [
//   check('email')
//     .isEmail()
//     .normalizeEmail()
//     .withMessage('Введите корректный email')
//     .custom(async (value, { req }) => {
//       try {
//         const user = await User.findOne({ email: value });

//         if (user) {
//           return Promise.reject('Такой email уже занят');
//         }
//         return true;
//       } catch (e) {
//         console.log(e);
//       }
//     })
//     .withMessage('Этот email уже занят'),
//   check('password')
//     .isLength({ min: 6 })
//     .withMessage('Пароль должен быть минимум 6 символов')
//     .isString()
//     .withMessage('Пароль не должен состоять из одних цифр')
//     .matches(/\d/)
//     .withMessage('Пароль должен содержать хотя бы одну цифру'),
//   check('passwordConfirm')
//     .custom((value, { req }) => {
//       if (value !== req.body.password) {
//         return Promise.reject('Пароли должны совпадать');
//       }
//       return true;
//     })
//     .withMessage('Пароли должны совпадать'),
//   check('name').optional().isString(),
// ];

// exports.loginValidators = [
// 	check('email')
// 		.exists().withMessage('Введите email')
// 		.isEmail().normalizeEmail().withMessage('Введите корректный email')
// 		.custom(async (value, { req }) => {
// 			try {
// 				const user = await User.findOne({ email: value })
// 				if (!user) {
// 					return Promise.reject(basicLoginErrorMessage)
// 				}
// 				return true
// 			} catch (e) {
// 				console.log(e)
// 			}
// 		}).withMessage(basicLoginErrorMessage),
// 	check('password')
// 		.exists().withMessage('Введите пароль')
// 		.custom(async (value, { req }) => {
// 			try {
// 				const user = await User.findOne({ email: req.body.email })
// 				const isMatch = await bcrypt.compare(value, user.password)
// 				if (!isMatch) {
// 					return Promise.reject(basicLoginErrorMessage)
// 				}
// 				return true
// 			} catch (e) {
// 				console.log(e)
// 			}
// 		}).withMessage(basicLoginErrorMessage)
// ]

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
