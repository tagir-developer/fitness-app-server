const bcrypt = require('bcrypt');
const User = require('../models/user');
const mailService = require('../service/mailService');
const tokenService = require('../service/tokenService');
const ApiError = require('../exeptions/apiError');
const UserDto = require('../dtos/userDto');
const { Op } = require('sequelize');

class UserService {
  async registration(email, password) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ email, password: hashedPassword });

    await mailService.sendSuccessfulRegistrationMail(email);

    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user };
  }

  async login(email) {
    const user = await User.findOne({ where: { email: email } });

    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findByPk(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async reset(email, token) {
    const candidate = await User.findOne({ where: { email } });
    if (!candidate) {
      throw ApiError.BadRequest('Пользователь с таким email не найден');
    }
    candidate.resetToken = token;
    candidate.resetTokenExp = Date.now() + 30 * 60 * 1000;
    await candidate.save();

    const appResetPageLink = `http://tagird.bget.ru/?hash=${token}`;
    mailService.sendResetPasswordMail(candidate.email, appResetPageLink);
  }

  async changePassword(password, token) {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExp: {
          [Op.gt]: Date.now(),
        },
      },
    });

    if (!user) {
      throw ApiError.BadRequest(
        'Ваша ссылка восстановления пароля недействительна или устарела, запросите новую ссылку'
      );
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = null;
    user.resetTokenExp = null;
    await user.save();
  }

  //   async changeEmail(userId, email) {
  //     const user = await User.findById(userId);

  //     if (!user) {
  //       throw ApiError.BadRequest(
  //         'Произошла ошибка, пользователь не найден',
  //         'danger'
  //       );
  //     }

  //     user.email = email;
  //     await user.save();
  //   }

  //   async changeName(userId, name) {
  //     const user = await User.findById(userId);

  //     if (!user) {
  //       throw ApiError.BadRequest(
  //         'Произошла ошибка, пользователь не найден',
  //         'danger'
  //       );
  //     }

  //     user.name = name;
  //     await user.save();
  //   }

  //   async changePassword(userId, password) {
  //     const user = await User.findById(userId);

  //     if (!user) {
  //       throw ApiError.BadRequest(
  //         'Произошла ошибка, пользователь не найден',
  //         'danger'
  //       );
  //     }

  //     user.password = await bcrypt.hash(password, 12);
  //     await user.save();
  //   }

  //   async getUserData(userId) {
  //     const user = await User.findById(userId);

  //     if (!user) {
  //       throw ApiError.BadRequest(
  //         'Произошла ошибка, пользователь не найден',
  //         'danger'
  //       );
  //     }

  //     const userDto = new UserDto(user);

  //     return { user: userDto };
  //   }

  //     const user = await User.findById(userId);
  //     if (!user) {
  //       throw ApiError.BadRequest(
  //         'Произошла ошибка, пользователь не найден',
  //         'danger'
  //       );
  //     }
  //     user.avatar = '/images/avatars/thumb_150/' + fileName;
  //     await user.save();
  //   }
}

module.exports = new UserService();
