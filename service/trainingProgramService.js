const { Op } = require('sequelize');
const { v4 } = require('uuid');
const ApiError = require('../exeptions/apiError');
const DayExercise = require('../models/dayExercise');
const Program = require('../models/program');
const TrainingDay = require('../models/trainingDay');
const User = require('../models/user');

class TrainingProgramService {
  async getProgramById(programId) {
    return await Program.findByPk(programId, {
      include: {
        model: TrainingDay,
        as: 'days',
        include: { model: DayExercise, as: 'exercises' },
      },
    });
  }

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
        id: day.id,
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
          id: exercise.id,
          name: exercise.name,
          exerciseId: exercise.exerciseId,
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

  async updateProgram(programId, trainingDays) {
    const program = await Program.findByPk(programId);

    if (!program) {
      throw ApiError.BadRequest(
        'Не удалось обновить программу. Не найдена программа с таким id',
        'danger'
      );
    }

    let prevDayIds = await program
      .getDays({ attributes: ['id'], raw: true })
      .then((data) => data.map((day) => day.id));

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

        let prevExercisesIds = await updatedDay
          .getExercises({ attributes: ['id'], raw: true })
          .then((data) => data.map((exercise) => exercise.id));

        for (let j = 0; j < day.exercises.length; j++) {
          const exercise = day.exercises[j];

          // обновляем упражнение дня
          if (prevExercisesIds.includes(exercise.id)) {
            const updatedExercise = await DayExercise.findByPk(exercise.id);

            console.log('Обновляемое упражнение ---', updatedExercise);

            if (!updatedExercise) {
              throw ApiError.BadRequest(
                'Не удалось обновить программу. Не удалось обновить тренировочный день',
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
              exerciseId: exercise.exerciseId,
              muscleGroups: exercise.muscleGroups,
            });

            if (!exerciseData) {
              throw ApiError.BadRequest(
                'Не удалось обновить программу. Не удалось добавить упражнение в тернировочный день',
                'danger'
              );
            }

            await exerciseData.setTrainingDay(updatedDay);
          }
        }

        if (prevExercisesIds.length > 0) {
          await DayExercise.destroy({
            where: {
              id: {
                [Op.or]: prevExercisesIds,
              },
            },
          });
        }

        await updatedDay.save();

        // удаляем из массива prevDayIds id обновленного дня, чтобы в последующем выяснить, нужно ли удалять какой-либо из дней
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
    }

    // удаляем дни и привязанные упражнения
    if (prevDayIds.length > 0) {
      await DayExercise.destroy({
        where: {
          TrainingDayId: {
            [Op.or]: prevDayIds,
          },
        },
      });

      await TrainingDay.destroy({
        where: {
          id: {
            [Op.or]: prevDayIds,
          },
        },
      });
    }

    return program;
  }

  async copyProgram(userId, programId) {
    const program = await Program.findByPk(programId);

    if (!program) {
      throw ApiError.BadRequest('Не удалось найти программу по id', 'danger');
    }

    const newProgramData = {};

    newProgramData.id = v4();
    newProgramData.name = program.name + ' (Копия)';
    newProgramData.description = program.description;
    newProgramData.isUserProgram = true;
    newProgramData.isUserActiveProgram = false;
    newProgramData.previewImage = program.previewImage;
    newProgramData.descriptionImages = program.descriptionImages;
    newProgramData.trainingDays = [];

    const programDays = await program.getDays();

    for (let i = 0; i < programDays.length; i++) {
      const day = programDays[i];

      const dayCopy = {
        id: v4(),
        name: day.name,
        exercises: [],
      };

      const dayExercises = await day.getExercises();

      for (let j = 0; j < dayExercises.length; j++) {
        const exercise = dayExercises[j];

        const exerciseCopy = {
          id: v4(),
          name: exercise.name,
          exerciseId: exercise.exerciseId,
          muscleGroups: exercise.muscleGroups,
        };

        dayCopy.exercises = [...dayCopy.exercises, exerciseCopy];
      }

      newProgramData.trainingDays = [...newProgramData.trainingDays, dayCopy];
    }

    const newProgram = await this.createProgram(userId, newProgramData);
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

    const programDays = await program.getDays();

    for (let i = 0; i < programDays.length; i++) {
      const dayToBeDeleted = programDays[i];

      const dayExercises = await dayToBeDeleted.getExercises();

      for (let j = 0; j < dayExercises.length; j++) {
        const exercise = dayExercises[j];

        await exercise.destroy();
      }

      await dayToBeDeleted.destroy();
    }

    await program.destroy();

    return 'Программа успешно удалена';
  }

  async setActiveUserProgram(programId) {
    const program = await Program.findByPk(programId);
    const oldActiveProgram = await Program.findOne({
      where: { isUserActiveProgram: true },
    });

    if (!program) {
      throw ApiError.BadRequest('Не удалось найти программу по id', 'danger');
    }

    program.isUserActiveProgram = true;
    await program.save();

    if (oldActiveProgram) {
      oldActiveProgram.isUserActiveProgram = false;
      await oldActiveProgram.save();
    }

    return 'Программа пользователя изменена';
  }
}

module.exports = new TrainingProgramService();
