const faker = require('faker');
const boom = require('@hapi/boom');

class certificationService {

  constructor() {
    this.certifications = [];
    this.generate();
  }

  generate() {
    const limit = 50;
    for (let index = 0; index < limit; index++)
      this.certifications.push({
        idCertification: faker.datatype.uuid(),
        student: faker.name.findName(),
        course: faker.random.words()
      });

  }

  find(size) {
    const certifications = this.certifications.filter((item, index) => item && index < size);
    if (!certifications || certifications.length < 1)
      throw boom.notFound('No hay certificados actualmente');
    return certifications;
  }

  create(data) {
    const newCertification = {
      idCertification: faker.datatype.uuid(),
      ...data //PASAR TODOS LOS ELEMENTOS
    }
    this.certifications.push(newCertification);
    return newCertification;
  }

  findOne(idCertification) {
    const certification = this.certifications.find((item) => item.idCertification === idCertification)
    if (!certification)
      throw boom.notFound('No existe ese certificado');
    return certification;
  }

  update(idCertification, changes) {
    const index = this.certifications.findIndex(item => item.idCertification === idCertification);
    if (index === -1)
      throw boom.notFound('No existe ese certificado');

    var currentCertification = this.certifications[index];
    this.certifications[index] = {
      ...currentCertification,
      ...changes
    };
    return {
      old: currentCertification,
      changed: this.certifications[index]
    }
  }

  delete(idCertification) {
    const index = this.certifications.findIndex(item => item.idCertification === idCertification);
    if (index === -1)
      throw boom.notFound('Certificado no encontrado para eliminar');
    var currentCertification = this.certifications[index];
    this.certifications.splice(index, 1);
    return currentCertification;
  }

}

module.exports = certificationService;
