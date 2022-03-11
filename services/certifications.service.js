const faker = require('faker');
const boom = require('@hapi/boom');
const CertificationModel = require('./../models/certifications.model');

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

  /////////////////////////////////////////////////////////////////////DB METHODS

  async findDB(limit, filter) {
    let certiDB = await CertificationModel.find(filter);

    if (!certiDB || certiDB.length < 1)
      throw boom.notFound('No hay registros actualmente');

    certiDB = limit ? certiDB.filter((item, index) => item && index < limit) : certiDB;
    return certiDB;
  }

  async createDB(data) {
    const model = new CertificationModel(data);
    await model.save();
    return data;
  }

  async findOneDB(id) {
    try {

      const certi = await CertificationModel.findOne({
        _id: id
      });
      if (!certi)
        throw boom.notFound('No se ha encontrado coincidencia');
      return certi;

    } catch (error) {
      throw boom.conflict("Error: " + error.message)
    }
  }

  async updateDB(id, changes) {
    let certi = await CertificationModel.findOne({
      _id: id
    });
    if (!certi)
      throw boom.notFound('No se ha encontrado coincidencia');

    let certiOrigin = {
      student: certi.student,
      course: certi.course
    };

    const { student, course } = changes;
    certi.student = student;
    certi.course = course;
    certi.save();

    return {
      old: certiOrigin,
      changed: certi
    }
  }

  async deleteDB(id) {
    let certi = await CertificationModel.findOne({
      _id: id
    });
    const { deletedCount } = await CertificationModel.deleteOne({
      _id: id
    });
    if (deletedCount <= 0)
      throw boom.notFound('No se ha encontrado coincidencia');
    return certi;
  }

}

module.exports = certificationService;
