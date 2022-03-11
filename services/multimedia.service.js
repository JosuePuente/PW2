const faker = require('faker');
const boom = require('@hapi/boom');
const MultimediaModel = require('./../models/multimedia.model');

class MultimediaService {

  constructor() {
    this.multimedia = [];
    this.generate();
  }

  generate() {
    const limit = 50;
    for (let index = 0; index < limit; index++)
      this.multimedia.push({
        idMultimedia: faker.datatype.uuid(),
        path: faker.image.imageUrl(),
        type: faker.random.word(),
        description: faker.random.words(),
        level: faker.datatype.number()
      });

  }

  find(size) {
    const multimedia = this.multimedia.filter((item, index) => item && index < size);
    if (!multimedia || multimedia.length < 1)
      throw boom.notFound('No hay multimedia aún');
    return multimedia;
  }

  create(data) {
    const newMultimedia = {
      idMultimedia: faker.datatype.uuid(),
      ...data //PASAR TODOS LOS ELEMENTOS
    }
    this.multimedia.push(newMultimedia);
    return newMultimedia;
  }

  findOne(idMultimedia) {
    const multimedia = this.multimedia.find((item) => item.idMultimedia === idMultimedia)
    if (!multimedia)
      throw boom.notFound('Id Multimedia no encontrado');
    return multimedia;
  }

  update(idMultimedia, changes) {
    const index = this.multimedia.findIndex(item => item.idMultimedia === idMultimedia);
    if (index === -1)
      throw boom.notFound('No existe esa multimedia');

    var currentMultimedia = this.multimedia[index];
    this.multimedia[index] = {
      ...currentMultimedia,
      ...changes
    };
    return {
      old: currentMultimedia,
      changed: this.multimedia[index]
    }
  }

  delete(idMultimedia) {
    const index = this.multimedia.findIndex(item => item.idMultimedia === idMultimedia);
    if (index === -1)
      throw boom.notFound('Multimedia no encontrada para eliminar');
    var currentMultimedia = this.multimedia[index];
    this.multimedia.splice(index, 1);
    return currentMultimedia;
  }

  /////////////////////////////////////////////////////////////////////DB METHODS

  async findDB(limit, filter) {
    let multisDB = await MultimediaModel.find(filter);

    if (!multisDB || multisDB.length < 1)
      throw boom.notFound('No hay registros actualmente');

    multisDB = limit ? multisDB.filter((item, index) => item && index < limit) : multisDB;
    return multisDB;
  }

  async createDB(data) {
    const model = new MultimediaModel(data);
    await model.save();
    return data;
  }

  async findOneDB(id) {
    try {

      const multi = await MultimediaModel.findOne({
        _id: id
      });
      if (!multi)
        throw boom.notFound('No se ha encontrado coincidencia');
      return multi;

    } catch (error) {
      throw boom.conflict("Error: " + error.message)
    }
  }

  async updateDB(id, changes) {
    let multi = await MultimediaModel.findOne({
      _id: id
    });
    if (!multi)
      throw boom.notFound('No se ha encontrado coincidencia');

    let multiOrigin = {
      path: multi.path,
      type: multi.type,
      description: multi.description,
      level: multi.level
    };

    const { path, type, description, level } = changes;
    multi.path = path;
    multi.type = type;
    multi.description = description;
    multi.level = level;
    multi.save();

    return {
      old: multiOrigin,
      changed: multi
    }
  }

  async deleteDB(id) {
    let multi = await MultimediaModel.findOne({
      _id: id
    });
    const { deletedCount } = await MultimediaModel.deleteOne({
      _id: id
    });
    if (deletedCount <= 0)
      throw boom.notFound('No se ha encontrado coincidencia');
    return multi;
  }

}

module.exports = MultimediaService;
