const faker = require('faker');
const boom = require('@hapi/boom');

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
        course: faker.random.words(),
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

}

module.exports = ProgressService;
