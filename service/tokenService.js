const jwt = require('jsonwebtoken');
const Token = require('../models/token');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ where: { userId: userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }

    const token = await Token.create({ userId: userId, refreshToken });
    return token;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async removeToken(token) {
    const tokenData = await Token.destroy({
      where: { refreshToken: token },
    });
    // TODO: Проверить возвращает ли метод destroy token
    return tokenData;
  }

  async findToken(token) {
    const tokenData = await Token.findOne({ where: { refreshToken: token } });
    return tokenData;
  }
}

module.exports = new TokenService();
