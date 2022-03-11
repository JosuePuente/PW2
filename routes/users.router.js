const express = require('express');
const UserService = require('../services/users.service');
const service = new UserService();
const validatorHandler = require('./../middlewares/validator.handler');
const { createUserDto, updateUserDto, getUserId } = require('./../dtos/users.dto');

const router = express.Router();

//GET ALL USERS
router.get('/', async (req, res, next) => {
  try {
    const { size } = req.query;
    const filter = req.body;
    const users = await service.findDB(size || 10, filter);
    res.json({
      'success': true,
      'message': 'Estos son los registros encontrados',
      'Data': users
    });
  } catch (error) {
    next(error);
  }

});

////////////////////////////////CREATE A NEW USER
router.post('/', validatorHandler(createUserDto, 'body'), async (req, res) => {
  const body = req.body;
  const user = await service.createDB(body);
  res.json({
    'success': true,
    'message': 'Se ha registrado con éxito',
    'data': user
  });
});

////////////////////////////////GET USER BY ID
router.get('/:id', validatorHandler(getUserId, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await service.findOneDB(id);
    res.json({
      'success': true,
      'message': 'Concidencia encontrada',
      'data': user
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', validatorHandler(getUserId, 'params'), validatorHandler(updateUserDto, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const { old, changed } = await service.updateDB(id, body);
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

router.delete('/:id', validatorHandler(getUserId, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await service.deleteDB(id);
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
