const { Op } = require('sequelize');
const ApiError = require('../exeptions/apiError');
const { musclesData, muscleGroups } = require('../mockdata/muscles');
const Muscle = require('../models/muscle');
const MuscleGroup = require('../models/muscleGroup');

class MuscleService {
  async getAllMuscles(searchText) {
    if (searchText) {
      return await Muscle.findAll({
        where: {
          name: {
            [Op.substring]: searchText,
          },
        },
      });
    }

    return await Muscle.findAll();
  }

  async getMusclesByMuscleGroupId(muscleGroupId, searchText) {
    const muscleGroup = await MuscleGroup.findByPk(muscleGroupId);

    if (!muscleGroup) {
      throw ApiError.BadRequest('Не удалось найти мышечную группу по id');
    }

    if (searchText) {
      return await muscleGroup.getMuscles({
        where: {
          name: {
            [Op.substring]: searchText,
          },
        },
      });
    }

    return await muscleGroup.getMuscles();
  }

  async createMuscleGroups() {
    await MuscleGroup.bulkCreate(muscleGroups);

    return 'Мышечные группы успешно добавлены';
  }

  async createManyMuscles() {
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
