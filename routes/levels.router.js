const express = require('express');
const LevelsService = require('../services/levels.service');
const service = new LevelsService();
const validatorHandler = require('./../middlewares/validator.handler');
const { createLevelDto, updateLevelDto, getLevelId } = require('./../dtos/levels.dto');

const router = express.Router();

//GET ALL LEVELS
router.get('/', (req, res, next) => {
  try {
    const { size } = req.query;
    const levels = service.find(size || 10);
    res.json({
      'success': true,
      'message': 'Estos son los niveles guardados actualmente',
      'Data': levels
    });
  } catch (error) {
    next(error);
  }

});

////////////////////////////////CREATE A NEW LEVEL
router.post('/', validatorHandler(createLevelDto, 'body'), (req, res) => {
  const body = req.body;
  const level = service.create(body);
  res.json({
    'success': true,
    'message': 'Se ha creado con éxito',
    'data': level
  });
});

////////////////////////////////GET LEVEL BY ID
router.get('/:idLevel', validatorHandler(getLevelId, 'params'), (req, res, next) => {
  try {
    const { idLevel } = req.params;
    const level = service.findOne(idLevel);
    res.json({
      'success': true,
      'message': 'Nivel encontrado',
      'data': level
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:idLevel', validatorHandler(getLevelId, 'params'), validatorHandler(updateLevelDto, 'body'),
  (req, res, next) => {
    try {
      const { idLevel } = req.params;
      const body = req.body;
      const { old, changed } = service.update(idLevel, body);
      res.json({
        'success': true,
        'message': 'Se ha actualizado con éxito',
        'data': {
          "original": old,
          "Modificado": changed
        }
      });
    } catch (error) {
      next(error);
    }
  });

router.delete('/:idLevel', validatorHandler(getLevelId, 'params'), (req, res, next) => {
  try {
    const { idLevel } = req.params;
    const level = service.delete(idLevel);
    res.json({
      'success': true,
      'message': 'Se ha eliminado con éxito',
      'data': level
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
