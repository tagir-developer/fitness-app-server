const ApiError = require('../exeptions/apiError');
const Exercise = require('../models/exercise');
const ExerciseMuscles = require('../models/exerciseMuscles');
const MuscleGroup = require('../models/muscleGroup');
const muscleService = require('./muscleService');

class ExerciseService {
  async createManyExercises() {
    const exercisesData = [
      {
        id: '4296e635-ecfb-4032-9b55-279b856a58aa',
        name: 'Жим штанги лежа',
        description: [
          {
            title: 'Жим штанги лежа',
            text: 'Занимаем исходную позицию: ложимся на скамью, стараемся свести лопатки и немного прогнуться в пояснице, при этом ягодицы, верхняя часть спины и голова должны быть плотно прижаты к скамье. Ступнями плотно упираемся в пол, статически напрягаем квадрицепсы. Гриф штанги должен располагаться примерно на уровне глаз.',
          },
          {
            text: 'Плавно и подконтрольно опускаем штангу вниз, сопровождая это движение глубоким вдохом. Не делая резких движений, пустите штангу на низ груди. Если Вы работаете на силу, рекомендую сделать паузу на груди на 1-2 секунды, так жимовое движение получится более взрывным. Если Вы работаете на массу, делать это не обязательно, приступайте к жиму сразу после касания штангой низа груди.',
          },
          {
            text: 'Выжимаем штангу вверх усилием грудных мышц и трицепсов. Делаем мощный выдох. При этом локти не должны менять своей позицией, «заведение» локтей внутрь чревато получением травмы. Чтобы ментально лучше сконцентрироваться на жиме штанги, попробуйте следующий прием: как только Вы начали поднимать штангу, постарайтесь максимально вдавиться всем корпусом в скамью, как бы «удаляясь» от штанги, задавая тем самым мощное ускорение для подъема снаряда. Так Вы сможете лучше прочувствовать биомеханику движения и сможете поднять больший вес. Как только Вы выполнили повторение в полную амплитуду и полностью выпрямили локти, повторите снова.',
          },
          {
            text: 'Повторяюсь, данная техника – просто образец выполнения жима штанги лежа, но в зависимости от Ваших целей, она может видоизменяться. Если Вы занимаетесь пауэрлифтингом, Вам необходимо делать сильный прогиб в пояснице, чтобы укоротить амплитуду, а также немного помогать себя широчайшими и ногами, выдавливая штангу вверх. Если Вам больше интересен жим на максимальное количество повторений, следует опускать штангу на грудь максимально быстро, чтобы она «отскакивала» от груди и проходила часть амплитуды за счет силы инерции. Если же Ваша цель – тщательно проработать грудные мышцы, опускайте штангу вниз более плавно, концентрируясь на растяжении и сокращении нижнего отдела грудных.',
          },
        ],
        previewImage: 'img-1',
        descriptionImages: ['exercise-1-img-1'],
        similarExercisesIds: ['8ff78c4c-2398-47f4-bdda-b43703642ee3'],
        associatedMuscles: [
          {
            muscleId: '689d6d10-10c1-41cd-8d48-c83e17e9d41e',
            muscleWorkLevel: 1,
          },
          {
            muscleId: '8edb8523-3a30-4d07-82fa-1c420032d78f',
            muscleWorkLevel: 1,
          },
          {
            muscleId: '46291845-6daa-4d1d-af18-eeefba73e26d',
            muscleWorkLevel: 2,
          },
        ],
        muscleGroupsIds: [
          'a2f2576d-0c04-46ef-bdb6-60f213c57c02',
          '589afd94-5f26-42e7-931b-67f5f9447afc',
        ],
      },
      {
        id: '8ff78c4c-2398-47f4-bdda-b43703642ee3',
        name: 'Жим штанги узким хватом',
        description: [
          { title: 'Заголовок упражнения 2', text: 'Длинный текст описания' },
          { text: 'Второй абзац описания упражнения' },
        ],
        previewImage: 'img-2',
        descriptionImages: ['exercise-2-img-1'],
        similarExercisesIds: ['4296e635-ecfb-4032-9b55-279b856a58aa'],
        associatedMuscles: [
          {
            muscleId: '8edb8523-3a30-4d07-82fa-1c420032d78f',
            muscleWorkLevel: 1,
          },
          {
            muscleId: '689d6d10-10c1-41cd-8d48-c83e17e9d41e',
            muscleWorkLevel: 2,
          },
        ],
        muscleGroupsIds: [
          'a2f2576d-0c04-46ef-bdb6-60f213c57c02',
          '589afd94-5f26-42e7-931b-67f5f9447afc',
        ],
      },
      {
        id: '10e7ec6f-153f-4658-b894-ab0f6d9f6395',
        name: 'Разведения рук с гантелями в стороны (махи)',
        description: [
          {
            title: 'Разведения рук с гантелями в стороны (махи)',
            text: 'Длинный текст описания',
          },
          { text: 'Второй абзац описания упражнения' },
        ],
        previewImage: 'img-3',
        descriptionImages: ['exercise-3-img-1', 'exercise-3-img-2'],
        similarExercisesIds: ['4296e635-ecfb-4032-9b55-279b856a58aa'],
        associatedMuscles: [
          {
            muscleId: '46291845-6daa-4d1d-af18-eeefba73e26d',
            muscleWorkLevel: 1,
          },
        ],
        muscleGroupsIds: ['589afd94-5f26-42e7-931b-67f5f9447afc'],
      },
    ];

    await muscleService.createMuscleGroups();
    await muscleService.createManyMuscles();

    for (let i = 0; i < exercisesData.length; i++) {
      const exerciseData = exercisesData[i];

      const createdExercise = await Exercise.create({
        id: exerciseData.id,
        name: exerciseData.name,
        description: exerciseData.description,
        previewImage: exerciseData.previewImage,
        descriptionImages: exerciseData.descriptionImages,
      });

      // создаем связь между упражнением и мышечными группами
      for (let j = 0; j < exerciseData.associatedMuscles.length; j++) {
        const muscle = exerciseData.associatedMuscles[j];

        await ExerciseMuscles.create({
          ExerciseId: exerciseData.id,
          MuscleId: muscle.muscleId,
          muscleWorkLevel: muscle.muscleWorkLevel,
        });
      }

      // создаем связь между похожими упражнениями
      for (let x = 0; x < exerciseData.similarExercisesIds.length; x++) {
        const similarExerciseId = exerciseData.similarExercisesIds[x];

        const similarExercise = await Exercise.findByPk(similarExerciseId);

        await createdExercise.addSimilarExercise(similarExercise);
      }

      // создаем связь между упражнением и мышечной группой (частью тела)
      for (let y = 0; y < exerciseData.muscleGroupsIds.length; y++) {
        const muscleGroupId = exerciseData.muscleGroupsIds[y];

        const muscleGroup = await MuscleGroup.findByPk(muscleGroupId);

        await muscleGroup.addExercise(createdExercise);
      }
    }

    return 'Упражнения успешно добавлены';
  }
}

module.exports = new ExerciseService();
