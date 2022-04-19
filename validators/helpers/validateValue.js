const validateValue = async (value, validators, stopAfterError = false) => {
  const errors = [];

  for (let i = 0; i <= validators.length - 1; i++) {
    const item = validators[i];

    const isValid = await item.validator(value);

    if (!isValid) {
      errors.push(item.message);

      if (stopAfterError) {
        console.log('VALIDATION ERROR: ', item.message);
        throw new Error(item.message);
      }
    }
  }

  if (errors.length > 0) {
    console.log('VALIDATION ERRORS: ', errors);
  }

  if (!stopAfterError && errors.length > 0) {
    const errorMessage = errors.join('. ');
    throw new Error(errorMessage);
  }
};

module.exports = { validateValue };
