const boom = require('@hapi/boom');

const validatorHandler = (dto, prop) => {
  return (req, res, next) => {
    const data = req[prop];
    const { error } = dto.validate(data);
    if (error)
      next(boom.badRequest(error));
    next();
  }
}

module.exports = validatorHandler;
