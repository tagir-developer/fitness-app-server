const User = require('../../models/user');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

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

// const isResetTokenValid = async (token) => {
//   const user = await User.findOne({
//     where: {
//       resetToken: token,
//       resetTokenExp: {
//         [Op.gt]: Date.now(),
//       },
//     },
//   });

//   if (!user) {
//     return false;
//   }

//   return true;
// };

module.exports = { isEmailAlreadyExist, isUserPassword, isStringArray };
