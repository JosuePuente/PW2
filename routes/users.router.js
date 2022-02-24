const express = require('express');
const UserService = require('../services/users.service');
const service = new UserService();
const validatorHandler = require('./../middlewares/validator.handler');
const { createUserDto, updateUserDto, getUserId } = require('./../dtos/users.dto');

const router = express.Router();

//GET ALL USERS
router.get('/', (req, res, next) => {
  try {
    const { size } = req.query;
    const users = service.find(size || 10);
    res.json({
      'success': true,
      'message': 'Estos son los usuarios encontrados',
      'Data': users
    });
  } catch (error) {
    next(error);
  }

});

////////////////////////////////CREATE A NEW USER
router.post('/', validatorHandler(createUserDto, 'body'), (req, res) => {
  const body = req.body;
  const user = service.create(body);
  res.json({
    'success': true,
    'message': 'Se ha registrado con éxito',
    'data': user
  });
});

////////////////////////////////GET USER BY ID
router.get('/:id', validatorHandler(getUserId, 'params'), (req, res, next) => {
  try {
    const { id } = req.params;
    const user = service.findOne(id);
    res.json({
      'success': true,
      'message': 'Usuario encontrado',
      'data': user
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', validatorHandler(getUserId, 'params'), validatorHandler(updateUserDto, 'body'),
  (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const { old, changed } = service.update(id, body);
      res.json({
        'success': true,
        'message': 'Se ha actuzaliado con éxito',
        'data': {
          "original": old,
          "Modificado": changed
        }
      });
    } catch (error) {
      next(error);
    }
  });

router.delete('/:id', validatorHandler(getUserId, 'params'), (req, res, next) => {
  try {
    const { id } = req.params;
    const user = service.delete(id);
    res.json({
      'success': true,
      'message': 'Se ha eliminado con éxito',
      'data': user
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
