const { isLength, isEmpty, isUUID } = require('validator');
const { isStringArray } = require('./helpers/customValidationHelpers');
const { validateValue } = require('./helpers/validateValue');

const validateAndNormalizeProgramData = async (program) => {
  const name = program.name.trim();

  await validateValue(name, [
    {
      validator: (value) => !isEmpty(value),
      message: 'Имя программы не может быть пустым',
    },
  ]);

  if (!program.isUserProgram && program.description) {
    await validateValue(program.description, [
      {
        validator: (value) => !isEmpty(value),
        message: 'Описание программы не может быть пустым',
      },
      {
        validator: (value) => isLength(value, { min: 30, max: undefined }),
        message: 'Описание программы должно быть длиннее 30 символов',
      },
    ]);
  }

  if (program.previewImage) {
    await validateValue(program.previewImage, [
      {
        validator: (value) => !isEmpty(value),
        message: 'Поле previewImage не может быть пустым',
      },
    ]);
  }

  if (program.descriptionImages) {
    await validateValue(program.descriptionImages, [
      {
        validator: (value) => isStringArray(value),
        message:
          'Поле descriptionImages должно быть массивом строковых значений',
      },
    ]);
  }

  for (let i = 0; i < program.trainingDays.length; i++) {
    const day = program.trainingDays[i];

    await validateValue(day.name, [
      {
        validator: (value) => !isEmpty(value),
        message: 'Имя тренировочного дня не может быть пустым',
      },
    ]);

    for (let j = 0; j < day.exercises.length; j++) {
      const exercise = day.exercises[j];

      // console.log('4444444444', exercise);

      await validateValue(exercise.exerciseId, [
        {
          validator: (value) => isUUID(value),
          message: 'Поле exerciseId упражнения должно быть UUID',
        },
      ]);
    }
  }

  const normalizedData = {
    ...program,
    name,
  };

  return normalizedData;
};

module.exports = {
  validateAndNormalizeProgramData,
};
