const faker = require('faker');
const boom = require('@hapi/boom');
const LevelModel = require('./../models/levels.model');

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
        level: faker.random.words()
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

  /////////////////////////////////////////////////////////////////////DB METHODS

  async findDB(limit, filter) {
    let levelsDB = await LevelModel.find(filter);

    if (!levelsDB || levelsDB.length < 1)
      throw boom.notFound('No hay registros actualmente');

    levelsDB = limit ? levelsDB.filter((item, index) => item && index < limit) : levelsDB;
    return levelsDB;
  }

  async createDB(data) {
    const model = new LevelModel(data);
    await model.save();
    return data;
  }

  async findOneDB(id) {
    try {

      const level = await LevelModel.findOne({
        _id: id
      });
      if (!level)
        throw boom.notFound('No se ha encontrado coincidencia');
      return level;

    } catch (error) {
      throw boom.conflict("Error: " + error.message)
    }
  }

  async updateDB(id, changes) {
    let level = await LevelModel.findOne({
      _id: id
    });
    if (!level)
      throw boom.notFound('No se ha encontrado coincidencia');

    let levelOrigin = {
      title: level.title,
      video: level.video,
      description: level.description,
      number: level.number,
      course: level.course
    };

    const { title, video, description, number, course } = changes;
    level.title = title;
    level.video = video;
    level.description = description;
    level.number = number;
    level.course = course;
    level.save();

    return {
      old: levelOrigin,
      changed: level
    }
  }

  async deleteDB(id) {
    let level = await LevelModel.findOne({
      _id: id
    });
    const { deletedCount } = await LevelModel.deleteOne({
      _id: id
    });
    if (deletedCount <= 0)
      throw boom.notFound('No se ha encontrado coincidencia');
    return level;
  }

}

module.exports = LevelsService;
