const Joi = require('joi');

const idLevel = Joi.string();
const title = Joi.string().min(5).max(50);
const video = Joi.string().min(5);
const description = Joi.string().min(5);
const number = Joi.number().min(1);
const course = Joi.string().min(5).max(50);

const createLevelDto = Joi.object({
  title: title.required(),
  video: video.required(),
  description: description.required(),
  number: number.required(),
  course: course.required()
});

const updateLevelDto = Joi.object({
  title: title,
  video: video,
  description: description,
  number: number,
  course: course
});

const getLevelId = Joi.object({
  idLevel: idLevel.required(),
});

module.exports = { createLevelDto, updateLevelDto, getLevelId };
