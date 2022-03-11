const Joi = require('joi');

const idMultimedia = Joi.string();
const path = Joi.string().min(5).max(50);
const type = Joi.string().max(5);
const description = Joi.string().min(5);
const level = Joi.number().min(1);

const createMultimediaDto = Joi.object({
  path: path.required(),
  type: type.required(),
  description: description.required(),
  level: level.required()
});

const updateMultimediaDto = Joi.object({
  path: path,
  type: type,
  description: description,
  level: level
});

const getMultimediaId = Joi.object({
  idMultimedia: idMultimedia.required(),
});

module.exports = { createMultimediaDto, updateMultimediaDto, getMultimediaId };
