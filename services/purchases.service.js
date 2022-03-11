const faker = require('faker');
const boom = require('@hapi/boom');
const PurchaseModel = require('./../models/purchases.model');

class PurchasesService {

  constructor() {
    this.purchases = [];
    this.generate();
  }

  generate() {
    const limit = 50;
    for (let index = 0; index < limit; index++) {
      let tipo = faker.datatype.number();
      tipo = tipo % 3;
      this.purchases.push({
        idPurchases: faker.datatype.uuid(),
        type: tipo,
        student: faker.name.findName(),
        ddpurchase: faker.random.words(),
        school: faker.name.findName()
      });
    }
  }

  find(size) {
    const purchases = this.purchases.filter((item, index) => item && index < size);
    if (!purchases || purchases.length < 1)
      throw boom.notFound('No hay compras hechas');
    return purchases;
  }

  create(data) {
    const newPurchase = {
      idPurchases: faker.datatype.uuid(),
      ...data //PASAR TODOS LOS ELEMENTOS
    }
    this.purchases.push(newPurchase);
    return newPurchase;
  }

  findOne(idPurchases) {
    const purchase = this.purchases.find((item) => item.idPurchases === idPurchases)
    if (!purchase)
      throw boom.notFound('No existe esa compra');
    return purchase;
  }

  update(idPurchases, changes) {
    const index = this.purchases.findIndex(item => item.idPurchases === idPurchases);
    if (index === -1)
      throw boom.notFound('No existe esa compra');

    var currentPurchases = this.purchases[index];
    this.purchases[index] = {
      ...currentPurchases,
      ...changes
    };
    return {
      old: currentPurchases,
      changed: this.purchases[index]
    }
  }

  delete(idPurchases) {
    const index = this.purchases.findIndex(item => item.idPurchases === idPurchases);
    if (index === -1)
      throw boom.notFound('Compra no encontrada para eliminar');
    var currentPurchases = this.purchases[index];
    this.purchases.splice(index, 1);
    return currentPurchases;
  }

  /////////////////////////////////////////////////////////////////////DB METHODS

  async findDB(limit, filter) {
    let ddpurchasesDB = await PurchaseModel.find(filter);

    if (!ddpurchasesDB || ddpurchasesDB.length < 1)
      throw boom.notFound('No hay registros actualmente');

    ddpurchasesDB = limit ? ddpurchasesDB.filter((item, index) => item && index < limit) : ddpurchasesDB;
    return ddpurchasesDB;
  }

  async createDB(data) {
    const model = new PurchaseModel(data);
    await model.save();
    return data;
  }

  async findOneDB(id) {
    try {

      const ddpurchase = await PurchaseModel.findOne({
        _id: id
      });
      if (!ddpurchase)
        throw boom.notFound('No se ha encontrado coincidencia');
      return ddpurchase;

    } catch (error) {
      throw boom.conflict("Error: " + error.message)
    }
  }

  async updateDB(id, changes) {
    let ddpurchase = await PurchaseModel.findOne({
      _id: id
    });
    if (!ddpurchase)
      throw boom.notFound('No se ha encontrado coincidencia');

    let ddpurchaseOrigin = {
      student: ddpurchase.student,
      course: ddpurchase.course,
      school: ddpurchase.school
    };

    const { student, course, school } = changes;
    ddpurchase.student = student;
    ddpurchase.course = course;
    ddpurchase.school = school;
    ddpurchase.save();

    return {
      old: ddpurchaseOrigin,
      changed: ddpurchase
    }
  }

  async deleteDB(id) {
    let ddpurchase = await PurchaseModel.findOne({
      _id: id
    });
    const { deletedCount } = await PurchaseModel.deleteOne({
      _id: id
    });
    if (deletedCount <= 0)
      throw boom.notFound('No se ha encontrado coincidencia');
    return ddpurchase;
  }

}

module.exports = PurchasesService;
