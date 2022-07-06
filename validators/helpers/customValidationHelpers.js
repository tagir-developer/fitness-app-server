const User = require('../../models/user');
const bcrypt = require('bcrypt');
const { isUUID } = require('validator');

const isEmailAlreadyExist = async (verifiedEmail) => {
  const candidate = await User.findOne({ where: { email: verifiedEmail } });

  if (candidate) return true;

  return false;
};

const isUserPassword = async (verifiedPassword, userEmail) => {
  const user = await User.findOne({ where: { email: userEmail } });

  const isMatch = await bcrypt.compare(verifiedPassword, user.password);

  if (isMatch) return true;

  return false;
};

const isStringArray = (value) => {
  if (Array.isArray(value)) {
    for (let item in value) {
      if (typeof item !== 'string') {
        return false;
      }
    }

    return true;
  }

  return false;
};

const validateId = (id, errorMessage) => {
  if (!isUUID(id)) {
    throw new Error(
      errorMessage ?? 'Ошибка валидации. Вы указали неправильный id'
    );
  }
};

module.exports = {
  isEmailAlreadyExist,
  isUserPassword,
  isStringArray,
  validateId,
};
