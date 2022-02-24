const Joi = require('joi');

const idCourse = Joi.string().uuid();
const title = Joi.string().min(5).max(50);
const image = Joi.string().min(5);
const description = Joi.string().min(5);
const price = Joi.number().min(0);
const school = Joi.string().min(3).max(25);

const createCourseDto = Joi.object({
  title: title.required(),
  image: image.required(),
  description: description.required(),
  price: price.required(),
  school: school.required()
});

const updateCourseDto = Joi.object({
  title: title,
  image: image,
  description: description,
  price: price,
  school: school
});

const getCourseId = Joi.object({
  idCourse: idCourse.required(),
});

module.exports = { createCourseDto, updateCourseDto, getCourseId };
