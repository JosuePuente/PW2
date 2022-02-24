const faker = require('faker');
const boom = require('@hapi/boom');

class LevelsService {

  constructor() {
    this.levels = [];
    this.generate();
  }

  generate() {
    const limit = 50;
    for (let index = 0; index < limit; index++)
      this.levels.push({
        idLevel: faker.datatype.uuid(),
        title: faker.random.words(),
        video: faker.image.imageUrl(),
        description: faker.random.words(),
        number: faker.datatype.number(),
        course: faker.random.words()
      });

  }

  find(size) {
    const levels = this.levels.filter((item, index) => item && index < size);
    if (!levels || levels.length < 1)
      throw boom.notFound('No hay cursos aún');
    return levels;
  }

  create(data) {
    const newLevel = {
      idLevel: faker.datatype.uuid(),
      ...data //PASAR TODOS LOS ELEMENTOS
    }
    this.levels.push(newLevel);
    return newLevel;
  }

  findOne(idLevel) {
    const level = this.levels.find((item) => item.idLevel === idLevel)
    if (!level)
      throw boom.notFound('Id Nivel no encontrado');
    return level;
  }

  update(idLevel, changes) {
    const index = this.levels.findIndex(item => item.idLevel === idLevel);
    if (index === -1)
      throw boom.notFound('No existe ese nivel');

    var currentLevels = this.levels[index];
    this.levels[index] = {
      ...currentLevels,
      ...changes
    };
    return {
      old: currentLevels,
      changed: this.levels[index]
    }
  }

  delete(idLevel) {
    const index = this.levels.findIndex(item => item.idLevel === idLevel);
    if (index === -1)
      throw boom.notFound('Nivel no encontrado para eliminar');
    var currentLevels = this.levels[index];
    this.levels.splice(index, 1);
    return currentLevels;
  }

}

module.exports = LevelsService;
