const { isLength, isEmpty } = require('validator');
const { isStringArray } = require('./helpers/customValidationHelpers');
const { validateValue } = require('./helpers/validateValue');

const validateAndNormalizeProgramData = async (program) => {
  const name = program.name.trim();
  const description = program.description.trim();
  const days = program.days;

  await validateValue(name, [
    {
      validator: (value) => isEmpty(value),
      message: 'Имя программы не может быть пустым',
    },
  ]);

  if (!program.isUserProgram) {
    await validateValue(description, [
      {
        validator: (value) => isEmpty(value),
        message: 'Описание программы не может быть пустым',
      },
      {
        validator: (value) => isLength(value, { min: 30, max: undefined }),
        message: 'Описание программы должно быть длиннее 30 символов',
      },
    ]);
  }

  await validateValue(program.previewImage, [
    {
      validator: (value) => isEmpty(value),
      message: 'Поле previewImage не может быть пустым',
    },
  ]);

  await validateValue(program.descriptionImages, [
    {
      validator: (value) => isStringArray(value),
      message: 'Поле descriptionImages должно быть массивом строковых значений',
    },
  ]);

  const normalizedData = {
    ...program,
    name,
    description,
  };

  return normalizedData;
};

module.exports = {
  validateAndNormalizeProgramData,
};
