const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().min(3).max(25);
const email = Joi.string().email();
const password = Joi.string().alphanum().min(5).max(25);
const avatar = Joi.string().min(5);
const type = Joi.number().integer().min(0).max(1);
const status = Joi.number().integer().min(0).max(1);

const createUserDto = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
  avatar: avatar,
  type: type.required()
});

const updateUserDto = Joi.object({
  name: name,
  avatar: avatar,
  type: type,
  status: status
});

const getUserId = Joi.object({
  id: id.required(),
});

module.exports = { createUserDto, updateUserDto, getUserId };
