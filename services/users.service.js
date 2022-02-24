const faker = require('faker');
const boom = require('@hapi/boom');

class UserService {

  constructor() {
    this.users = [];
    this.generate();
  }

  generate() {
    const limit = 50;
    for (let index = 0; index < limit; index++) {
      let tipo = faker.datatype.number();
      tipo = tipo % 2;
      this.users.push({
        id: faker.datatype.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        avatar: faker.image.imageUrl(),
        type: tipo
      });
    }
  }

  find(size) {
    const users = this.users.filter((item, index) => item && index < size);
    if (!users || users.length < 1)
      throw boom.notFound('No hay usuarios registrados');
    return users;
  }

  create(data) {
    const newUser = {
      id: faker.datatype.uuid(),
      ...data //PASAR TODOS LOS ELEMENTOS
    }
    this.users.push(newUser);
    return newUser;
  }

  findOne(id) {
    const user = this.users.find((item) => item.id === id)
    if (!user)
      throw boom.notFound('El usuario no fue encontrado');
    return user;
  }

  update(id, changes) {
    const index = this.users.findIndex(item => item.id === id);
    if (index === -1)
      throw boom.notFound('Usuario no encontrado');

    var currentUser = this.users[index];
    this.users[index] = {
      ...currentUser,
      ...changes
    };
    return {
      old: currentUser,
      changed: this.users[index]
    }
  }

  delete(id) {
    const index = this.users.findIndex(item => item.id === id);
    if (index === -1)
      throw boom.notFound('Usuario no encontrado para eliminar');
    var currentUser = this.users[index];
    this.users.splice(index, 1);
    return currentUser;
  }

}

module.exports = UserService;
