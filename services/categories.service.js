const faker = require('faker');
const boom = require('@hapi/boom');
const CategoryModel = require('./../models/categories.model')

class CategoriesService {

  constructor() {
    this.categories = [];
    this.generate();
  }

  generate() {
    const limit = 50;
    for (let index = 0; index < limit; index++)
      this.categories.push({
        idCategory: faker.datatype.uuid(),
        category: faker.random.words()
      });

  }

  find(size) {
    const categories = this.categories.filter((item, index) => item && index < size);
    if (!categories || categories.length < 1)
      throw boom.notFound('No hay categorías aún');
    return categories;
  }

  create(data) {
    const newCategory = {
      idCategory: faker.datatype.uuid(),
      ...data //PASAR TODOS LOS ELEMENTOS
    }
    this.categories.push(newCategory);
    return newCategory;
  }

  findOne(idCategory) {
    const category = this.categories.find((item) => item.idCategory === idCategory)
    if (!category)
      throw boom.notFound('No existe esa categoría');
    return category;
  }

  update(idCategory, changes) {
    const index = this.categories.findIndex(item => item.idCategory === idCategory);
    if (index === -1)
      throw boom.notFound('No existe esa categoría');

    var currentCategories = this.categories[index];
    this.categories[index] = {
      ...currentCategories,
      ...changes
    };
    return {
      old: currentCategories,
      changed: this.categories[index]
    }
  }

  delete(idCategory) {
    const index = this.categories.findIndex(item => item.idCategory === idCategory);
    if (index === -1)
      throw boom.notFound('Categoría no encontrada para eliminar');
    var currentCategories = this.categories[index];
    this.categories.splice(index, 1);
    return currentCategories;
  }

  /////////////////////////////////////////////////////////////////////DB METHODS

  async findDB(limit, filter) {
    let categoriesDB = await CategoryModel.find(filter);

    if (!categoriesDB || categoriesDB.length < 1)
      throw boom.notFound('No hay categorías registradas');

    categoriesDB = limit ? categoriesDB.filter((item, index) => item && index < limit) : categoriesDB;
    return categoriesDB;
  }

  async createDB(data) {
    const model = new CategoryModel(data);
    await model.save();
    return data;
  }

  async findOneDB(id) {
    try {

      const category = await CategoryModel.findOne({
        _id: id
      });
      if (!category)
        throw boom.notFound('Categoría no encontrada');
      return category;

    } catch (error) {
      throw boom.conflict("Error: " + error.message)
    }
  }

  async updateDB(id, changes) {
    let categori = await CategoryModel.findOne({
      _id: id
    });
    if (!categori)
      throw boom.notFound('Categoría no encontrada');

    let categoryOrigin = {
      category: categori.category,
      avatar: categori.avatar
    };

    const { category } = changes;
    categori.category = category;

    categori.save();

    return {
      old: categoryOrigin,
      changed: categori
    }
  }

  async deleteDB(id) {
    let category = await CategoryModel.findOne({
      _id: id
    });
    const { deletedCount } = await CategoryModel.deleteOne({
      _id: id
    });
    if (deletedCount <= 0)
      throw boom.notFound('Categoría no encontrada');
    return category;
  }

}

module.exports = CategoriesService;
