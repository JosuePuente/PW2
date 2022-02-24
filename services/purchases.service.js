const faker = require('faker');
const boom = require('@hapi/boom');

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
        course: faker.random.words(),
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

}

module.exports = PurchasesService;
