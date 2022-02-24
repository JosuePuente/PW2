const Joi = require('joi');

const idCategory = Joi.string().uuid();
const category = Joi.string().min(3).max(25);

const createCategoriesDto = Joi.object({
  category: category.required(),
});

const updateCategoriesDto = Joi.object({
  category: category
});

const getCategoriesId = Joi.object({
  idCategory: idCategory.required(),
});

module.exports = { createCategoriesDto, updateCategoriesDto, getCategoriesId };
