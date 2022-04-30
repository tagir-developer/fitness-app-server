module.exports = class ApiError extends Error {
  status;
  errors;
  messageType;

  constructor(status, message, messageType = 'danger', errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.messageType = messageType;
  }

  static UnauthorizedError() {
    // Сообщение ошибки ('Unauthorized') должно совпадать с константой на клиенте
    return new ApiError(401, 'Unauthorized');
  }

  static BadRequest(message, messageType = 'danger', errors = []) {
    return new ApiError(400, message, messageType, errors);
  }
};
