const faker = require('faker');
const boom = require('@hapi/boom');
const UserModel = require('./../models/users.model');

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
    const user = this.users.find((item) => item.id === id);
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

  /////////////////////////////////////////////////////////////////////DB METHODS

  async findDB(limit, filter) {
    let usersDB = await UserModel.find(filter);

    if (!usersDB || usersDB.length < 1)
      throw boom.notFound('No hay registros actualmente');

    usersDB = limit ? usersDB.filter((item, index) => item && index < limit) : usersDB;
    return usersDB;
  }

  async createDB(data) {
    const model = new UserModel(data);
    await model.save();
    return data;
  }

  async findOneDB(id) {
    try {

      const user = await UserModel.findOne({
        _id: id
      });
      if (!user)
        throw boom.notFound('No se ha encontrado coincidencia');
      return user;

    } catch (error) {
      throw boom.conflict("Error: " + error.message)
    }
  }

  async updateDB(id, changes) {
    let user = await UserModel.findOne({
      _id: id
    });
    if (!user)
      throw boom.notFound('No se ha encontrado coincidencia');

    let userOrigin = {
      name: user.name,
      avatar: user.avatar
    };

    const { name, avatar } = changes;
    user.name = name;
    user.avatar = avatar;
    user.save();

    return {
      old: userOrigin,
      changed: user
    }
  }

  async deleteDB(id) {
    let user = await UserModel.findOne({
      _id: id
    });
    const { deletedCount } = await UserModel.deleteOne({
      _id: id
    });
    if (deletedCount <= 0)
      throw boom.notFound('No se ha encontrado coincidencia');
    return user;
  }

}

module.exports = UserService;
