const ApiError = require('../exeptions/apiError');
const DayExercise = require('../models/dayExercise');
const Program = require('../models/program');
const TrainingDay = require('../models/trainingDay');
const User = require('../models/user');

class TrainingProgramService {
  async createProgram(userId, programData) {
    // const {
    //   id,
    //   name,
    //   description,
    //   isUserProgram,
    //   previewImage,
    //   descriptionImages,
    //   trainingDays,
    // } = programData;

    const { trainingDays, ...programFields } = programData;

    // создаем программу
    const program = await Program.create(programFields);

    if (!program) {
      throw ApiError.BadRequest('Не удалось создать программу', 'danger');
    }

    // если передан userId и пользователь найден, значит программа пользовательская и привязываем к ней пользователя
    const user = await User.findByPk(userId);

    if (user) {
      await program.setUser(user);
    }

    // проходимся по массиву дней и создаем новые дни, привязанные к программе
    for (let i = 0; i < trainingDays.length; i++) {
      const day = trainingDays[i];

      const createdDay = await TrainingDay.create({
        name: day.name,
      });

      // если не удалось добавить день, удаляем программу и пробрасываем ошибку
      if (!createdDay) {
        await program.destroy();

        throw ApiError.BadRequest(
          'Не удалось создать программу. Не удалось добавить в программу тренировочный день',
          'danger'
        );
      }

      await createdDay.setProgram(program);

      // проходимся по всем упражнениям дня и привязываем их ко дню
      for (let j = 0; j < day.exercises.length; j++) {
        const exercise = day.exercises[j];

        const exerciseData = await DayExercise.create({
          exerciseId: exercise.exerciseId,
          name: exercise.name,
          muscleGroups: exercise.muscleGroups,
        });

        if (!exerciseData) {
          await program.destroy();
          await createdDay.destroy();

          throw ApiError.BadRequest(
            'Не удалось создать программу. Не удалось добавить в программу тренировочный день',
            'danger'
          );
        }

        await exerciseData.setTrainingDay(createdDay);
      }
    }

    return program;
  }

  async copyProgram(programId) {
    const program = await Program.findByPk(programId);
    const programCopy = { ...program, name: program.name + ' (Копия)' };
    // ? Проверить привязывается ли к копии программы id пользователя
    const newProgram = await Program.create(programCopy);
    return newProgram;
  }

  async changeProgramName(programId, newProgramName) {
    const program = await Program.findByPk(programId);
    program.name = newProgramName;
    await program.save();
    return program;
  }

  async deleteProgram(programId) {
    const program = await Program.findByPk(programId);
    await program.destroy();
    return 'Программа успешно удалена';
  }

  async setActiveUserProgram(userId, programId) {
    const user = await User.findByPk(userId);
    user.activeProgramId = programId;
    return 'Программа пользователя изменена';
  }
}

module.exports = new TrainingProgramService();
