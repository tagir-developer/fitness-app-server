const bcrypt = require('bcrypt');
const User = require('../models/user');
const uuid = require('uuid');
const mailService = require('../service/mailService');
const tokenService = require('../service/tokenService');
const ApiError = require('../exeptions/apiError');
const UserDto = require('../dtos/userDto');

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

  //   async login(email, password) {
  //     const user = await User.findOne({ email });
  //     const userDto = new UserDto(user);
  //     const tokens = tokenService.generateTokens({ ...userDto });
  //     await tokenService.saveToken(userDto.id, tokens.refreshToken);

  //     return { ...tokens, user: userDto };
  //   }

  //   async logout(refreshToken) {
  //     const token = await tokenService.removeToken(refreshToken);
  //     return token;
  //   }

  //   async refresh(refreshToken) {
  //     if (!refreshToken) {
  //       throw ApiError.UnauthorizedError();
  //     }
  //     const userData = tokenService.validateRefreshToken(refreshToken);
  //     const tokenFromDb = await tokenService.findToken(refreshToken);
  //     if (!userData || !tokenFromDb) {
  //       throw ApiError.UnauthorizedError();
  //     }
  //     const user = await User.findById(userData.id);
  //     const userDto = new UserDto(user);
  //     const tokens = tokenService.generateTokens({ ...userDto });
  //     await tokenService.saveToken(userDto.id, tokens.refreshToken);

  //     return { ...tokens, user: userDto };
  //   }

  //   async activate(activationLink) {
  //     const user = await User.findOne({ activationLink });
  //     if (!user) {
  //       throw ApiError.BadRequest('Некорректная ссылка активации');
  //     }
  //     user.isActivated = true;
  //     await user.save();
  //   }

  //   async reset(email, token) {
  //     const candidate = await User.findOne({ email });
  //     if (!candidate) {
  //       throw ApiError.BadRequest('Пользователь с таким email не найден');
  //     }
  //     candidate.resetToken = token;
  //     candidate.resetTokenExp = Date.now() + 30 * 60 * 1000;
  //     await candidate.save();
  //     mailService.sendResetPasswordMail(
  //       candidate.email,
  //       `${process.env.CLIENT_URL}/password/${token}`
  //     );
  //   }

  //   async password(token) {
  //     if (!token) {
  //       throw ApiError.BadRequest(
  //         'Ваша ссылка восстановления пароля недействительна или устарела, запросите новую ссылку',
  //         'danger'
  //       );
  //     }
  //     const user = await User.findOne({
  //       resetToken: token,
  //       resetTokenExp: { $gt: Date.now() },
  //     });
  //     if (!user) {
  //       throw ApiError.BadRequest(
  //         'Ваша ссылка восстановления пароля недействительна или устарела, запросите новую ссылку',
  //         'danger'
  //       );
  //     }
  //     const resetDto = {
  //       userId: user._id.toString(),
  //       token: token,
  //     };
  //     return { ...resetDto };
  //   }

  //   async newPassword(password, userId, token) {
  //     const user = await User.findOne({
  //       _id: userId,
  //       resetToken: token,
  //       resetTokenExp: { $gt: Date.now() },
  //     });

  //     if (!user) {
  //       throw ApiError.BadRequest(
  //         'Ваша ссылка восстановления пароля недействительна или устарела, запросите новую ссылку',
  //         'warning'
  //       );
  //     }

  //     user.password = await bcrypt.hash(password, 12);
  //     user.resetToken = undefined;
  //     user.resetTokenExp = undefined;
  //     await user.save();
  //   }

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

  //   async uploadAvatar(userId, file, next) {
  //     const fileName =
  //       new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
  //     const avatarPath = path.join(
  //       __dirname,
  //       '..',
  //       'images/avatars/thumb_150',
  //       fileName
  //     );

  //     gm(file.path)
  //       .resize(150, 150, '^')
  //       .gravity('Center')
  //       .extent(150, 150)
  //       .noProfile()
  //       .write(avatarPath, async function (err) {
  //         if (err) {
  //           console.log('Ошибка при загрузке аватара', err);
  //           return next(
  //             ApiError.BadRequest(
  //               'При загрузке файла произошла ошибка. Попробуйте еще раз.',
  //               'danger'
  //             )
  //           );
  //         }
  //       });

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

  //   async deleteAvatar(userId) {
  //     const user = await User.findById(userId);

  //     if (!user) {
  //       throw ApiError.BadRequest(
  //         'Произошла ошибка, пользователь не найден',
  //         'danger'
  //       );
  //     }

  //     user.avatar = '';
  //     await user.save();
  //   }

  //   async getAllUsers() {
  //     const users = await User.find();
  //     return users;
  //   }
}

module.exports = new UserService();
