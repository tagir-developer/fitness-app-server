const User = require('../../models/user');
const bcrypt = require('bcrypt');

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

module.exports = { isEmailAlreadyExist, isUserPassword };
