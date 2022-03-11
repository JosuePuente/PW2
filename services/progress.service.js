const faker = require('faker');
const boom = require('@hapi/boom');
const ProgressModel = require('./../models/progress.model');

class ProgressService {

  constructor() {
    this.progress = [];
    this.generate();
  }

  generate() {
    const limit = 50;
    for (let index = 0; index < limit; index++)
      this.progress.push({
        idProgress: faker.datatype.uuid(),
        student: faker.name.findName(),
        progress: faker.random.words(),
        level: faker.datatype.number()
      });

  }

  find(size) {
    const progress = this.progress.filter((item, index) => item && index < size);
    if (!progress || progress.length < 1)
      throw boom.notFound('No hay avances para este curso');
    return progress;
  }

  create(data) {
    const newProgress = {
      idProgress: faker.datatype.uuid(),
      ...data //PASAR TODOS LOS ELEMENTOS
    }
    this.progress.push(newProgress);
    return newProgress;
  }

  findOne(idProgress) {
    const progress = this.progress.find((item) => item.idProgress === idProgress)
    if (!progress)
      throw boom.notFound('No existe ese progreso');
    return progress;
  }

  update(idProgress, changes) {
    const index = this.progress.findIndex(item => item.idProgress === idProgress);
    if (index === -1)
      throw boom.notFound('No existe progreso');

    var currentProgress = this.progress[index];
    this.progress[index] = {
      ...currentProgress,
      ...changes
    };
    return {
      old: currentProgress,
      changed: this.progress[index]
    }
  }

  delete(idProgress) {
    const index = this.progress.findIndex(item => item.idProgress === idProgress);
    if (index === -1)
      throw boom.notFound('Progreso no encontrado para eliminar');
    var currentProgress = this.progress[index];
    this.progress.splice(index, 1);
    return currentProgress;
  }

  /////////////////////////////////////////////////////////////////////DB METHODS

  async findDB(limit, filter) {
    let progresssDB = await ProgressModel.find(filter);

    if (!progresssDB || progresssDB.length < 1)
      throw boom.notFound('No hay registros actualmente');

    progresssDB = limit ? progresssDB.filter((item, index) => item && index < limit) : progresssDB;
    return progresssDB;
  }

  async createDB(data) {
    const model = new ProgressModel(data);
    await model.save();
    return data;
  }

  async findOneDB(id) {
    try {

      const progress = await ProgressModel.findOne({
        _id: id
      });
      if (!progress)
        throw boom.notFound('No se ha encontrado coincidencia');
      return progress;

    } catch (error) {
      throw boom.conflict("Error: " + error.message)
    }
  }

  async updateDB(id, changes) {
    let progress = await ProgressModel.findOne({
      _id: id
    });
    if (!progress)
      throw boom.notFound('No se ha encontrado coincidencia');

    let progressOrigin = {
      level: progress.level
    };

    const { level } = changes;
    progress.level = level;
    progress.save();

    return {
      old: progressOrigin,
      changed: progress
    }
  }

  async deleteDB(id) {
    let progress = await ProgressModel.findOne({
      _id: id
    });
    const { deletedCount } = await ProgressModel.deleteOne({
      _id: id
    });
    if (deletedCount <= 0)
      throw boom.notFound('No se ha encontrado coincidencia');
    return progress;
  }

}

module.exports = ProgressService;
