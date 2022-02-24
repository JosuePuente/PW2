const faker = require('faker');
const boom = require('@hapi/boom');

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

}

module.exports = MultimediaService;
