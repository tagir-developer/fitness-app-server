const userService = require('../service/userService');
const ApiError = require('../exeptions/apiError');
const crypto = require('crypto');

class authController {
  async registration(req, res, next) {
    try {
      ApiError.ValidationErrorChecking(req);

      const { email, password, name } = req.body;

      const userData = await userService.registration(email, password, name);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json({
        ...userData,
        messageType: 'success',
        message: 'Пользователь успешно создан',
      });
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      ApiError.ValidationErrorChecking(req);

      const { email, password } = req.body;

      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json({
        ...userData,
        messageType: 'success',
        message: 'Пользователь вошел в систему',
      });
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json({ ...userData });
    } catch (e) {
      next(e);
    }
  }

  async reset(req, res, next) {
    try {
      const buffer = await crypto.randomBytes(32);

      if (!buffer) {
        return next(
          ApiError.BadRequest(
            'Что-то пошло не так, повторите попытку позже',
            'danger'
          )
        );
      }

      const token = buffer.toString('hex');
      const { email } = req.body;

      await userService.reset(email, token);

      return res.json({
        messageType: 'success',
        message: 'Ссылка для сброса пароля отправлена на указанный email адрес',
        errors: [],
      });
    } catch (e) {
      next(e);
    }
  }

  async password(req, res, next) {
    try {
      const resetData = await userService.password(req.params.token);
      res.json({ ...resetData });
    } catch (e) {
      next(e);
    }
  }

  async newPassword(req, res, next) {
    try {
      ApiError.ValidationErrorChecking(req);

      const { password, userId, token } = req.body;

      await userService.newPassword(password, userId, token);

      return res.json({
        messageType: 'success',
        message: 'Ваш пароль успешно изменен!',
        errors: [],
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new authController();
