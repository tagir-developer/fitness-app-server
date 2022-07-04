const ApiError = require('../exeptions/apiError');
const Exercise = require('../models/exercise');
const Program = require('../models/program');
const TrainingDay = require('../models/trainingDay');
const User = require('../models/user');

class TrainingProgramService {
  async createProgram(userId, programData) {
    const {
      id,
      name,
      description,
      isUserProgram,
      previewImage,
      descriptionImages,
      trainingDays,
    } = programData;

    // создаем программу
    const program = await Program.create({
      id,
      name,
      description,
      isUserProgram,
      previewImage,
      descriptionImages,
    });

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
        const exerciseData = await Exercise.findByPk(exercise.exerciseId);

        if (!exerciseData) {
          await program.destroy();
          await createdDay.destroy();

          throw ApiError.BadRequest(
            'Не удалось создать программу. Не удалось добавить в программу тренировочный день',
            'danger'
          );
        }

        await createdDay.addExercise(exerciseData);
      }

      console.log(
        'Изначальное кол-во упражнений для дня',
        day.exercises.length
      );
      console.log(
        'Кол-во добавленных упражнений',
        await createdDay.countExercises()
      );
    }

    return program;
  }

  // async createProgram(userId, password) {
  //   const user = await User.findById(userId);
  //   if (!user) {
  //     throw ApiError.BadRequest(
  //       'Произошла ошибка, пользователь не найден',
  //       'danger'
  //     );
  //   }
  //   user.password = await bcrypt.hash(password, 12);
  //   await user.save();
  // }
}

module.exports = new TrainingProgramService();
