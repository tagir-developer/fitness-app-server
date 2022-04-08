const { validationResult } = require("express-validator")

const combineErrorMessages = (validationErrors) => {
	return validationErrors.array().map(i => i.msg).join('; ')
}

const createErrorFieldsArray = (validationErrors) => {
	const errorsArray = validationErrors.array().map(i => i.param)
	const clearErrors = [...new Set(errorsArray)]
	return clearErrors
}

module.exports = class ApiError extends Error {
	status
	errors
	messageType

	constructor(status, message, messageType = 'danger', errors = []) {
		super(message)
		this.status = status
		this.errors = errors
		this.messageType = messageType
	}

	static UnauthorizedError() {
		return new ApiError(401, 'Пользователь не авторизован')
	}

	static BadRequest(message, messageType = 'danger', errors = []) {
		return new ApiError(400, message, messageType, errors)
	}

	static ValidationErrorChecking(req) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throw ApiError.BadRequest(combineErrorMessages(errors), 'danger', createErrorFieldsArray(errors))
		}
	}
}