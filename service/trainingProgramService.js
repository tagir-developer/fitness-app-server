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
      days,
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

    console.log('СОЗДАННАЯ ПРОГРАММА', program);

    if (!program) {
      throw ApiError.BadRequest('Не удалось создать программу', 'danger');
    }

    // если передан userId и пользователь найден, значит программа пользовательская и привязываем к ней пользователя
    const user = await User.findByPk(userId);

    console.log('ПОЛЬЗОВАТЕЛЬ', user);

    if (user) {
      await program.setUser(user);
    }

    // проходимся по массиву дней и создаем новые дни, привязанные к программе
    for (const day in days) {
      const createdDay = await TrainingDay.create({
        name: day.name,
      });

      console.log('ДОБАВЛЕННЫЙ ДЕНЬ', createdDay);

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
      for (const exercise in day.exercises) {
        const exerciseData = await Exercise.findByPk(exercise.exerciseId);

        if (!exerciseData) {
          await program.destroy();
          await createdDay.destroy();

          throw ApiError.BadRequest(
            'Не удалось создать программу. Не удалось добавить в программу тренировочный день',
            'danger'
          );
        }

        await createdDay.addExercises(exerciseData);
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
