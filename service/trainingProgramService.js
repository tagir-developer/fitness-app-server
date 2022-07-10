const { Op } = require('sequelize');
const ApiError = require('../exeptions/apiError');
const DayExercise = require('../models/dayExercise');
const Program = require('../models/program');
const TrainingDay = require('../models/trainingDay');
const User = require('../models/user');

class TrainingProgramService {
  async createProgram(userId, programData) {
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

        console.log('exerciseData-----------', exerciseData);

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

  async updateProgram(programId, programData) {
    const { trainingDays, ...programFields } = programData;

    // находим программу
    const program = await Program.findByPk(programId);

    if (!program) {
      throw ApiError.BadRequest('Не удалось обновить программу', 'danger');
    }

    let prevDayIds = await program
      .getDays({ attributes: ['id'], raw: true })
      .then((data) => data.map((day) => day.id));

    // console.log('prevDayIds==========================', prevDayIds);

    // проходимся по массиву дней и создаем новые дни, привязанные к программе
    for (let i = 0; i < trainingDays.length; i++) {
      const day = trainingDays[i];

      // если день с таким id уже есть, то обновляем его
      if (prevDayIds.includes(day.id)) {
        const updatedDay = await TrainingDay.findByPk(day.id);

        if (!updatedDay) {
          throw ApiError.BadRequest(
            'Не удалось обновить программу. Не удалось найти тренировочный день по id',
            'danger'
          );
        }

        updatedDay.name = day.name;
        await updatedDay.save();

        const dayExercises = await updatedDay.getExercises({ raw: true });

        let prevExercisesIds = dayExercises.map((exercise) => exercise.id);

        for (let j = 0; j < dayExercises.length; j++) {
          const exercise = dayExercises[j];

          // обновляем упражнение дня
          if (prevExercisesIds.includes(exercise.id)) {
            const updatedExercise = await DayExercise.findByPk(exercise.id);

            if (!updatedExercise) {
              await updatedDay.destroy();
              throw ApiError.BadRequest(
                'Не удалось обновить программу. Не удалось добавить в программу новый тренировочный день',
                'danger'
              );
            }

            updatedExercise.name = exercise.name;
            updatedExercise.muscleGroups = exercise.muscleGroups;

            await updatedExercise.save();

            // удаляем из массива prevExercisesIds id обновленного упражнения, чтобы там остались id упражнений, которые нужно удалить
            prevExercisesIds = prevExercisesIds.filter(
              (exerciseId) => exerciseId !== exercise.id
            );
            // создаем новое упражнение дня
          } else {
            const exerciseData = await DayExercise.create({
              name: exercise.name,
              muscleGroups: exercise.muscleGroups,
            });

            if (!exerciseData) {
              await updatedDay.destroy();

              throw ApiError.BadRequest(
                'Не удалось обновить программу. Не удалось добавить в программу новый тренировочный день',
                'danger'
              );
            }

            await exerciseData.setTrainingDay(updatedDay);
          }
        }

        await dayExercises.destroy({
          where: {
            id: {
              [Op.or]: prevExercisesIds,
            },
          },
        });

        // удаляем из массива prevDayIds id обнного дня, чтобы в последующем выяснить, нужно ли удалять какой-либо из дней
        prevDayIds = prevDayIds.filter((dayId) => dayId !== day.id);

        // дня с таким id не было, поэтому создадим новый
      } else {
        const createdDay = await TrainingDay.create({
          name: day.name,
        });

        // если не удалось добавить день, пробрасываем ошибку
        if (!createdDay) {
          throw ApiError.BadRequest(
            'Не удалось обновить программу. Не удалось добавить в программу новый тренировочный день',
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
            await createdDay.destroy();

            throw ApiError.BadRequest(
              'Не удалось обновить программу. Не удалось добавить в программу новый тренировочный день',
              'danger'
            );
          }

          await exerciseData.setTrainingDay(createdDay);
        }
      }

      await prevDayIds.destroy({
        where: {
          id: {
            [Op.or]: prevDayIds,
          },
        },
      });
    }

    return program;
  }

  async copyProgram(programId) {
    const program = await Program.findByPk(programId, { raw: true });

    if (!program) {
      throw ApiError.BadRequest('Не удалось найти программу по id', 'danger');
    }

    delete program.id;
    program.name = program.name + ' (Копия)';

    const newProgram = await Program.create(program);
    return newProgram;
  }

  async changeProgramName(programId, newProgramName) {
    const program = await Program.findByPk(programId);

    if (!program) {
      throw ApiError.BadRequest('Не удалось найти программу по id', 'danger');
    }

    program.name = newProgramName;
    await program.save();

    return program;
  }

  async deleteProgram(programId) {
    const program = await Program.findByPk(programId);

    if (!program) {
      throw ApiError.BadRequest('Не удалось найти программу по id', 'danger');
    }

    if (program.isUserActiveProgram) {
      throw ApiError.BadRequest(
        'Нельзя удалить активную программу пользователя',
        'danger'
      );
    }

    await program.destroy();

    return 'Программа успешно удалена';
  }

  async setActiveUserProgram(programId) {
    const program = await Program.findByPk(programId);
    const oldActiveProgram = await Program.findOne({
      where: { isUserActiveProgram: true },
    });

    if (!program || !oldActiveProgram) {
      throw ApiError.BadRequest('Не удалось найти программу по id', 'danger');
    }

    program.isUserActiveProgram = true;
    await program.save();

    oldActiveProgram.isUserActiveProgram = false;
    await oldActiveProgram.save();

    return 'Программа пользователя изменена';
  }
}

module.exports = new TrainingProgramService();
