const ApiError = require('../exeptions/apiError');
const Exercise = require('../models/exercise');

class ExerciseService {
  async createExercise(exerciseData) {
    const { name, description, previewImage, descriptionImages } = exerciseData;

    // создаем программу
    const exercise = await Exercise.create({
      name,
      description,
      previewImage,
      descriptionImages,
    });

    console.log('СОЗДАННОЕ УПРАЖНЕНИЕ', exercise);

    if (!exercise) {
      throw ApiError.BadRequest('Не удалось создать упражнение', 'danger');
    }

    return exercise;
  }
}

module.exports = new ExerciseService();
