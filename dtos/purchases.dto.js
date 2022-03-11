const Joi = require('joi');

const idPurchases = Joi.string();
const type = Joi.number().integer().min(0).max(2);
const student = Joi.string().min(3).max(25);
const course = Joi.string().min(5).max(50);
const school = Joi.string().min(3).max(25);

const createPurchasesDto = Joi.object({
  type: type.required(),
  student: student.required(),
  course: course.required(),
  school: school.required()
});

const updatePurchasesDto = Joi.object({
  student: student,
  course: course,
  school: school
});

const getPurchasesId = Joi.object({
  idPurchases: idPurchases.required(),
});

module.exports = { createPurchasesDto, updatePurchasesDto, getPurchasesId };
