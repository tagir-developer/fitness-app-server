const Muscle = require('../models/muscle');
const MuscleGroup = require('../models/muscleGroup');

class MuscleService {
  async getMusclesByMuscleGroupId(muscleGroupId) {
    // const result = await MuscleGroup.findOne({
    //   where: { id: muscleGroupId },
    //   include: {
    //     model: 'MuscleGroupsMuscles',
    //     through: {
    //       attributes: [],
    //     },
    //   },
    // });

    const muscleGroup = await MuscleGroup.findByPk(muscleGroupId);

    const muscles = await muscleGroup.getMuscles();

    console.log('result ----------- muscles', muscles);

    return muscles;
  }

  async createMuscleGroups() {
    await MuscleGroup.bulkCreate([
      {
        id: 'a2f2576d-0c04-46ef-bdb6-60f213c57c02',
        name: 'Торс',
        previewImage: 'img-1',
        order: 1,
      },
      {
        id: '589afd94-5f26-42e7-931b-67f5f9447afc',
        name: 'Руки',
        previewImage: 'img-2',
        order: 2,
      },
      {
        id: 'e4ee9138-e97e-4807-8921-13c15ab023e7',
        name: 'Ноги',
        previewImage: 'img-3',
        order: 3,
      },
    ]);

    return 'Мышечные группы успешно добавлены';
  }

  async createManyMuscles() {
    const musclesData = [
      {
        id: '689d6d10-10c1-41cd-8d48-c83e17e9d41e',
        name: 'Большая грудная мышца',
        description: [
          {
            title: 'Большая грудная мышца',
            text: 'Длинный текст описания грудной мышцы',
          },
          { text: 'Второй абзац описания грудной мышцы' },
        ],
        previewImage: 'img-1',
        descriptionImages: ['muscle-1-img-1'],
        muscleGroupsIds: ['a2f2576d-0c04-46ef-bdb6-60f213c57c02'],
      },
      {
        id: '8edb8523-3a30-4d07-82fa-1c420032d78f',
        name: 'Трицепс',
        description: [
          { title: 'Трицепс', text: 'Длинный текст описания мышцы: трицепс' },
          { text: 'Второй абзац описания мышцы: трицепс' },
        ],
        previewImage: 'img-2',
        descriptionImages: ['muscle-2-img-1'],
        muscleGroupsIds: ['589afd94-5f26-42e7-931b-67f5f9447afc'],
      },
      {
        id: '46291845-6daa-4d1d-af18-eeefba73e26d',
        name: 'Дельтовидная мышца',
        description: [
          {
            title: 'Дельтовидная мышца',
            text: 'Длинный текст описания мышцы: трицепс',
          },
          { text: 'Второй абзац описания мышцы: трицепс' },
          { text: 'Третий абзац описания мышцы: трицепс' },
        ],
        previewImage: 'img-3',
        descriptionImages: ['muscle-3-img-1'],
        muscleGroupsIds: ['589afd94-5f26-42e7-931b-67f5f9447afc'],
      },
    ];

    for (let i = 0; i < musclesData.length; i++) {
      const muscle = musclesData[i];

      const createdMuscle = await Muscle.create({
        id: muscle.id,
        name: muscle.name,
        description: muscle.description,
        previewImage: muscle.previewImage,
        descriptionImages: muscle.descriptionImages,
      });

      // создаем связь между мышцой и мышечной группой (частью тела)
      for (let j = 0; j < muscle.muscleGroupsIds.length; j++) {
        const muscleGroupId = muscle.muscleGroupsIds[j];

        const muscleGroup = await MuscleGroup.findByPk(muscleGroupId);

        await muscleGroup.addMuscle(createdMuscle);
      }
    }

    return 'Мышцы успешно добавлены';
  }
}

module.exports = new MuscleService();
